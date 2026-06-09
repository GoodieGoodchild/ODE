import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, MapPin, Star, Calendar, Clock, Users, Lock, Globe, Check, ChevronRight } from 'lucide-react'
import { experiences, restaurants, promotions } from '../data/mockData'
import PromotionCard from '../components/PromotionCard'

export default function ExperienceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedPromos, setSelectedPromos] = useState([])
  const [seats, setSeats] = useState(2)
  const [booked, setBooked] = useState(false)

  const experience = experiences.find(e => e.id === Number(id))
  const restaurant = experience ? restaurants.find(r => r.id === experience.restaurantId) : null
  const expPromos = experience ? (experience.promotions || []).map(pid => promotions.find(p => p.id === pid)).filter(Boolean) : []

  if (!experience || !restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center text-gray-400">
        Experience not found.
        <button onClick={() => navigate(-1)} className="block mx-auto mt-4 text-forest-500 hover:underline">Go back</button>
      </div>
    )
  }

  const togglePromo = (promoId) => {
    setSelectedPromos(prev =>
      prev.includes(promoId) ? prev.filter(id => id !== promoId) : [...prev, promoId]
    )
  }

  const promoTotal = selectedPromos.reduce((sum, pid) => {
    const p = promotions.find(p => p.id === pid)
    return sum + (p?.promoPrice || 0)
  }, 0)

  const total = (experience.pricePerPerson * seats) + promoTotal

  const handleBook = () => {
    if (!user) return navigate('/login')
    setBooked(true)
  }

  const allCourses = [
    ...(experience.courses.starters?.length ? [{ label: 'Starters', items: experience.courses.starters }] : []),
    ...(experience.courses.mains?.length ? [{ label: 'Mains', items: experience.courses.mains }] : []),
    ...(experience.courses.palate?.length ? [{ label: 'Palate Cleanser', items: experience.courses.palate }] : []),
    ...(experience.courses.desserts?.length ? [{ label: 'Desserts', items: experience.courses.desserts }] : []),
  ]

  if (booked) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-forest-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check size={28} className="text-forest-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-charcoal mb-2">You're booked!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your table for <strong>{seats}</strong> at <strong>{restaurant.name}</strong> on{' '}
            <strong>{new Date(experience.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long' })}</strong> at{' '}
            <strong>{experience.time}</strong> is confirmed.
          </p>
          {selectedPromos.length > 0 && (
            <div className="bg-forest-50 rounded-xl p-3 mb-6 text-sm text-forest-700">
              🥂 Your drinks promotions are confirmed — enjoy!
            </div>
          )}
          <div className="border-t border-gray-100 pt-4 mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Seats ({seats} × R{experience.pricePerPerson})</span>
              <span>R{experience.pricePerPerson * seats}</span>
            </div>
            {selectedPromos.map(pid => {
              const p = promotions.find(p => p.id === pid)
              return p ? (
                <div key={pid} className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{p.name}</span>
                  <span>{p.promoPrice === 0 ? 'FREE' : `R${p.promoPrice}`}</span>
                </div>
              ) : null
            })}
            <div className="flex justify-between font-bold text-charcoal mt-2 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>R{total}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/diner')}
            className="w-full py-3 bg-forest-500 text-white font-semibold rounded-xl hover:bg-forest-600 transition-colors"
          >
            Back to My Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 backdrop-blur border border-white/30 text-white px-4 py-2 rounded-full text-sm hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-white/70 text-sm font-medium mb-1">{restaurant.name}</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">{experience.name}</h1>
          <div className="flex items-center gap-4 mt-2 text-white/80 text-xs">
            <span className="flex items-center gap-1"><MapPin size={11} />{restaurant.location}</span>
            <span className="flex items-center gap-1"><Star size={11} className="fill-amber text-amber" />{restaurant.rating} ({restaurant.reviews})</span>
            {experience.privacy === 'Closed' ? (
              <span className="flex items-center gap-1"><Lock size={11} /> Private Table</span>
            ) : (
              <span className="flex items-center gap-1"><Globe size={11} /> Open Table</span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Menu & Promotions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-display text-xl font-bold text-charcoal mb-1">The Menu</h2>
              <p className="text-gray-500 text-sm mb-5">{experience.description}</p>
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
            </div>

            {expPromos.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal mb-1">Available Promotions</h2>
                <p className="text-gray-500 text-sm mb-4">Add drinks deals to your booking</p>
                <div className="space-y-3">
                  {expPromos.map(promo => (
                    <div
                      key={promo.id}
                      onClick={() => togglePromo(promo.id)}
                      className={`cursor-pointer rounded-2xl border-2 transition-all ${
                        selectedPromos.includes(promo.id)
                          ? 'border-forest-500 ring-2 ring-forest-500/20'
                          : 'border-transparent hover:border-gray-200'
                      }`}
                    >
                      <PromotionCard promotion={promo} />
                      {selectedPromos.includes(promo.id) && (
                        <div className="bg-forest-500 text-white text-xs text-center py-1.5 rounded-b-xl font-semibold -mt-1">
                          ✓ Added to booking
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking panel */}
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
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="flex items-center gap-2 text-gray-600"><Users size={14} className="text-forest-500" /> Seats Available</span>
                  <span className="font-medium">{experience.seats}</span>
                </div>
              </div>

              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Number of Seats</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSeats(s => Math.max(1, s - 1))}
                    className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold"
                  >−</button>
                  <span className="text-xl font-bold font-display w-8 text-center">{seats}</span>
                  <button
                    onClick={() => setSeats(s => Math.min(experience.seats, s + 1))}
                    className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold"
                  >+</button>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5 text-sm space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Menu ({seats} × R{experience.pricePerPerson})</span>
                  <span>R{experience.pricePerPerson * seats}</span>
                </div>
                {selectedPromos.map(pid => {
                  const p = promotions.find(p => p.id === pid)
                  return p ? (
                    <div key={pid} className="flex justify-between text-gray-600">
                      <span>{p.tag}</span>
                      <span className="text-forest-500 font-medium">{p.promoPrice === 0 ? 'FREE' : `R${p.promoPrice}`}</span>
                    </div>
                  ) : null
                })}
                <div className="flex justify-between font-bold text-charcoal pt-2 border-t border-gray-200 text-base">
                  <span>Total</span>
                  <span>R{total}</span>
                </div>
              </div>

              <button
                onClick={handleBook}
                className="w-full py-3.5 bg-forest-500 text-white font-bold rounded-xl hover:bg-forest-600 transition-colors flex items-center justify-center gap-2"
              >
                Confirm Booking <ChevronRight size={16} />
              </button>
              {!user && (
                <p className="text-xs text-gray-400 text-center mt-2">You'll be asked to sign in</p>
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
