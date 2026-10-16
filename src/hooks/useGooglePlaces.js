import { useState, useEffect, useRef, useCallback } from 'react'
import { getQuotaUsage, incrementQuota } from '../lib/services'

const SERVICE = 'google_places'
const MONTHLY_CAP = parseInt(import.meta.env.VITE_PLACES_MONTHLY_QUOTA || '500', 10)
const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_KEY

// Module-level cache so we only load the script once per page session
let scriptLoaded = false
let scriptLoading = false
const scriptCallbacks = []

function loadGoogleMapsScript(apiKey) {
  if (scriptLoaded) return Promise.resolve()
  if (scriptLoading) return new Promise(res => scriptCallbacks.push(res))

  scriptLoading = true
  return new Promise((resolve, reject) => {
    scriptCallbacks.push(resolve)
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => {
      scriptLoaded = true
      scriptLoading = false
      scriptCallbacks.forEach(cb => cb())
      scriptCallbacks.length = 0
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

/**
 * useGooglePlaces
 *
 * Attaches Places Autocomplete to an input ref.
 * Respects a monthly quota cap — if exceeded, sets `quotaExceeded: true`
 * and the caller should degrade to a plain text input.
 *
 * Returns: { inputRef, value, setValue, suggestion, quotaExceeded, notConfigured }
 */
export function useGooglePlaces({ types = ['establishment'], componentRestrictions = { country: 'za' } } = {}) {
  const inputRef = useRef(null)
  const autocompleteRef = useRef(null)
  const [value, setValue] = useState('')
  const [suggestion, setSuggestion] = useState(null)
  const [quotaExceeded, setQuotaExceeded] = useState(false)
  const [notConfigured, setNotConfigured] = useState(false)
  const [ready, setReady] = useState(false)

  // Check quota on mount
  useEffect(() => {
    if (!API_KEY) {
      setNotConfigured(true)
      return
    }
    getQuotaUsage(SERVICE).then(count => {
      if (count >= MONTHLY_CAP) setQuotaExceeded(true)
      else setReady(true)
    })
  }, [])

  // Load script and attach autocomplete when ready
  useEffect(() => {
    if (!ready || !inputRef.current) return

    loadGoogleMapsScript(API_KEY).then(() => {
      if (!inputRef.current) return
      const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
        types,
        componentRestrictions,
        fields: ['formatted_address', 'name', 'geometry', 'place_id'],
      })
      autocompleteRef.current = ac

      ac.addListener('place_changed', async () => {
        const place = ac.getPlace()
        if (!place?.formatted_address) return

        // Increment quota counter after successful call
        await incrementQuota(SERVICE)

        const newCount = await getQuotaUsage(SERVICE)
        if (newCount >= MONTHLY_CAP) setQuotaExceeded(true)

        const fullValue = place.name
          ? `${place.name}, ${place.formatted_address}`
          : place.formatted_address

        setValue(fullValue)
        setSuggestion({
          name: place.name,
          address: place.formatted_address,
          placeId: place.place_id,
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng(),
        })
      })
    })

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [ready])

  const reset = useCallback(() => {
    setValue('')
    setSuggestion(null)
  }, [])

  return { inputRef, value, setValue, suggestion, reset, quotaExceeded, notConfigured }
}
