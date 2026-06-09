import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Plus, TrendingUp, Users, Wine, Eye, BarChart2, DollarSign, Target } from 'lucide-react'
import { promotions, restaurants, brands } from '../data/mockData'

const tabs = ['Overview', 'My Promotions', 'Restaurant Network', 'Analytics']

export default function BrandDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Overview')
  const [showNew, setShowNew] = useState(false)

  const brand = brands[0]
  const myPromos = promotions.filter(p => [1, 2].includes(p.id))

  const budgetPct = Math.round((brand.spent / brand.budget) * 100)

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-coral text-white flex items-center justify-center text-2xl">
                {brand.logo}
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-charcoal">{brand.name}</h1>
                <p className="text-gray-500 text-sm">{brand.category} · Brand Partner</p>
              </div>
            </div>
            <button
              onClick={() => setShowNew(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-forest-500 text-white font-semibold rounded-full hover:bg-forest-600 transition-colors text-sm"
            >
              <Plus size={15} /> New Promotion
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab ? 'border-forest-500 text-forest-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'Overview' && (
          <div className="space-y-8">
            {/* Budget meter */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-charcoal flex items-center gap-2">
                  <DollarSign size={16} className="text-forest-500" /> Marketing Budget
                </h3>
                <span className="text-sm text-gray-500">R{brand.spent.toLocaleString()} of R{brand.budget.toLocaleString()} spent</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                <div
                  className="bg-gradient-to-r from-forest-400 to-forest-500 h-3 rounded-full transition-all"
                  style={{ width: `${budgetPct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{budgetPct}% spent</span>
                <span>R{(brand.budget - brand.spent).toLocaleString()} remaining</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Active Promotions', value: brand.activePromotions, icon: Wine, color: 'text-coral bg-red-50' },
                { label: 'Restaurant Partners', value: brand.restaurantPartners, icon: Target, color: 'text-forest-500 bg-forest-50' },
                { label: 'Diners Reached', value: brand.reach.toLocaleString(), icon: Users, color: 'text-amber-600 bg-amber-50' },
                { label: 'Est. ROI', value: '2.4×', icon: TrendingUp, color: 'text-green-600 bg-green-50' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                    <s.icon size={18} />
                  </div>
                  <div className="text-2xl font-bold font-display text-charcoal">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-display font-bold text-charcoal mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { text: 'Your "Summer Reds Pairing" was added to Fohlio\'s Tasting Menu', time: '2 hours ago', dot: 'bg-forest-500' },
                  { text: 'Piazaroni requested your Pasta Evening promotion', time: '1 day ago', dot: 'bg-amber-400' },
                  { text: '18 diners redeemed your Welcome Cocktail promo this week', time: '3 days ago', dot: 'bg-coral' },
                  { text: 'The Garden Table is now a new partner restaurant', time: '5 days ago', dot: 'bg-sage' },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.dot}`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{a.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'My Promotions' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-charcoal">Your Promotions</h2>
              <button
                onClick={() => setShowNew(true)}
                className="flex items-center gap-2 px-4 py-2 bg-forest-500 text-white text-sm font-semibold rounded-full hover:bg-forest-600 transition-colors"
              >
                <Plus size={14} /> New Promotion
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {promotions.map(promo => (
                <div key={promo.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{promo.brandLogo}</span>
                      <div>
                        <h4 className="font-semibold text-charcoal">{promo.name}</h4>
                        <p className="text-xs text-gray-400 capitalize">{promo.type} · {promo.tag}</p>
                      </div>
                    </div>
                    <span className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full font-semibold">Active</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">{promo.description}</p>
                  <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded-xl p-3 text-center text-xs">
                    <div>
                      <div className="font-bold text-charcoal text-sm">{Math.floor(Math.random() * 80 + 20)}</div>
                      <div className="text-gray-400">Redemptions</div>
                    </div>
                    <div>
                      <div className="font-bold text-charcoal text-sm">{Math.floor(Math.random() * 5 + 3)}</div>
                      <div className="text-gray-400">Restaurants</div>
                    </div>
                    <div>
                      <div className="font-bold text-forest-500 text-sm">{promo.discount}</div>
                      <div className="text-gray-400">Offer</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                      <Eye size={12} /> View
                    </button>
                    <button className="flex-1 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                      <BarChart2 size={12} /> Analytics
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Restaurant Network' && (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-xl font-bold text-charcoal">Partner Restaurants</h2>
              <p className="text-sm text-gray-500 mt-0.5">Restaurants currently running your promotions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {restaurants.map(r => (
                <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex">
                  <img src={r.image} alt={r.name} className="w-28 h-28 object-cover flex-shrink-0" />
                  <div className="p-4 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-charcoal">{r.name}</h4>
                        <p className="text-xs text-gray-400">{r.location}</p>
                      </div>
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">Partner</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 mb-2">{r.cuisine}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>⭐ {r.rating}</span>
                      <span>{r.reviews} reviews</span>
                      <span>{r.openTables} open tables</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-display font-bold text-charcoal mb-6 flex items-center gap-2">
                <BarChart2 size={16} className="text-forest-500" /> Monthly Redemptions
              </h3>
              <div className="flex items-end gap-2 h-32">
                {[32, 48, 41, 67, 72, 58, 83].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-forest-400 rounded-t-md transition-all hover:bg-forest-500"
                      style={{ height: `${(v / 83) * 100}%` }}
                    />
                    <span className="text-xs text-gray-400">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { label: 'Top Performing Promo', value: 'Whiskey Welcome', sub: '142 redemptions', icon: '🥃' },
                { label: 'Most Active Restaurant', value: 'Fohlio', sub: '38% of all redemptions', icon: '🍽️' },
                { label: 'Peak Day', value: 'Saturday', sub: '63% of weekly redemptions', icon: '📅' },
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

      {/* New Promotion Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={() => setShowNew(false)}>
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-xl font-bold text-charcoal mb-5">Create New Promotion</h2>
            <div className="space-y-4">
              {[
                { label: 'Promotion Name', placeholder: 'e.g. Summer Wine Pairing' },
                { label: 'Description', placeholder: 'What does this promotion offer diners?' },
                { label: 'Offer / Discount', placeholder: 'e.g. 30% off bottle, Free welcome drink' },
                { label: 'Original Price (R)', placeholder: '420', type: 'number' },
                { label: 'Promotional Price (R)', placeholder: '0 for free', type: 'number' },
                { label: 'Expires On', type: 'date' },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-400 transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowNew(false)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
                Cancel
              </button>
              <button onClick={() => setShowNew(false)} className="flex-1 py-3 bg-forest-500 text-white font-semibold rounded-xl hover:bg-forest-600 transition-colors text-sm">
                Launch Promotion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
