import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Search, Filter, Users, Calendar, MapPin, Star, Utensils, Wine } from 'lucide-react'
import { experiences, restaurants, openTables, promotions } from '../data/mockData'
import ExperienceCard from '../components/ExperienceCard'
import PromotionCard from '../components/PromotionCard'

const tabs = ['Experiences', 'Open Tables', 'Promotions', 'My Bookings']

export default function DinerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Experiences')
  const [search, setSearch] = useState('')

  const filteredExperiences = experiences.filter(e => {
    const r = restaurants.find(r => r.id === e.restaurantId)
    return (
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      r?.name.toLowerCase().includes(search.toLowerCase()) ||
      r?.cuisine.toLowerCase().includes(search.toLowerCase())
    )
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
                <div className="text-2xl font-bold font-display text-forest-500">3</div>
                <div className="text-xs text-gray-500">Upcoming</div>
              </div>
              <div className="w-px h-8 bg-forest-200" />
              <div className="text-center px-3">
                <div className="text-2xl font-bold font-display text-forest-500">12</div>
                <div className="text-xs text-gray-500">Dined</div>
              </div>
            </div>
          </div>

          {/* Search */}
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

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-forest-500 text-forest-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'Experiences' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-charcoal">Available Experiences</h2>
              <span className="text-sm text-gray-400">{filteredExperiences.length} results</span>
            </div>
            {filteredExperiences.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Utensils size={40} className="mx-auto mb-3 opacity-30" />
                <p>No experiences match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExperiences.map(exp => (
                  <ExperienceCard key={exp.id} experience={exp} />
                ))}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {openTables.map(table => {
                const exp = experiences.find(e => e.id === table.experienceId)
                const restaurant = restaurants.find(r => r.id === table.restaurantId)
                const seats = table.seatsTotal - table.seatsFilled
                return (
                  <div key={table.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-11 h-11 rounded-full bg-forest-500 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                        {table.hostAvatar}
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal text-sm">{table.hostName}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {table.hostPassions.map(p => (
                            <span key={p} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{p}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">{table.description}</p>

                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><MapPin size={11} />{restaurant?.name}</span>
                      <span className="flex items-center gap-1"><Calendar size={11} />{new Date(table.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {Array.from({ length: table.seatsTotal }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            i < table.seatsFilled ? 'bg-forest-500 text-white' : 'bg-gray-100 text-gray-300 border-2 border-dashed border-gray-200'
                          }`}
                        >
                          {i < table.seatsFilled ? '✓' : '+'}
                        </div>
                      ))}
                      <span className="text-xs text-gray-400 ml-1">{seats} seat{seats !== 1 ? 's' : ''} left</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <span className="text-forest-500 font-bold text-sm">R{exp?.pricePerPerson}<span className="text-xs font-normal text-gray-400"> / person</span></span>
                      <button
                        onClick={() => navigate(`/experience/${exp?.id}`)}
                        className="px-4 py-1.5 bg-forest-500 text-white text-xs font-semibold rounded-full hover:bg-forest-600 transition-colors"
                      >
                        Request to Join
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'Promotions' && (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-xl font-bold text-charcoal">Live Drink Promotions</h2>
              <p className="text-sm text-gray-500 mt-0.5">Exclusive deals available when you book an experience</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {promotions.map(p => (
                <PromotionCard key={p.id} promotion={p} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'My Bookings' && (
          <div className="text-center py-20 text-gray-400">
            <Calendar size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-gray-500 mb-1">No bookings yet</p>
            <p className="text-sm">Browse experiences and make your first booking!</p>
            <button
              onClick={() => setActiveTab('Experiences')}
              className="mt-4 px-6 py-2.5 bg-forest-500 text-white text-sm font-semibold rounded-full hover:bg-forest-600 transition-colors"
            >
              Browse Experiences
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
