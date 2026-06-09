import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Plus, TrendingUp, Users, Calendar, Star, Wine, ChefHat, Edit3, Eye } from 'lucide-react'
import { experiences, promotions, restaurants } from '../data/mockData'

const tabs = ['Overview', 'Experiences', 'Promotions', 'Bookings']

const statCards = [
  { label: 'Seats Booked', value: '47', sub: '+12 this week', icon: Users, color: 'text-forest-500 bg-forest-50' },
  { label: 'Revenue (MTD)', value: 'R32,460', sub: '+18% vs last month', icon: TrendingUp, color: 'text-amber-600 bg-amber-50' },
  { label: 'Active Promotions', value: '3', sub: '2 brands partnered', icon: Wine, color: 'text-coral bg-red-50' },
  { label: 'Avg Rating', value: '4.7', sub: '312 reviews', icon: Star, color: 'text-yellow-600 bg-yellow-50' },
]

export default function RestaurantDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Overview')
  const [showNewExp, setShowNewExp] = useState(false)

  const restaurant = restaurants.find(r => r.id === 1)
  const myExperiences = experiences.filter(e => e.restaurantId === 1)
  const myPromos = promotions.slice(0, 3)

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-forest-500 text-white flex items-center justify-center">
                <ChefHat size={26} />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-charcoal">{restaurant?.name}</h1>
                <p className="text-gray-500 text-sm">{restaurant?.location} · {restaurant?.cuisine}</p>
              </div>
            </div>
            <button
              onClick={() => setShowNewExp(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-forest-500 text-white font-semibold rounded-full hover:bg-forest-600 transition-colors text-sm"
            >
              <Plus size={15} /> New Experience
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                    <s.icon size={18} />
                  </div>
                  <div className="text-2xl font-bold font-display text-charcoal">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                  <div className="text-xs text-forest-500 font-medium mt-1">{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-display font-bold text-charcoal mb-4 flex items-center gap-2">
                  <Calendar size={16} className="text-forest-500" /> Upcoming Experiences
                </h3>
                <div className="space-y-3">
                  {myExperiences.map(exp => (
                    <div key={exp.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="font-medium text-sm text-charcoal">{exp.name}</p>
                        <p className="text-xs text-gray-400">{new Date(exp.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })} · {exp.time} · {exp.seats} seats</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-forest-500">R{exp.pricePerPerson}<span className="font-normal text-xs text-gray-400">/pp</span></p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${exp.privacy === 'Open' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {exp.privacy}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-display font-bold text-charcoal mb-4 flex items-center gap-2">
                  <Wine size={16} className="text-coral" /> Brand Promotions Running
                </h3>
                <div className="space-y-3">
                  {myPromos.map(promo => (
                    <div key={promo.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                      <span className="text-2xl">{promo.brandLogo}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-charcoal">{promo.name}</p>
                        <p className="text-xs text-gray-400">{promo.brandName} · until {new Date(promo.expiresAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</p>
                      </div>
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Experiences' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-charcoal">Your Experiences</h2>
              <button
                onClick={() => setShowNewExp(true)}
                className="flex items-center gap-2 px-4 py-2 bg-forest-500 text-white text-sm font-semibold rounded-full hover:bg-forest-600 transition-colors"
              >
                <Plus size={14} /> Add New
              </button>
            </div>
            <div className="space-y-4">
              {myExperiences.map(exp => (
                <div key={exp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-charcoal">{exp.name}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${exp.privacy === 'Open' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {exp.privacy}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{exp.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span><Calendar size={11} className="inline mr-1" />{new Date(exp.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long' })}</span>
                      <span><Users size={11} className="inline mr-1" />{exp.seats} seats</span>
                      <span className="font-semibold text-forest-500">R{exp.pricePerPerson}/pp</span>
                      <span>{exp.daysToFill} days to fill</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-forest-500 hover:bg-forest-50 rounded-lg transition-colors"><Eye size={16} /></button>
                    <button className="p-2 text-gray-400 hover:text-forest-500 hover:bg-forest-50 rounded-lg transition-colors"><Edit3 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Promotions' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">Brand Promotions</h2>
                <p className="text-sm text-gray-500 mt-0.5">Promotions your restaurant has agreed to run</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-forest-500 text-forest-500 text-sm font-semibold rounded-full hover:bg-forest-50 transition-colors">
                <Plus size={14} /> Request a Brand Deal
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {myPromos.map(promo => (
                <div key={promo.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{promo.brandLogo}</span>
                      <div>
                        <p className="font-semibold text-sm text-charcoal">{promo.brandName}</p>
                        <p className="text-xs text-gray-400 capitalize">{promo.type}</p>
                      </div>
                    </div>
                    <span className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full font-semibold">Active</span>
                  </div>
                  <h4 className="font-semibold text-charcoal mb-1">{promo.name}</h4>
                  <p className="text-xs text-gray-500 mb-3">{promo.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Expires {new Date(promo.expiresAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</span>
                    <span className="text-forest-500 font-semibold">{promo.discount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Bookings' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-display font-bold text-charcoal">Recent Bookings</h2>
            </div>
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
                {[
                  { diner: 'Mary-Anne K.', exp: 'Tasting Menu', date: '29 May', seats: 2, total: 'R1,900', status: 'Confirmed' },
                  { diner: 'Sipho M.', exp: '3 Course Menu', date: '01 Jun', seats: 4, total: 'R2,720', status: 'Confirmed' },
                  { diner: 'Lerato D.', exp: '2 Course Menu', date: '05 Jun', seats: 2, total: 'R960', status: 'Pending' },
                ].map((b, i) => (
                  <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-charcoal">{b.diner}</td>
                    <td className="px-5 py-3.5 text-gray-600">{b.exp}</td>
                    <td className="px-5 py-3.5 text-gray-600">{b.date}</td>
                    <td className="px-5 py-3.5 text-gray-600">{b.seats}</td>
                    <td className="px-5 py-3.5 font-semibold text-charcoal">{b.total}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${b.status === 'Confirmed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
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

      {/* New Experience Modal */}
      {showNewExp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={() => setShowNewExp(false)}>
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-xl font-bold text-charcoal mb-5">Create New Experience</h2>
            <div className="space-y-4">
              {[
                { label: 'Experience Name', placeholder: 'e.g. Chef\'s 4 Course Tasting Menu' },
                { label: 'Date', placeholder: 'YYYY-MM-DD', type: 'date' },
                { label: 'Time', placeholder: '19:30', type: 'time' },
                { label: 'Seats Available', placeholder: '4', type: 'number' },
                { label: 'Price per Person (R)', placeholder: '750', type: 'number' },
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
              <button
                onClick={() => setShowNewExp(false)}
                className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNewExp(false)}
                className="flex-1 py-3 bg-forest-500 text-white font-semibold rounded-xl hover:bg-forest-600 transition-colors text-sm"
              >
                Create Experience
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
