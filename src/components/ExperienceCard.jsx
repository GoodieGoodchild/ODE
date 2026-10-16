import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, Tag } from 'lucide-react'

const promoColors = {
  rose:   'bg-pink-50 text-pink-700 border-pink-200',
  amber:  'bg-amber-50 text-amber-700 border-amber-200',
  green:  'bg-green-50 text-green-700 border-green-200',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
}

function SeatsBar({ filled, total }) {
  const pct = total > 0 ? Math.min(100, Math.round((filled / total) * 100)) : 0
  const remaining = Math.max(0, total - filled)
  const almostFull = pct >= 75

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className={`font-medium ${almostFull ? 'text-coral' : 'text-gray-500'}`}>
          {filled === 0
            ? `${total} seats available`
            : remaining === 0
              ? 'Fully booked'
              : `${remaining} seat${remaining === 1 ? '' : 's'} left`}
        </span>
        <span className="text-gray-400">{filled}/{total}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${almostFull ? 'bg-coral' : 'bg-forest-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function DrinkTeaser({ drinks }) {
  if (!drinks?.length) return null

  // Deduplicate emojis for the pile, max 4
  const emojis = [...new Set(drinks.map(d => d.item_emoji))].slice(0, 4)
  // Show first name of first contributor
  const firstName = drinks[0]?.diner_name?.split(' ')[0]
  const othersCount = drinks.length - 1

  return (
    <div className="flex items-center gap-2 py-2 px-3 bg-amber-50 rounded-xl border border-amber-100 mb-3">
      <span className="text-base leading-none">{emojis.join('')}</span>
      <span className="text-xs text-amber-700 font-medium">
        {firstName && (
          <>
            <span className="font-semibold">{firstName}</span>
            {othersCount > 0 ? ` & ${othersCount} other${othersCount > 1 ? 's' : ''}` : ''}
            {' '}brought drinks 🥂
          </>
        )}
      </span>
    </div>
  )
}

export default function ExperienceCard({ experience }) {
  const navigate = useNavigate()

  // Support both Supabase shape and mock shape
  const restaurant = experience.restaurant || experience.restaurants || {}
  const pricePerPerson = experience.pricePerPerson || experience.price_per_person || 0
  const imageUrl = restaurant.image_url || restaurant.image
    || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'
  const dateStr = experience.date
    ? new Date(experience.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })
    : '—'
  const seats = experience.seats || 0
  const seatsFilled = experience.seats_filled ?? 0
  const drinks = experience.table_drinks || []
  const promoList = Array.isArray(experience.promoList) ? experience.promoList : []
  const isFullyBooked = seatsFilled >= seats && seats > 0

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 cursor-pointer ${
        isFullyBooked ? 'opacity-60' : 'hover:shadow-md hover:-translate-y-0.5'
      }`}
      onClick={() => !isFullyBooked && navigate(`/experience/${experience.id}`)}
    >
      <div className="relative h-44 overflow-hidden">
        <img src={imageUrl} alt={restaurant.name || 'Restaurant'} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {isFullyBooked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 text-charcoal text-xs font-bold px-3 py-1.5 rounded-full">Fully Booked</span>
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="text-white text-xs font-medium opacity-80">{restaurant.name || ''}</p>
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
          <span className="flex items-center gap-1"><Calendar size={12} className="text-forest-500" />{dateStr}</span>
          <span className="flex items-center gap-1"><Clock size={12} className="text-forest-500" />{experience.time || '—'}</span>
        </div>

        <SeatsBar filled={seatsFilled} total={seats} />

        <DrinkTeaser drinks={drinks} />

        {promoList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {promoList.slice(0, 2).map((promo, i) => (
              <span key={promo.id || i}
                className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${promoColors[promo.color] || promoColors.green}`}>
                <Tag size={10} />{promo.tag || 'Promo'}
              </span>
            ))}
            {promoList.length > 2 && <span className="text-xs text-gray-400 px-2 py-0.5">+{promoList.length - 2} more</span>}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <span className="text-forest-500 font-bold text-lg">
            R{pricePerPerson} <span className="text-xs font-normal text-gray-400">/ person</span>
          </span>
          {!isFullyBooked && (
            <button
              onClick={e => { e.stopPropagation(); navigate(`/experience/${experience.id}`) }}
              className="px-4 py-1.5 bg-forest-500 text-white text-sm font-semibold rounded-full hover:bg-forest-600 transition-colors"
            >
              View & Book
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
