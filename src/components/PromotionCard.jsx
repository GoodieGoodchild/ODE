import { Tag, Calendar } from 'lucide-react'

const typeGradients = {
  wine: 'from-pink-50 to-rose-50 border-rose-200',
  spirits: 'from-amber-50 to-orange-50 border-amber-200',
  beer: 'from-green-50 to-emerald-50 border-green-200',
  sparkling: 'from-yellow-50 to-amber-50 border-yellow-200',
}

const typeBadge = {
  wine: 'bg-rose-100 text-rose-700',
  spirits: 'bg-amber-100 text-amber-700',
  beer: 'bg-green-100 text-green-700',
  sparkling: 'bg-yellow-100 text-yellow-700',
}

export default function PromotionCard({ promotion, compact = false }) {
  const gradient = typeGradients[promotion.type] || typeGradients.wine
  const badge = typeBadge[promotion.type] || typeBadge.wine

  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${gradient} p-4 ${compact ? '' : 'p-5'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{promotion.brandLogo}</span>
          <div>
            <p className="text-xs text-gray-500 font-medium">{promotion.brandName}</p>
            <h4 className="font-semibold text-gray-800 text-sm leading-tight">{promotion.name}</h4>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge}`}>
          {promotion.tag}
        </span>
      </div>

      <p className="text-gray-600 text-xs leading-relaxed mb-3">{promotion.description}</p>

      <div className="flex items-center justify-between">
        <div>
          {promotion.promoPrice === 0 ? (
            <span className="text-forest-500 font-bold text-sm">FREE</span>
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-gray-400 text-xs line-through">R{promotion.originalPrice}</span>
              <span className="text-forest-500 font-bold text-sm">R{promotion.promoPrice}</span>
            </div>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <Calendar size={10} />
          Until {new Date(promotion.expiresAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
        </span>
      </div>
    </div>
  )
}
