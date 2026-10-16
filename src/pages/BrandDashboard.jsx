import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  Plus, TrendingUp, Users, Wine, BarChart2, DollarSign,
  Target, Loader2, X, AlertCircle, Check, Tag
} from 'lucide-react'
import { getBrandByOwner, getPromotionsByBrand, getRestaurants, createPromotion } from '../lib/services'

const tabs = ['Overview', 'My Promotions', 'Restaurant Network', 'Analytics']

const PROMO_TYPES = [
  { id: 'wine', label: '🍷 Wine', color: 'border-pink-400 bg-pink-50 text-pink-700' },
  { id: 'spirits', label: '🥃 Spirits', color: 'border-amber-400 bg-amber-50 text-amber-700' },
  { id: 'beer', label: '🍺 Beer', color: 'border-green-400 bg-green-50 text-green-700' },
  { id: 'sparkling', label: '🥂 Sparkling', color: 'border-yellow-400 bg-yellow-50 text-yellow-700' },
  { id: 'other', label: '🍹 Other', color: 'border-gray-400 bg-gray-50 text-gray-700' },
]

const TYPE_COLOR_MAP = {
  wine: 'bg-pink-50 text-pink-700 border-pink-200',
  spirits: 'bg-amber-50 text-amber-700 border-amber-200',
  beer: 'bg-green-50 text-green-700 border-green-200',
  sparkling: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  other: 'bg-gray-50 text-gray-700 border-gray-200',
}

// ─── Create Promotion Modal ───────────────────────────────────
function CreatePromotionModal({ brandId, onClose, onCreated }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', description: '', type: 'wine', tag: '', discount: '',
    original_price: '', promo_price: '', expires_at: '', logo: '🍷',
  })

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const LOGO_OPTIONS = ['🍷', '🥃', '🍺', '🥂', '🍹', '🫧', '🧊', '🎉']

  const handleSave = async () => {
    setError('')
    if (!form.name || !form.type || !form.expires_at) return setError('Name, type and expiry date are required.')
    setSaving(true)
    const { data, error: err } = await createPromotion({
      brand_id: brandId,
      name: form.name,
      description: form.description,
      type: form.type,
      tag: form.tag || form.name,
      discount: form.discount,
      original_price: Number(form.original_price) || 0,
      promo_price: Number(form.promo_price) || 0,
      color: form.type === 'wine' ? 'rose' : form.type === 'spirits' ? 'amber' : form.type === 'beer' ? 'green' : 'yellow',
      expires_at: form.expires_at,
    })
    setSaving(false)
    if (err) return setError(err.message || 'Failed to create promotion.')
    onCreated()
    onClose()
  }

  const isFree = Number(form.promo_price) === 0 && form.promo_price !== ''
  const selectedType = PROMO_TYPES.find(t => t.id === form.type)

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-display text-xl font-bold text-charcoal">Create New Promotion</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Type selector */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Drink Category *</label>
            <div className="grid grid-cols-5 gap-2">
              {PROMO_TYPES.map(t => (
                <button key={t.id} type="button" onClick={() => update('type', t.id)}
                  className={`py-2 px-1 rounded-xl border-2 text-center text-xs font-semibold transition-all ${form.type === t.id ? t.color + ' border-current' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                  <div className="text-xl mb-0.5">{t.label.split(' ')[0]}</div>
                  <div>{t.label.split(' ')[1]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Logo picker */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Logo Emoji</label>
            <div className="flex gap-2 flex-wrap">
              {LOGO_OPTIONS.map(emoji => (
                <button key={emoji} type="button" onClick={() => update('logo', emoji)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-all ${form.logo === emoji ? 'border-forest-500 bg-forest-50' : 'border-gray-100 hover:border-gray-200'}`}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Promotion Name *</label>
            <input value={form.name} onChange={e => update('name', e.target.value)}
              placeholder="e.g. Summer Reds Pairing" className="input-base" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)}
              placeholder="What will diners receive? Be specific — this is their first impression." rows={3}
              className="input-base resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Short Tag Label</label>
              <input value={form.tag} onChange={e => update('tag', e.target.value)}
                placeholder="e.g. Wine Pairing" className="input-base" />
              <p className="text-xs text-gray-400 mt-1">Shown as a badge on experience cards</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Offer Summary</label>
              <input value={form.discount} onChange={e => update('discount', e.target.value)}
                placeholder="e.g. 30% off bottle" className="input-base" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Original Price (R)</label>
              <input type="number" min={0} value={form.original_price} onChange={e => update('original_price', e.target.value)}
                placeholder="420" className="input-base" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Promotional Price (R)</label>
              <input type="number" min={0} value={form.promo_price} onChange={e => update('promo_price', e.target.value)}
                placeholder="0 = free" className="input-base" />
              {isFree && <p className="text-xs text-forest-500 font-semibold mt-1">✓ This will show as FREE</p>}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Expires On *</label>
            <input type="date" value={form.expires_at} onChange={e => update('expires_at', e.target.value)}
              min={new Date().toISOString().split('T')[0]} className="input-base" />
          </div>

          {/* Live preview */}
          {form.name && (
            <div className={`rounded-xl border p-3 text-xs ${TYPE_COLOR_MAP[form.type] || TYPE_COLOR_MAP.other}`}>
              <div className="flex items-center gap-2 font-semibold">
                <span>{form.logo}</span>
                <span>{form.name}</span>
                {form.tag && <span className="ml-auto bg-white/60 px-2 py-0.5 rounded-full font-medium border"><Tag size={9} className="inline mr-1" />{form.tag}</span>}
              </div>
              {form.description && <p className="text-xs opacity-80 mt-1 leading-relaxed">{form.description}</p>}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-coral text-sm px-3 py-2 rounded-lg">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 bg-forest-500 text-white font-semibold rounded-xl hover:bg-forest-600 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60">
            {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : '🚀 Launch Promotion'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────
export default function BrandDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Overview')
  const [showNew, setShowNew] = useState(false)

  const [brand, setBrand] = useState(null)
  const [promotions, setPromotions] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    const [brandRes, restRes] = await Promise.all([
      getBrandByOwner(user.id),
      getRestaurants(),
    ])
    setBrand(brandRes.data)
    setRestaurants(restRes.data || [])
    if (brandRes.data?.id) {
      const { data: promos } = await getPromotionsByBrand(brandRes.data.id)
      setPromotions(promos || [])
    }
    setLoading(false)
  }, [user?.id])

  useEffect(() => { load() }, [load])

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center text-gray-400">
      <Loader2 size={28} className="animate-spin mr-3" /> Loading your brand…
    </div>
  )

  if (!brand) return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
        <Wine size={40} className="text-coral mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-charcoal mb-2">Brand not found</h2>
        <p className="text-gray-500 text-sm">Please sign out and register again as a Brand Rep.</p>
      </div>
    </div>
  )

  const budgetPct = brand.budget > 0 ? Math.round((brand.spent / brand.budget) * 100) : 0
  const activePromos = promotions.filter(p => new Date(p.expires_at) >= new Date())

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-coral text-white flex items-center justify-center text-2xl">
                {brand.logo || '🍷'}
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-charcoal">{brand.name}</h1>
                <p className="text-gray-500 text-sm">{brand.category || 'Brand'} · Brand Partner</p>
              </div>
            </div>
            <button onClick={() => setShowNew(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-forest-500 text-white font-semibold rounded-full hover:bg-forest-600 transition-colors text-sm">
              <Plus size={15} /> New Promotion
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
            {/* Budget */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-charcoal flex items-center gap-2">
                  <DollarSign size={16} className="text-forest-500" /> Marketing Budget
                </h3>
                <span className="text-sm text-gray-500">
                  {brand.budget > 0 ? `R${Number(brand.spent).toLocaleString()} of R${Number(brand.budget).toLocaleString()} spent` : 'No budget set yet'}
                </span>
              </div>
              {brand.budget > 0 ? (
                <>
                  <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                    <div className="bg-gradient-to-r from-forest-400 to-forest-500 h-3 rounded-full transition-all" style={{ width: `${Math.min(budgetPct, 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{budgetPct}% spent</span>
                    <span>R{(brand.budget - brand.spent).toLocaleString()} remaining</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-400">Contact ODE to set up your marketing budget allocation.</p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Active Promotions', value: activePromos.length, icon: Wine, color: 'text-coral bg-red-50' },
                { label: 'Total Promotions', value: promotions.length, icon: Tag, color: 'text-forest-500 bg-forest-50' },
                { label: 'Partner Restaurants', value: restaurants.length, icon: Target, color: 'text-amber-600 bg-amber-50' },
                { label: 'Est. Reach', value: `${(restaurants.length * 80).toLocaleString()}+`, icon: Users, color: 'text-green-600 bg-green-50' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}><s.icon size={18} /></div>
                  <div className="text-2xl font-bold font-display text-charcoal">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent promos */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-charcoal">Your Promotions</h3>
                <button onClick={() => setActiveTab('My Promotions')} className="text-xs text-forest-500 font-semibold hover:underline">View all</button>
              </div>
              {promotions.length === 0 ? (
                <div className="text-center py-8">
                  <Wine size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-400 mb-3">No promotions yet.</p>
                  <button onClick={() => setShowNew(true)} className="px-4 py-2 bg-forest-500 text-white text-xs font-semibold rounded-full hover:bg-forest-600 transition-colors">
                    Create your first promotion
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {promotions.slice(0, 4).map(p => (
                    <div key={p.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                      <span className="text-2xl">{brand.logo || '🍷'}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-charcoal">{p.name}</p>
                        <p className="text-xs text-gray-400">Expires {new Date(p.expires_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${new Date(p.expires_at) >= new Date() ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {new Date(p.expires_at) >= new Date() ? 'Active' : 'Expired'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── My Promotions ── */}
        {activeTab === 'My Promotions' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">Your Promotions</h2>
                <p className="text-sm text-gray-500 mt-0.5">{activePromos.length} active · {promotions.length} total</p>
              </div>
              <button onClick={() => setShowNew(true)}
                className="flex items-center gap-2 px-4 py-2 bg-forest-500 text-white text-sm font-semibold rounded-full hover:bg-forest-600 transition-colors">
                <Plus size={14} /> New Promotion
              </button>
            </div>
            {promotions.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <Wine size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-500 mb-1">No promotions yet</p>
                <p className="text-sm text-gray-400 mb-4">Create a promotion to start reaching ODE diners.</p>
                <button onClick={() => setShowNew(true)} className="px-6 py-2.5 bg-forest-500 text-white text-sm font-semibold rounded-full hover:bg-forest-600 transition-colors">
                  Create Promotion
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {promotions.map(p => {
                  const isActive = new Date(p.expires_at) >= new Date()
                  const colorClass = TYPE_COLOR_MAP[p.type] || TYPE_COLOR_MAP.other
                  return (
                    <div key={p.id} className={`bg-gradient-to-br ${colorClass.includes('pink') ? 'from-pink-50 to-rose-50' : colorClass.includes('amber') ? 'from-amber-50 to-orange-50' : colorClass.includes('green') ? 'from-green-50 to-emerald-50' : 'from-yellow-50 to-amber-50'} rounded-2xl border border-gray-100 p-5`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{brand.logo || '🍷'}</span>
                          <div>
                            <h4 className="font-semibold text-charcoal">{p.name}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${colorClass}`}><Tag size={9} className="inline mr-1" />{p.tag}</span>
                          </div>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          {isActive ? 'Active' : 'Expired'}
                        </span>
                      </div>
                      {p.description && <p className="text-xs text-gray-600 mb-3">{p.description}</p>}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Expires {new Date(p.expires_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span className="font-bold text-charcoal">
                          {p.promo_price === 0 ? 'FREE' : `R${p.promo_price}`}
                          {p.original_price > 0 && p.promo_price > 0 && <span className="font-normal text-gray-400 line-through ml-1">R{p.original_price}</span>}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Restaurant Network ── */}
        {activeTab === 'Restaurant Network' && (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-xl font-bold text-charcoal">ODE Restaurant Network</h2>
              <p className="text-sm text-gray-500 mt-0.5">All restaurants on the platform — your promotions can be attached to any of these</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {restaurants.map(r => (
                <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex">
                  <img src={r.image_url} alt={r.name} className="w-28 h-28 object-cover flex-shrink-0" />
                  <div className="p-4 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-charcoal">{r.name}</h4>
                        <p className="text-xs text-gray-400">{r.location}</p>
                      </div>
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">On ODE</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 mb-2">{r.cuisine}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>⭐ {r.rating}</span>
                      <span>{r.review_count} reviews</span>
                      <span>{r.open_tables} open tables</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Analytics ── */}
        {activeTab === 'Analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-display font-bold text-charcoal mb-6 flex items-center gap-2">
                <BarChart2 size={16} className="text-forest-500" /> Promotion Performance (mock data)
              </h3>
              <div className="flex items-end gap-2 h-36 mb-2">
                {[32, 48, 41, 67, 72, 58, 83].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-400 font-medium">{v}</span>
                    <div className="w-full bg-forest-400 rounded-t-md hover:bg-forest-500 transition-colors" style={{ height: `${(v / 83) * 100}%` }} />
                    <span className="text-xs text-gray-400">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i]}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center mt-1">Monthly redemptions across all promotions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { label: 'Top Performing', value: promotions[0]?.name || 'No promotions yet', sub: 'Most redeemed', icon: '🏆' },
                { label: 'Best Restaurant', value: restaurants[0]?.name || 'No partners yet', sub: 'Most redemptions', icon: '🍽️' },
                { label: 'Peak Day', value: 'Saturday', sub: '63% of weekly volume', icon: '📅' },
              ].map(m => (
                <div key={m.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="text-3xl mb-2">{m.icon}</div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{m.label}</p>
                  <p className="font-display font-bold text-lg text-charcoal">{m.value}</p>
                  <p className="text-xs text-forest-500 font-medium mt-0.5">{m.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showNew && brand && (
        <CreatePromotionModal
          brandId={brand.id}
          onClose={() => setShowNew(false)}
          onCreated={() => load()}
        />
      )}
    </div>
  )
}
