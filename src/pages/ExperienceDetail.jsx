import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  ArrowLeft, MapPin, Star, Calendar, Clock, Users, Lock, Globe,
  Check, ChevronRight, Loader2, Wine, X, Info,
} from 'lucide-react'
import { getExperienceById, createBooking, addTableDrink } from '../lib/services'
import PromotionCard from '../components/PromotionCard'
import { TABLE_DRINK_CATALOG, DRINK_CATEGORIES } from '../data/tableDrinks'

function adaptExperience(e) {
  if (!e) return null
  const courses = {}
  ;(e.experience_courses || []).forEach(c => {
    const key = c.course_type + 's'
    if (!courses[key]) courses[key] = []
    courses[key].push(c.item_name)
  })
  const promotions = (e.experience_promotions || []).map(ep => ({
    ...(ep.promotions || {}),
    brandName: ep.promotions?.brands?.name || 'Brand Partner',
    brandLogo: ep.promotions?.brands?.logo || '🍷',
    originalPrice: ep.promotions?.original_price,
    promoPrice: ep.promotions?.promo_price,
    expiresAt: ep.promotions?.expires_at,
  })).filter(p => p.id)
  return {
    ...e,
    restaurantId: e.restaurant_id,
    restaurant: e.restaurants,
    pricePerPerson: e.price_per_person,
    seatsFilled: e.seats_filled ?? 0,
    allowTableDrinks: e.allow_table_drinks ?? true,
    courses,
    promoList: promotions,
    tableDrinks: e.table_drinks || [],
  }
}

// ─── Seats indicator ─────────────────────────────────────────

function SeatsIndicator({ filled, total }) {
  const remaining = Math.max(0, total - filled)
  const pct = total > 0 ? Math.min(100, Math.round((filled / total) * 100)) : 0
  const almostFull = pct >= 75

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="flex items-center gap-1.5 text-gray-600"><Users size={14} className="text-forest-500" /> Seats</span>
        <span className={`font-semibold ${almostFull ? 'text-coral' : 'text-charcoal'}`}>
          {remaining === 0 ? 'Fully booked' : `${remaining} of ${total} left`}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${almostFull ? 'bg-coral' : 'bg-forest-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{filled} booked</span>
        <span>{total} total</span>
      </div>
    </div>
  )
}

// ─── Existing drinks on the table ────────────────────────────

function TableDrinksDisplay({ drinks }) {
  if (!drinks.length) return null

  return (
    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
      <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
        <Wine size={13} /> Already on this table
      </p>
      <div className="space-y-2">
        {drinks.map(d => (
          <div key={d.id} className="flex items-center gap-3 text-sm">
            <span className="text-xl leading-none">{d.item_emoji}</span>
            <div className="flex-1">
              <span className="font-medium text-amber-900">{d.item_name}</span>
              {d.message && <span className="text-amber-600 text-xs ml-1.5">"{d.message}"</span>}
            </div>
            <span className="text-xs text-amber-600 font-medium">{d.diner_name.split(' ')[0]}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-amber-600 mt-3">
        🥂 Join the table and keep the good vibes going
      </p>
    </div>
  )
}

// ─── Treat the Table picker ───────────────────────────────────

function TreatTheTable({ onSelect, selected }) {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all'
    ? TABLE_DRINK_CATALOG
    : TABLE_DRINK_CATALOG.filter(d => d.category === activeCategory)

  return (
    <div>
      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 no-scrollbar">
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
            activeCategory === 'all'
              ? 'bg-forest-500 text-white border-forest-500'
              : 'border-gray-200 text-gray-500 hover:border-forest-300'
          }`}
        >
          All
        </button>
        {DRINK_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              activeCategory === cat.id
                ? 'bg-forest-500 text-white border-forest-500'
                : 'border-gray-200 text-gray-500 hover:border-forest-300'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Drink grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filtered.map(drink => {
          const isSelected = selected?.id === drink.id
          return (
            <button
              key={drink.id}
              onClick={() => onSelect(isSelected ? null : drink)}
              className={`text-left p-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-forest-500 bg-forest-50 shadow-sm'
                  : 'border-gray-100 hover:border-forest-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <span className="text-2xl leading-none mt-0.5">{drink.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-charcoal leading-tight">{drink.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{drink.description}</p>
                    {drink.serves > 1 && (
                      <p className="text-xs text-forest-500 font-medium mt-1">Serves ~{drink.serves}</p>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-charcoal">R{drink.price}</p>
                  {isSelected && <Check size={14} className="text-forest-500 ml-auto mt-1" />}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────

export default function ExperienceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [experience, setExperience] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPromos, setSelectedPromos] = useState([])
  const [selectedDrink, setSelectedDrink] = useState(null)
  const [drinkMessage, setDrinkMessage] = useState('')
  const [acceptTableDrinks, setAcceptTableDrinks] = useState(true)
  const [seats, setSeats] = useState(2)
  const [booked, setBooked] = useState(false)
  const [booking, setBooking] = useState(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')

  useEffect(() => {
    getExperienceById(Number(id)).then(({ data }) => {
      setExperience(adaptExperience(data))
      setLoading(false)
    })
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center text-gray-400">
      <Loader2 size={28} className="animate-spin mr-3" /> Loading experience…
    </div>
  )
  if (!experience) return (
    <div className="max-w-7xl mx-auto px-6 py-20 text-center text-gray-400">
      Experience not found.
      <button onClick={() => navigate(-1)} className="block mx-auto mt-4 text-forest-500 hover:underline">Go back</button>
    </div>
  )

  const restaurant = experience.restaurant || {}
  const expPromos = experience.promoList || []
  const tableDrinks = experience.tableDrinks || []
  const remaining = Math.max(0, experience.seats - experience.seatsFilled)
  const isFullyBooked = remaining === 0

  const togglePromo = id => setSelectedPromos(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const promoTotal = selectedPromos.reduce((sum, pid) => {
    const p = expPromos.find(p => p.id === pid)
    return sum + (p?.promoPrice || 0)
  }, 0)
  const drinkTotal = selectedDrink?.price || 0
  const total = (experience.pricePerPerson * seats) + promoTotal + drinkTotal

  const handleBook = async () => {
    if (!user) return navigate('/login')
    setBookingError('')
    setBookingLoading(true)

    const { data, error } = await createBooking({
      diner_id: user.id,
      experience_id: experience.id,
      seats,
      total_amount: total,
      status: 'confirmed',
      accept_table_drinks: acceptTableDrinks,
    }, selectedPromos)

    if (error) {
      setBookingLoading(false)
      return setBookingError(error.message || 'Booking failed. Please try again.')
    }

    // Save the drink contribution if one was selected
    if (selectedDrink && user) {
      await addTableDrink({
        experience_id: experience.id,
        diner_id: user.id,
        diner_name: user.name || 'A diner',
        item_id: selectedDrink.id,
        item_name: selectedDrink.label,
        item_emoji: selectedDrink.emoji,
        item_category: selectedDrink.category,
        price: selectedDrink.price,
        message: drinkMessage.trim() || null,
      })
    }

    setBookingLoading(false)
    setBooking(data)
    setBooked(true)
  }

  const allCourses = [
    ...(experience.courses.starters?.length ? [{ label: 'Starters', items: experience.courses.starters }] : []),
    ...(experience.courses.mains?.length ? [{ label: 'Mains', items: experience.courses.mains }] : []),
    ...(experience.courses.palates?.length ? [{ label: 'Palate Cleanser', items: experience.courses.palates }] : []),
    ...(experience.courses.desserts?.length ? [{ label: 'Desserts', items: experience.courses.desserts }] : []),
  ]

  // ── Confirmation screen ──────────────────────────────────────
  if (booked) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-forest-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check size={28} className="text-forest-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-charcoal mb-2">You're booked!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Table for <strong>{seats}</strong> at <strong>{restaurant.name}</strong> on{' '}
            <strong>{new Date(experience.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long' })}</strong> at <strong>{experience.time}</strong>.
          </p>

          {selectedDrink && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4 text-sm">
              <p className="font-semibold text-amber-800 mb-1">{selectedDrink.emoji} You brought {selectedDrink.label} for the table</p>
              {drinkMessage && <p className="text-amber-600 text-xs">"{drinkMessage}"</p>}
              <p className="text-xs text-amber-500 mt-1">Other diners will see this when they book 🥂</p>
            </div>
          )}

          {selectedPromos.length > 0 && (
            <div className="bg-forest-50 rounded-xl p-3 mb-4 text-sm text-forest-700">
              🥂 Your drinks promotions are confirmed — enjoy!
            </div>
          )}

          {!acceptTableDrinks && (
            <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs text-gray-500 flex items-start gap-2">
              <Info size={13} className="mt-0.5 flex-shrink-0" />
              Your preference for no surprise drinks has been noted. The restaurant will be informed.
            </div>
          )}

          <div className="border-t border-gray-100 pt-4 mb-6 text-sm space-y-1.5">
            <div className="flex justify-between text-gray-600">
              <span>Seats ({seats} × R{experience.pricePerPerson})</span>
              <span>R{experience.pricePerPerson * seats}</span>
            </div>
            {selectedPromos.map(pid => {
              const p = expPromos.find(p => p.id === pid)
              return p ? (
                <div key={pid} className="flex justify-between text-gray-600">
                  <span>{p.name}</span>
                  <span className="text-forest-500">{p.promoPrice === 0 ? 'FREE' : `R${p.promoPrice}`}</span>
                </div>
              ) : null
            })}
            {selectedDrink && (
              <div className="flex justify-between text-amber-700">
                <span>{selectedDrink.emoji} {selectedDrink.label} (for table)</span>
                <span>R{selectedDrink.price}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-charcoal pt-2 border-t border-gray-100 text-base">
              <span>Total</span><span>R{total}</span>
            </div>
          </div>
          <button onClick={() => navigate('/diner')} className="w-full py-3 bg-forest-500 text-white font-semibold rounded-xl hover:bg-forest-600 transition-colors">
            Back to My Dashboard
          </button>
        </div>
      </div>
    )
  }

  // ── Main page ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={restaurant.image_url || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 backdrop-blur border border-white/30 text-white px-4 py-2 rounded-full text-sm hover:bg-white/30 transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-white/70 text-sm font-medium mb-1">{restaurant.name}</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">{experience.name}</h1>
          <div className="flex items-center gap-4 mt-2 text-white/80 text-xs">
            <span className="flex items-center gap-1"><MapPin size={11} />{restaurant.location}</span>
            <span className="flex items-center gap-1"><Star size={11} className="fill-amber-400 text-amber-400" />{restaurant.rating}</span>
            {experience.privacy === 'Closed'
              ? <span className="flex items-center gap-1"><Lock size={11} /> Private Table</span>
              : <span className="flex items-center gap-1"><Globe size={11} /> Open Table</span>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Menu */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-display text-xl font-bold text-charcoal mb-1">The Menu</h2>
              <p className="text-gray-500 text-sm mb-5">{experience.description}</p>
              {allCourses.length === 0 ? (
                <p className="text-gray-400 text-sm">Menu details coming soon.</p>
              ) : (
                <div className="space-y-4">
                  {allCourses.map(course => (
                    <div key={course.label}>
                      <h4 className="text-xs font-bold text-forest-500 uppercase tracking-widest mb-2">{course.label}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {course.items.map(item => (
                          <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-forest-300 flex-shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* What's already on the table */}
            {tableDrinks.length > 0 && (
              <TableDrinksDisplay drinks={tableDrinks} />
            )}

            {/* Treat the Table */}
            {experience.allowTableDrinks && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between mb-1">
                  <h2 className="font-display text-xl font-bold text-charcoal">Treat the Table 🥂</h2>
                  {selectedDrink && (
                    <button onClick={() => setSelectedDrink(null)} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                      <X size={12} /> Clear
                    </button>
                  )}
                </div>
                <p className="text-gray-500 text-sm mb-5">
                  Pre-purchase something to share with everyone at the table. Other diners will see your contribution before they book — a great way to set the tone for the night.
                </p>

                <TreatTheTable onSelect={setSelectedDrink} selected={selectedDrink} />

                {selectedDrink && (
                  <div className="mt-4 bg-forest-50 rounded-xl p-4 border border-forest-100">
                    <p className="text-sm font-semibold text-forest-700 mb-2">
                      {selectedDrink.emoji} You're bringing {selectedDrink.label} — want to add a note?
                    </p>
                    <input
                      type="text"
                      value={drinkMessage}
                      onChange={e => setDrinkMessage(e.target.value)}
                      maxLength={80}
                      placeholder="e.g. Cheers to a great evening! 🥂"
                      className="input-base text-sm"
                    />
                    <p className="text-xs text-forest-500 mt-1.5">Shown to other diners on this experience card</p>
                  </div>
                )}
              </div>
            )}

            {/* Brand promotions */}
            {expPromos.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal mb-1">Available Promotions</h2>
                <p className="text-gray-500 text-sm mb-4">Brand drink deals — add them to your booking</p>
                <div className="space-y-3">
                  {expPromos.map(promo => (
                    <div key={promo.id} onClick={() => togglePromo(promo.id)}
                      className={`cursor-pointer rounded-2xl border-2 transition-all ${selectedPromos.includes(promo.id) ? 'border-forest-500 ring-2 ring-forest-500/20' : 'border-transparent hover:border-gray-200'}`}>
                      <PromotionCard promotion={promo} />
                      {selectedPromos.includes(promo.id) && (
                        <div className="bg-forest-500 text-white text-xs text-center py-1.5 rounded-b-xl font-semibold -mt-1">✓ Added to booking</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right column — booking panel ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h3 className="font-display text-lg font-bold text-charcoal mb-4">Book This Experience</h3>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="flex items-center gap-2 text-gray-600"><Calendar size={14} className="text-forest-500" /> Date</span>
                  <span className="font-medium">{new Date(experience.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="flex items-center gap-2 text-gray-600"><Clock size={14} className="text-forest-500" /> Time</span>
                  <span className="font-medium">{experience.time}</span>
                </div>
                <div className="py-2 border-b border-gray-50">
                  <SeatsIndicator filled={experience.seatsFilled} total={experience.seats} />
                </div>
              </div>

              {isFullyBooked ? (
                <div className="bg-gray-50 rounded-xl p-5 text-center text-gray-500 text-sm mb-4">
                  <p className="font-semibold text-charcoal mb-1">This table is full</p>
                  <p className="text-xs">Check back — cancellations open seats again.</p>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Number of Seats</label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setSeats(s => Math.max(1, s - 1))} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold">−</button>
                      <span className="text-xl font-bold font-display w-8 text-center">{seats}</span>
                      <button onClick={() => setSeats(s => Math.min(remaining, s + 1))} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold">+</button>
                    </div>
                  </div>

                  {/* Price summary */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Menu ({seats} × R{experience.pricePerPerson})</span>
                      <span>R{experience.pricePerPerson * seats}</span>
                    </div>
                    {selectedPromos.map(pid => {
                      const p = expPromos.find(p => p.id === pid)
                      return p ? (
                        <div key={pid} className="flex justify-between text-gray-600">
                          <span>{p.tag}</span>
                          <span className="text-forest-500">{p.promoPrice === 0 ? 'FREE' : `R${p.promoPrice}`}</span>
                        </div>
                      ) : null
                    })}
                    {selectedDrink && (
                      <div className="flex justify-between text-amber-700">
                        <span>{selectedDrink.emoji} {selectedDrink.label}</span>
                        <span>R{selectedDrink.price}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-charcoal pt-2 border-t border-gray-200 text-base">
                      <span>Total</span><span>R{total}</span>
                    </div>
                  </div>

                  {/* Opt-out */}
                  {experience.allowTableDrinks && (
                    <div className="mb-4">
                      <label className="flex items-start gap-2.5 cursor-pointer group">
                        <div className="relative mt-0.5">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={!acceptTableDrinks}
                            onChange={e => setAcceptTableDrinks(!e.target.checked)}
                          />
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${!acceptTableDrinks ? 'bg-gray-400 border-gray-400' : 'border-gray-300'}`}>
                            {!acceptTableDrinks && <Check size={10} className="text-white" />}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 leading-relaxed">
                          I'd prefer no surprise drinks from other diners tonight — thanks but no thanks!
                        </span>
                      </label>
                    </div>
                  )}

                  {bookingError && <p className="text-coral text-sm bg-red-50 px-3 py-2 rounded-lg mb-3">{bookingError}</p>}

                  <button onClick={handleBook} disabled={bookingLoading}
                    className="w-full py-3.5 bg-forest-500 text-white font-bold rounded-xl hover:bg-forest-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {bookingLoading
                      ? <><Loader2 size={16} className="animate-spin" /> Confirming…</>
                      : <>Confirm Booking <ChevronRight size={16} /></>}
                  </button>
                  {!user && <p className="text-xs text-gray-400 text-center mt-2">You'll be asked to sign in</p>}
                </>
              )}

              <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400 text-center">
                Free cancellation up to 48 hours before dining
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
