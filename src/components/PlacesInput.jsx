import { Zap, AlertTriangle, MapPin } from 'lucide-react'
import { useGooglePlaces } from '../hooks/useGooglePlaces'

const REPORT_EMAIL = 'hello@ode.co.za'

function QuotaBanner() {
  return (
    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-2">
      <Zap size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-800">ODE Needs an Upgrade 🚀</p>
        <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
          Address autocomplete is temporarily at capacity — type your address manually below.
        </p>
      </div>
      <a
        href={`mailto:${REPORT_EMAIL}?subject=ODE%20Needs%20an%20Upgrade%20—%20Places%20API%20quota&body=Hey%20ODE%20team%2C%20the%20address%20autocomplete%20ran%20out%20of%20requests!%20Time%20to%20upgrade%20the%20Google%20Places%20quota.`}
        className="flex-shrink-0 text-xs font-bold text-amber-700 border border-amber-300 rounded-full px-3 py-1 hover:bg-amber-100 transition-colors whitespace-nowrap"
      >
        Report it →
      </a>
    </div>
  )
}

/**
 * PlacesInput
 *
 * A location input with Google Places Autocomplete.
 * Degrades gracefully to a plain text input when:
 *   - VITE_GOOGLE_PLACES_KEY is not set
 *   - Monthly quota is exhausted
 *
 * Props:
 *   value        string     — controlled value
 *   onChange     fn(string) — called with the typed or autocompleted string
 *   onSelect     fn({name, address, placeId, lat, lng}) — called on autocomplete pick
 *   placeholder  string
 *   className    string     — applied to the input element
 *   types        string[]   — Places API types, default ['establishment']
 */
export default function PlacesInput({
  value,
  onChange,
  onSelect,
  placeholder = 'Search for a restaurant or address…',
  className = 'input-base',
  types,
}) {
  const { inputRef, value: acValue, setValue: setAcValue, suggestion, quotaExceeded, notConfigured } =
    useGooglePlaces({ types })

  const degraded = quotaExceeded || notConfigured

  // When autocomplete fires, bubble value + suggestion up
  const prevSuggestion = suggestion
  if (suggestion && suggestion !== prevSuggestion) {
    if (onSelect) onSelect(suggestion)
    if (onChange) onChange(acValue)
  }

  if (degraded) {
    return (
      <div>
        {quotaExceeded && <QuotaBanner />}
        <div className="relative">
          <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={value}
            onChange={e => onChange?.(e.target.value)}
            placeholder={placeholder}
            className={`${className} pl-10`}
          />
        </div>
        {notConfigured && !quotaExceeded && (
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <AlertTriangle size={11} /> Google Places not configured — using plain text input
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
      <input
        ref={inputRef}
        type="text"
        defaultValue={value}
        onChange={e => {
          setAcValue(e.target.value)
          onChange?.(e.target.value)
        }}
        placeholder={placeholder}
        className={`${className} pl-10`}
        autoComplete="off"
      />
    </div>
  )
}
