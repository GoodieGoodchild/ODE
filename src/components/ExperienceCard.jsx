import { useNavigate } from 'react-router-dom'
import { Calendar, Users, Clock, Tag } from 'lucide-react'
import { restaurants, promotions } from '../data/mockData'

const promoColors = {
  rose: 'bg-pink-50 text-pink-700 border-pink-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
}

export default function ExperienceCard({ experience }) {
  const navigate = useNavigate()
  const restaurant = restaurants.find(r => r.id === experience.restaurantId)
  const expPromos = (experience.promotions || []).map(id => promotions.find(p => p.id === id)).filter(Boolean)

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
      onClick={() => navigate(`/experience/${experience.id}`)}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={restaurant?.image}
          alt={restaurant?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="text-white text-xs font-medium opacity-80">{restaurant?.name}</p>
            <h3 className="text-white font-display font-bold text-lg leading-tight">{experience.name}</h3>
          </div>
          <span className="bg-white/20 backdrop-blur text-white text-xs px-2 py-1 rounded-full border border-white/30">
            {experience.privacy}
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{experience.description}</p>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-forest-500" />
            {new Date(experience.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-forest-500" />
            {experience.time}
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} className="text-forest-500" />
            {experience.seats} seats
          </span>
        </div>

        {expPromos.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {expPromos.slice(0, 2).map(promo => (
              <span
                key={promo.id}
                className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${promoColors[promo.color] || promoColors.green}`}
              >
                <Tag size={10} />
                {promo.tag}
              </span>
            ))}
            {expPromos.length > 2 && (
              <span className="text-xs text-gray-400 px-2 py-0.5">+{expPromos.length - 2} more</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <span className="text-forest-500 font-bold text-lg">R{experience.pricePerPerson} <span className="text-xs font-normal text-gray-400">/ person</span></span>
          <button
            onClick={e => { e.stopPropagation(); navigate(`/experience/${experience.id}`) }}
            className="px-4 py-1.5 bg-forest-500 text-white text-sm font-semibold rounded-full hover:bg-forest-600 transition-colors"
          >
            View & Book
          </button>
        </div>
      </div>
    </div>
  )
}
