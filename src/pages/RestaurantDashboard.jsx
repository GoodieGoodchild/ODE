import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Plus, TrendingUp, Users, Calendar, Star, Wine, ChefHat,
  Eye, Loader2, X, Check, AlertCircle, Tag
} from 'lucide-react'
import {
  getRestaurantByOwner, getExperiencesByRestaurant, getPromotions,
  getBookingsByRestaurant, getRestaurantStats, createExperience
} from '../lib/services'

const tabs = ['Overview', 'Experiences', 'Promotions', 'Bookings']

const COURSE_TYPES = [
  { key: 'starter', label: 'Starters' },
  { key: 'main', label: 'Mains' },
  { key: 'palate', label: 'Palate Cleanser' },
  { key: 'dessert', label: 'Desserts' },
]

const PROMO_TYPE_COLORS = {
  wine: 'bg-pink-50 text-pink-700 border-pink-200',
  spirits: 'bg-amber-50 text-amber-700 border-amber-200',
  beer: 'bg-green-50 text-green-700 border-green-200',
  sparkling: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  other: 'bg-gray-50 text-gray-700 border-gray-200',
}

// ─── Create Experience Modal ──────────────────────────────────
function CreateExperienceModal({ restaurantId, availablePromotions, onClose, onCreated }) {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [details, setDetails] = useState({
    name: '', description: '', date: '', time: '19:00',
    seats: 4, price_per_person: '', privacy: 'Open',
  })
  const [courses, setCourses] = useState({ starter: [], main: [], palate: [], dessert: [] })
  const [courseInput, setCourseInput] = useState({ starter: '', main: '', palate: '', dessert: '' })
  const [selectedPromos, setSelectedPromos] = useState([])

  const updateDetail = (k, v) => setDetails(d => ({ ...d, [k]: v }))

  const addCourseItem = (type) => {
    const val = courseInput[type].trim()
    if (!val) return
    setCourses(c => ({ ...c, [type]: [...c[type], val] }))
    setCourseInput(ci => ({ ...ci, [type]: '' }))
  }

  const removeCourseItem = (type, idx) => {
    setCourses(c => ({ ...c, [type]: c[type].filter((_, i) => i !== idx) }))
  }

  const togglePromo = (id) => {
    setSelectedPromos(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  }

  const totalCourseItems = Object.values(courses).flat().length

  const handleSave = async () => {
    setError('')
    setSaving(true)

    const courseRows = Object.entries(courses).flatMap(([type, items]) =>
      items.map(item_name => ({ course_type: type, item_name }))
    )

    const { data, error: err } = await createExperience(
      {
        restaurant_id: restaurantId,
        name: details.name,
        description: details.description,
        date: details.date,
        time: details.time,
        seats: Number(details.seats),
        price_per_person: Number(details.price_per_person),
        privacy: details.privacy,
      },
      courseRows,
      selectedPromos
    )

    setSaving(false)
    if (err) return setError(err.message || 'Failed to create experience.')
    onCreated(data)
    onClose()
  }

  const step1Valid = details.name && details.date && details.time && details.seats && details.price_per_person

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-display text-xl font-bold text-charcoal">Create New Experience</h2>
            <div className="flex items-center gap-2 mt-1.5">
              {[1, 2, 3].map(n => (
                <div key={n} className={`flex items-center gap-1.5 ${n < step ? 'text-forest-500' : n === step ? 'text-charcoal' : 'text-gray-300'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 ${n < step ? 'bg-forest-500 border-forest-500 text-white' : n === step ? 'border-charcoal' : 'border-gray-200'}`}>
                    {n < step ? <Check size={10} /> : n}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{['Details', 'Menu', 'Promotions'][n - 1]}</span>
                  {n < 3 && <div className={`w-8 h-0.5 ${n < step ? 'bg-forest-500' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {/* Step 1 — Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Experience Name *</label>
                <input value={details.name} onChange={e => updateDetail('name', e.target.value)}
                  placeholder="e.g. Chef's Tasting Journey" className="input-base" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Description</label>
                <textarea value={details.description} onChange={e => updateDetail('description', e.target.value)}
                  placeholder="Tell diners what makes this experience special…" rows={3}
                  className="input-base resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Date *</label>
                  <input type="date" value={details.date} onChange={e => updateDetail('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]} className="input-base" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Time *</label>
                  <input type="time" value={details.time} onChange={e => updateDetail('time', e.target.value)} className="input-base" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Seats Available *</label>
                  <input type="number" min={1} max={50} value={details.seats} onChange={e => updateDetail('seats', e.target.value)}
                    placeholder="4" className="input-base" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Price / Person (R) *</label>
                  <input type="number" min={0} value={details.price_per_person} onChange={e => updateDetail('price_per_person', e.target.value)}
                    placeholder="750" className="input-base" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Table Privacy</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Open', 'Closed'].map(opt => (
                    <button key={opt} type="button" onClick={() => updateDetail('privacy', opt)}
                      className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${details.privacy === opt ? 'border-forest-500 bg-forest-50 text-forest-600' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                      {opt === 'Open' ? '🌐 Open Table' : '🔒 Private Table'}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  {details.privacy === 'Open' ? 'Other diners can request to join empty seats.' : 'Only people you invite can join.'}
                </p>
              </div>
            </div>
          )}

          {/* Step 2 — Menu Builder */}
          {step === 2 && (
            <div className="space-y-5">
              <p className="text-sm text-gray-500">Add menu items for each course. You can skip courses that don't apply.</p>
              {COURSE_TYPES.map(({ key, label }) => (
                <div key={key}>
                  <label className="text-xs font-bold text-forest-500 uppercase tracking-widest mb-2 block">{label}</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={courseInput[key]}
                      onChange={e => setCourseInput(ci => ({ ...ci, [key]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCourseItem(key))}
                      placeholder={`Add a ${label.toLowerCase().replace(/s$/, '')} item…`}
                      className="input-base flex-1 py-2"
                    />
                    <button onClick={() => addCourseItem(key)}
                      className="px-4 py-2 bg-forest-500 text-white text-sm font-semibold rounded-xl hover:bg-forest-600 transition-colors">
                      Add
                    </button>
                  </div>
                  {courses[key].length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {courses[key].map((item, idx) => (
                        <span key={idx} className="flex items-center gap-1.5 bg-forest-50 text-forest-700 text-xs px-3 py-1.5 rounded-full font-medium">
                          {item}
                          <button onClick={() => removeCourseItem(key, idx)} className="text-forest-400 hover:text-forest-700">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {totalCourseItems === 0 && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-2 rounded-lg">
                  <AlertCircle size={14} /> Add at least one menu item so diners know what to expect.
                </div>
              )}
            </div>
          )}

          {/* Step 3 — Attach Promotions */}
          {step === 3 && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Select brand promotions to offer on this experience. Diners can add them at checkout.</p>
              {availablePromotions.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <Wine size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No active promotions available yet.</p>
                  <p className="text-xs mt-1">Brand partners will appear here once they create promotions.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availablePromotions.map(p => {
                    const selected = selectedPromos.includes(p.id)
                    const colorClass = PROMO_TYPE_COLORS[p.type] || PROMO_TYPE_COLORS.other
                    return (
                      <div key={p.id} onClick={() => togglePromo(p.id)}
                        className={`cursor-pointer rounded-2xl border-2 p-4 transition-all flex items-start gap-3 ${selected ? 'border-forest-500 bg-forest-50' : 'border-gray-100 hover:border-gray-200'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${selected ? 'bg-forest-500 border-forest-500' : 'border-gray-300'}`}>
                          {selected && <Check size={11} className="text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-lg">{p.brands?.logo || '🍷'}</span>
                            <span className="font-semibold text-sm text-charcoal">{p.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${colorClass}`}>
                              <Tag size={9} className="inline mr-1" />{p.tag}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{p.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{p.brands?.name} · Expires {new Date(p.expires_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {p.promo_price === 0 ? (
                            <span className="text-forest-500 font-bold text-sm">FREE</span>
                          ) : (
                            <div>
                              <div className="text-gray-400 text-xs line-through">R{p.original_price}</div>
                              <div className="text-forest-500 font-bold text-sm">R{p.promo_price}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-coral text-sm px-3 py-2 rounded-lg">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
              Back
            </button>
          ) : (
            <button onClick={onClose} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={step === 1 && !step1Valid}
              className="flex-1 py-3 bg-forest-500 text-white font-semibold rounded-xl hover:bg-forest-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              Next →
            </button>
          ) : (
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-3 bg-forest-500 text-white font-semibold rounded-xl hover:bg-forest-600 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : '✓ Create Experience'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────
export default function RestaurantDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Overview')
  const [showNewExp, setShowNewExp] = useState(false)

  const [restaurant, setRestaurant] = useState(null)
  const [experiences, setExperiences] = useState([])
  const [promotions, setPromotions] = useState([])
  const [bookings, setBookings] = useState([])
  const [stats, setStats] = useState({ seatsBooked: 0, revenue: 0, bookingCount: 0 })
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    const { data: rest } = await getRestaurantByOwner(user.id)
    setRestaurant(rest)
    if (rest?.id) {
      const [expRes, bookRes, statsRes, promoRes] = await Promise.all([
        getExperiencesByRestaurant(rest.id),
        getBookingsByRestaurant(rest.id),
        getRestaurantStats(rest.id),
        getPromotions(),
      ])
      setExperiences(expRes.data || [])
      setBookings(bookRes.data || [])
      setStats(statsRes)
      setPromotions(promoRes.data || [])
    } else {
      const { data: promoRes } = await getPromotions()
      setPromotions(promoRes || [])
    }
    setLoading(false)
  }, [user?.id])

  useEffect(() => { load() }, [load])

  // Promotions linked to this restaurant's experiences
  const linkedPromoIds = new Set(
    experiences.flatMap(e => (e.experience_promotions || []).map(ep => ep.promotion_id))
  )

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center text-gray-400">
      <Loader2 size={28} className="animate-spin mr-3" /> Loading your restaurant…
    </div>
  )

  // No restaurant linked yet
  if (!restaurant) return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
        <ChefHat size={40} className="text-forest-500 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-charcoal mb-2">Set up your restaurant</h2>
        <p className="text-gray-500 text-sm mb-6">Your restaurant profile wasn't created during signup. Please sign out and register again as a Restaurant.</p>
        <button onClick={() => navigate('/')} className="w-full py-3 bg-forest-500 text-white font-semibold rounded-xl hover:bg-forest-600 transition-colors">
          Back to Home
        </button>
      </div>
    </div>
  )

  const upcomingExps = experiences.filter(e => new Date(e.date) >= new Date())

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-forest-500 text-white flex items-center justify-center">
                <ChefHat size={26} />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-charcoal">{restaurant.name}</h1>
                <p className="text-gray-500 text-sm">{restaurant.location || 'Add location'} · {restaurant.cuisine || 'Add cuisine'}</p>
              </div>
            </div>
            <button onClick={() => setShowNewExp(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-forest-500 text-white font-semibold rounded-full hover:bg-forest-600 transition-colors text-sm">
              <Plus size={15} /> New Experience
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

        {/* ── Overview ── */}
        {activeTab === 'Overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Seats Booked', value: stats.seatsBooked, sub: 'confirmed bookings', icon: Users, color: 'text-forest-500 bg-forest-50' },
                { label: 'Revenue (Total)', value: `R${stats.revenue.toLocaleString()}`, sub: `${stats.bookingCount} bookings`, icon: TrendingUp, color: 'text-amber-600 bg-amber-50' },
                { label: 'Active Promotions', value: linkedPromoIds.size, sub: 'across your experiences', icon: Wine, color: 'text-coral bg-red-50' },
                { label: 'Avg Rating', value: restaurant.rating || '—', sub: `${restaurant.review_count || 0} reviews`, icon: Star, color: 'text-yellow-600 bg-yellow-50' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}><s.icon size={18} /></div>
                  <div className="text-2xl font-bold font-display text-charcoal">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                  <div className="text-xs text-forest-500 font-medium mt-1">{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-charcoal flex items-center gap-2">
                    <Calendar size={16} className="text-forest-500" /> Upcoming Experiences
                  </h3>
                  <button onClick={() => setActiveTab('Experiences')} className="text-xs text-forest-500 font-semibold hover:underline">View all</button>
                </div>
                {upcomingExps.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-400 mb-3">No upcoming experiences yet.</p>
                    <button onClick={() => setShowNewExp(true)} className="px-4 py-2 bg-forest-500 text-white text-xs font-semibold rounded-full hover:bg-forest-600 transition-colors">
                      Create your first
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingExps.slice(0, 4).map(exp => (
                      <div key={exp.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="font-medium text-sm text-charcoal">{exp.name}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(exp.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })} · {exp.time} · {exp.seats} seats
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-forest-500">R{exp.price_per_person}<span className="font-normal text-xs text-gray-400">/pp</span></p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${exp.privacy === 'Open' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{exp.privacy}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-charcoal flex items-center gap-2">
                    <Wine size={16} className="text-coral" /> Brand Promotions Running
                  </h3>
                  <button onClick={() => setActiveTab('Promotions')} className="text-xs text-forest-500 font-semibold hover:underline">View all</button>
                </div>
                {linkedPromoIds.size === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Wine size={28} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No promotions attached yet.</p>
                    <p className="text-xs mt-1">Add promotions when creating an experience.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {promotions.filter(p => linkedPromoIds.has(p.id)).slice(0, 4).map(promo => (
                      <div key={promo.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                        <span className="text-2xl">{promo.brands?.logo || '🍷'}</span>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-charcoal">{promo.name}</p>
                          <p className="text-xs text-gray-400">{promo.brands?.name} · until {new Date(promo.expires_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</p>
                        </div>
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">Active</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Experiences ── */}
        {activeTab === 'Experiences' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">Your Experiences</h2>
                <p className="text-sm text-gray-500 mt-0.5">{experiences.length} total</p>
              </div>
              <button onClick={() => setShowNewExp(true)}
                className="flex items-center gap-2 px-4 py-2 bg-forest-500 text-white text-sm font-semibold rounded-full hover:bg-forest-600 transition-colors">
                <Plus size={14} /> Add New
              </button>
            </div>
            {experiences.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <ChefHat size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-500 mb-1">No experiences yet</p>
                <p className="text-sm text-gray-400 mb-4">Create your first experience to start getting bookings.</p>
                <button onClick={() => setShowNewExp(true)} className="px-6 py-2.5 bg-forest-500 text-white text-sm font-semibold rounded-full hover:bg-forest-600 transition-colors">
                  Create Experience
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {experiences.map(exp => {
                  const expPromos = (exp.experience_promotions || []).map(ep => ep.promotions).filter(Boolean)
                  return (
                    <div key={exp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="font-semibold text-charcoal">{exp.name}</h3>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${exp.privacy === 'Open' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                              {exp.privacy}
                            </span>
                            {new Date(exp.date) < new Date() && (
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-400">Past</span>
                            )}
                          </div>
                          {exp.description && <p className="text-sm text-gray-500 mb-2">{exp.description}</p>}
                          <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                            <span><Calendar size={11} className="inline mr-1" />{new Date(exp.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            <span>{exp.time}</span>
                            <span><Users size={11} className="inline mr-1" />{exp.seats} seats</span>
                            <span className="font-semibold text-forest-500">R{exp.price_per_person}/pp</span>
                          </div>
                          {expPromos.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {expPromos.map(p => (
                                <span key={p?.id} className="flex items-center gap-1 text-xs bg-forest-50 text-forest-700 px-2 py-0.5 rounded-full">
                                  <Tag size={9} />{p?.tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button onClick={() => navigate(`/experience/${exp.id}`)}
                          className="p-2 text-gray-400 hover:text-forest-500 hover:bg-forest-50 rounded-lg transition-colors flex-shrink-0">
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Promotions ── */}
        {activeTab === 'Promotions' && (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-xl font-bold text-charcoal">Available Brand Promotions</h2>
              <p className="text-sm text-gray-500 mt-0.5">Attach these to your experiences when creating or editing them</p>
            </div>
            {promotions.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Wine size={40} className="mx-auto mb-3 opacity-30" />
                <p>No brand promotions available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {promotions.map(promo => {
                  const isLinked = linkedPromoIds.has(promo.id)
                  return (
                    <div key={promo.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${isLinked ? 'border-forest-200' : 'border-gray-100'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{promo.brands?.logo || '🍷'}</span>
                          <div>
                            <p className="font-semibold text-sm text-charcoal">{promo.brands?.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{promo.type}</p>
                          </div>
                        </div>
                        {isLinked
                          ? <span className="bg-forest-50 text-forest-700 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1"><Check size={10} /> In Use</span>
                          : <span className="bg-gray-50 text-gray-500 text-xs px-2.5 py-1 rounded-full font-medium">Available</span>
                        }
                      </div>
                      <h4 className="font-semibold text-charcoal mb-1">{promo.name}</h4>
                      <p className="text-xs text-gray-500 mb-3">{promo.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Expires {new Date(promo.expires_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</span>
                        <span className="text-forest-500 font-semibold">{promo.discount || (promo.promo_price === 0 ? 'FREE' : `R${promo.promo_price}`)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Bookings ── */}
        {activeTab === 'Bookings' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-display font-bold text-charcoal">Bookings</h2>
              <span className="text-sm text-gray-400">{bookings.length} total</span>
            </div>
            {bookings.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Calendar size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No bookings yet — they'll appear here once diners start booking.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <tr>
                      <th className="px-5 py-3 text-left">Diner</th>
                      <th className="px-5 py-3 text-left">Experience</th>
                      <th className="px-5 py-3 text-left">Date</th>
                      <th className="px-5 py-3 text-left">Seats</th>
                      <th className="px-5 py-3 text-left">Total</th>
                      <th className="px-5 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-charcoal">{b.profiles?.name || 'Guest'}</td>
                        <td className="px-5 py-3.5 text-gray-600">{b.experiences?.name || '—'}</td>
                        <td className="px-5 py-3.5 text-gray-600">
                          {b.experiences?.date ? new Date(b.experiences.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }) : '—'}
                        </td>
                        <td className="px-5 py-3.5 text-gray-600">{b.seats}</td>
                        <td className="px-5 py-3.5 font-semibold text-charcoal">R{parseFloat(b.total_amount).toLocaleString()}</td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${b.status === 'confirmed' ? 'bg-green-50 text-green-700' : b.status === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {showNewExp && (
        <CreateExperienceModal
          restaurantId={restaurant.id}
          availablePromotions={promotions}
          onClose={() => setShowNewExp(false)}
          onCreated={() => load()}
        />
      )}
    </div>
  )
}
