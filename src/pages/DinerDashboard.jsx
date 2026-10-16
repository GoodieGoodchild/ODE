import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Search, Filter, Users, Calendar, MapPin, Utensils, Wine, Loader2 } from 'lucide-react'
import { getExperiences, getPromotions, getOpenTables, getBookingsByDiner } from '../lib/services'
import ExperienceCard from '../components/ExperienceCard'
import PromotionCard from '../components/PromotionCard'

const tabs = ['Experiences', 'Open Tables', 'Promotions', 'My Bookings']

// Adapt Supabase shape to what ExperienceCard/PromotionCard expect
function adaptExperience(e) {
  const courses = {}
  ;(e.experience_courses || []).forEach(c => {
    if (!courses[c.course_type + 's']) courses[c.course_type + 's'] = []
    courses[c.course_type + 's'].push(c.item_name)
  })
  return {
    ...e,
    restaurantId: e.restaurant_id,
    restaurant: e.restaurants,
    pricePerPerson: e.price_per_person,
    promotions: (e.experience_promotions || []).map(ep => ep.promotion_id),
    courses,
  }
}

function adaptPromotion(p) {
  return {
    ...p,
    brandName: p.brands?.name || p.brand_name || 'Brand Partner',
    brandLogo: p.brands?.logo || '🍷',
    originalPrice: p.original_price,
    promoPrice: p.promo_price,
    expiresAt: p.expires_at,
  }
}

export default function DinerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Experiences')
  const [search, setSearch] = useState('')
  const [experiences, setExperiences] = useState([])
  const [promotions, setPromotions] = useState([])
  const [openTables, setOpenTables] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [expRes, promoRes, tableRes, bookRes] = await Promise.all([
        getExperiences(),
        getPromotions(),
        getOpenTables(),
        user?.id ? getBookingsByDiner(user.id) : Promise.resolve({ data: [] }),
      ])
      setExperiences((expRes.data || []).map(adaptExperience))
      setPromotions((promoRes.data || []).map(adaptPromotion))
      setOpenTables(tableRes.data || [])
      setBookings(bookRes.data || [])
      setLoading(false)
    }
    load()
  }, [user?.id])

  const filtered = experiences.filter(e => {
    const r = e.restaurant || e.restaurants || {}
    const q = search.toLowerCase()
    return !q || e.name.toLowerCase().includes(q) || r.name?.toLowerCase().includes(q) || r.cuisine?.toLowerCase().includes(q)
  })

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Good evening,</p>
              <h1 className="font-display text-3xl font-bold text-charcoal">{user?.name} 👋</h1>
              <p className="text-gray-500 text-sm mt-1">What experience are you looking for tonight?</p>
            </div>
            <div className="hidden md:flex items-center gap-3 bg-forest-50 rounded-2xl p-4">
              <div className="text-center px-3">
                <div className="text-2xl font-bold font-display text-forest-500">{bookings.filter(b => b.status === 'confirmed').length}</div>
                <div className="text-xs text-gray-500">Upcoming</div>
              </div>
              <div className="w-px h-8 bg-forest-200" />
              <div className="text-center px-3">
                <div className="text-2xl font-bold font-display text-forest-500">{bookings.length}</div>
                <div className="text-xs text-gray-500">Booked</div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search restaurants, cuisines, experiences…"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-400 transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              <Filter size={15} /> Filter
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-forest-500 text-forest-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <Loader2 size={28} className="animate-spin mr-3" /> Loading experiences…
          </div>
        ) : (
          <>
            {activeTab === 'Experiences' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-bold text-charcoal">Available Experiences</h2>
                  <span className="text-sm text-gray-400">{filtered.length} results</span>
                </div>
                {filtered.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <Utensils size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-gray-500 mb-1">No experiences yet</p>
                    <p className="text-sm">Check back soon — restaurants are adding new experiences.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(exp => <ExperienceCard key={exp.id} experience={exp} />)}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Open Tables' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-display text-xl font-bold text-charcoal">Open Tables</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Join a table hosted by a fellow food lover</p>
                  </div>
                  <button className="px-4 py-2 bg-forest-500 text-white text-sm font-semibold rounded-full hover:bg-forest-600 transition-colors flex items-center gap-2">
                    <Users size={14} /> Host a Table
                  </button>
                </div>
                {openTables.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <Users size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-gray-500 mb-1">No open tables right now</p>
                    <p className="text-sm">Be the first to host one!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {openTables.map(table => {
                      const exp = table.experiences || {}
                      const restaurant = exp.restaurants || {}
                      const seats = table.seats_total - table.seats_filled
                      return (
                        <div key={table.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-11 h-11 rounded-full bg-forest-500 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                              {(table.profiles?.name || 'H').split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-charcoal text-sm">{table.profiles?.name || 'Anonymous Host'}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">{table.description}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                            <span className="flex items-center gap-1"><MapPin size={11} />{restaurant.name}</span>
                            <span className="flex items-center gap-1"><Calendar size={11} />{exp.date ? new Date(exp.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }) : '—'}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            {Array.from({ length: table.seats_total }).map((_, i) => (
                              <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i < table.seats_filled ? 'bg-forest-500 text-white' : 'bg-gray-100 text-gray-300 border-2 border-dashed border-gray-200'}`}>
                                {i < table.seats_filled ? '✓' : '+'}
                              </div>
                            ))}
                            <span className="text-xs text-gray-400 ml-1">{seats} seat{seats !== 1 ? 's' : ''} left</span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                            <span className="text-forest-500 font-bold text-sm">R{exp.price_per_person}<span className="text-xs font-normal text-gray-400"> /pp</span></span>
                            <button onClick={() => navigate(`/experience/${exp.id}`)} className="px-4 py-1.5 bg-forest-500 text-white text-xs font-semibold rounded-full hover:bg-forest-600 transition-colors">Request to Join</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Promotions' && (
              <div>
                <div className="mb-6">
                  <h2 className="font-display text-xl font-bold text-charcoal">Live Drink Promotions</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Exclusive deals available when you book an experience</p>
                </div>
                {promotions.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <Wine size={40} className="mx-auto mb-3 opacity-30" />
                    <p>No promotions live yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {promotions.map(p => <PromotionCard key={p.id} promotion={p} />)}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'My Bookings' && (
              bookings.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <Calendar size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="font-medium text-gray-500 mb-1">No bookings yet</p>
                  <p className="text-sm">Browse experiences and make your first booking!</p>
                  <button onClick={() => setActiveTab('Experiences')} className="mt-4 px-6 py-2.5 bg-forest-500 text-white text-sm font-semibold rounded-full hover:bg-forest-600 transition-colors">
                    Browse Experiences
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map(b => {
                    const exp = b.experiences || {}
                    const restaurant = exp.restaurants || {}
                    return (
                      <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                        <img src={restaurant.image_url || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80'} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-charcoal">{exp.name}</h4>
                          <p className="text-xs text-gray-500">{restaurant.name} · {exp.date ? new Date(exp.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long' }) : '—'} · {exp.time}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{b.seats} seat{b.seats !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-charcoal">R{b.total_amount}</p>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${b.status === 'confirmed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                            {b.status}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  )
}
