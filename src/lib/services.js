import { supabase } from './supabase'

// ─── Restaurants ──────────────────────────────────────────────
export async function getRestaurants() {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}

export async function getRestaurantByOwner(ownerId) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('owner_id', ownerId)
    .single()
  return { data, error }
}

export async function updateRestaurant(id, updates) {
  const { data, error } = await supabase
    .from('restaurants')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

// ─── Experiences ──────────────────────────────────────────────
export async function getExperiences() {
  const { data, error } = await supabase
    .from('experiences')
    .select(`
      *,
      restaurants ( id, name, location, cuisine, image_url, rating, review_count, price_range ),
      experience_courses ( course_type, item_name ),
      experience_promotions ( promotion_id, promotions ( id, name, tag, type, color, original_price, promo_price, expires_at, brands ( name, logo ) ) ),
      table_drinks ( id, diner_name, item_emoji, item_name, created_at )
    `)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
  return { data: data || [], error }
}

export async function getExperienceById(id) {
  const { data, error } = await supabase
    .from('experiences')
    .select(`
      *,
      restaurants ( * ),
      experience_courses ( course_type, item_name ),
      experience_promotions ( promotion_id, promotions ( *, brands ( name, logo ) ) ),
      table_drinks ( id, diner_id, diner_name, item_id, item_name, item_emoji, item_category, price, message, created_at )
    `)
    .eq('id', id)
    .single()
  return { data, error }
}

export async function getExperiencesByRestaurant(restaurantId) {
  const { data, error } = await supabase
    .from('experiences')
    .select(`
      *,
      experience_courses ( course_type, item_name ),
      experience_promotions ( promotion_id, promotions ( id, name, tag, type, color, brands ( name, logo ) ) )
    `)
    .eq('restaurant_id', restaurantId)
    .order('date', { ascending: true })
  return { data: data || [], error }
}

export async function createExperience(experience, courses = [], promotionIds = []) {
  const { data, error } = await supabase
    .from('experiences')
    .insert(experience)
    .select()
    .single()
  if (error) return { error }

  const promises = []
  if (courses.length > 0) {
    promises.push(
      supabase.from('experience_courses').insert(
        courses.map(c => ({ experience_id: data.id, ...c }))
      )
    )
  }
  if (promotionIds.length > 0) {
    promises.push(
      supabase.from('experience_promotions').insert(
        promotionIds.map(pid => ({ experience_id: data.id, promotion_id: pid }))
      )
    )
  }
  await Promise.all(promises)
  return { data }
}

export async function linkPromotionToExperience(experienceId, promotionId) {
  const { data, error } = await supabase
    .from('experience_promotions')
    .upsert({ experience_id: experienceId, promotion_id: promotionId })
  return { data, error }
}

export async function unlinkPromotionFromExperience(experienceId, promotionId) {
  const { error } = await supabase
    .from('experience_promotions')
    .delete()
    .eq('experience_id', experienceId)
    .eq('promotion_id', promotionId)
  return { error }
}

// ─── Promotions ───────────────────────────────────────────────
export async function getPromotions() {
  const { data, error } = await supabase
    .from('promotions')
    .select(`*, brands ( name, logo, category )`)
    .gte('expires_at', new Date().toISOString().split('T')[0])
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}

export async function getPromotionsByBrand(brandId) {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('brand_id', brandId)
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}

export async function createPromotion(promotion) {
  const { data, error } = await supabase
    .from('promotions')
    .insert(promotion)
    .select()
    .single()
  return { data, error }
}

// ─── Bookings ─────────────────────────────────────────────────
export async function createBooking(booking, promotionIds = []) {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single()
  if (error) return { error }

  if (promotionIds.length > 0) {
    await supabase.from('booking_promotions').insert(
      promotionIds.map(pid => ({ booking_id: data.id, promotion_id: pid }))
    )
  }
  return { data }
}

export async function getBookingsByDiner(dinerId) {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      experiences (
        name, date, time, price_per_person,
        restaurants ( name, location, image_url )
      ),
      booking_promotions ( promotions ( name, tag ) )
    `)
    .eq('diner_id', dinerId)
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}

export async function getBookingsByRestaurant(restaurantId) {
  // Get experience IDs for this restaurant first
  const { data: exps } = await supabase
    .from('experiences')
    .select('id')
    .eq('restaurant_id', restaurantId)

  if (!exps?.length) return { data: [] }

  const expIds = exps.map(e => e.id)
  const { data, error } = await supabase
    .from('bookings')
    .select(`*, experiences ( name, date, time ), profiles ( name )`)
    .in('experience_id', expIds)
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}

export async function getRestaurantStats(restaurantId) {
  const { data: exps } = await supabase
    .from('experiences')
    .select('id')
    .eq('restaurant_id', restaurantId)

  if (!exps?.length) return { seatsBooked: 0, revenue: 0, bookingCount: 0 }

  const expIds = exps.map(e => e.id)
  const { data: bookings } = await supabase
    .from('bookings')
    .select('seats, total_amount, status')
    .in('experience_id', expIds)
    .eq('status', 'confirmed')

  const seatsBooked = (bookings || []).reduce((s, b) => s + (b.seats || 0), 0)
  const revenue = (bookings || []).reduce((s, b) => s + parseFloat(b.total_amount || 0), 0)
  return { seatsBooked, revenue, bookingCount: (bookings || []).length }
}

// ─── Open Tables ──────────────────────────────────────────────
export async function getOpenTables() {
  const { data, error } = await supabase
    .from('open_tables')
    .select(`
      *,
      experiences ( *, restaurants ( name, location, image_url ) ),
      profiles ( name )
    `)
    .order('created_at', { ascending: false })
  // Filter client-side: only show tables that still have seats
  const filtered = (data || []).filter(t => t.seats_filled < t.seats_total)
  return { data: filtered, error }
}

export async function createOpenTable(openTable) {
  const { data, error } = await supabase
    .from('open_tables')
    .insert(openTable)
    .select()
    .single()
  return { data, error }
}

// ─── Table Drinks ─────────────────────────────────────────────

export async function getTableDrinks(experienceId) {
  const { data, error } = await supabase
    .from('table_drinks')
    .select('*')
    .eq('experience_id', experienceId)
    .order('created_at', { ascending: true })
  return { data: data || [], error }
}

export async function addTableDrink(drink) {
  const { data, error } = await supabase
    .from('table_drinks')
    .insert(drink)
    .select()
    .single()
  return { data, error }
}

export async function removeTableDrink(id, dinerId) {
  const { error } = await supabase
    .from('table_drinks')
    .delete()
    .eq('id', id)
    .eq('diner_id', dinerId)
  return { error }
}

// ─── API Quota ────────────────────────────────────────────────
// Tracks monthly usage of paid external APIs so we never exceed
// our self-imposed cap (VITE_*_MONTHLY_QUOTA env vars).
// Table: api_quota (service text, month text, count int)
// month format: "YYYY-MM"

function currentMonth() {
  return new Date().toISOString().slice(0, 7) // "2026-06"
}

export async function getQuotaUsage(service) {
  const { data } = await supabase
    .from('api_quota')
    .select('count')
    .eq('service', service)
    .eq('month', currentMonth())
    .single()
  return data?.count || 0
}

export async function incrementQuota(service) {
  const month = currentMonth()
  // Upsert: insert row if not exists, increment count if it does
  const { error } = await supabase.rpc('increment_api_quota', { p_service: service, p_month: month })
  return { error }
}

// ─── Brands ───────────────────────────────────────────────────
export async function getBrandByOwner(ownerId) {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('owner_id', ownerId)
    .single()
  return { data, error }
}

export async function updateBrand(id, updates) {
  const { data, error } = await supabase
    .from('brands')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}
