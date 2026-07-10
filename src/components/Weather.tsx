import { useEffect } from 'react'
import { useWeather, getWeatherEmoji } from '../hooks/useWeather'
import { useNavStore } from '../stores/useNavStore'
import { MapPin, Loader2 } from 'lucide-react'

export default function Weather() {
  const { latitude, longitude, locationName, setLocation } = useNavStore()
  const { weather, loading, error } = useWeather(latitude, longitude)

  useEffect(() => {
    if (latitude === null && longitude === null) {
      // 1. Try IP geolocation first — no permission needed, provides city name
      fetch('https://ipapi.co/json/')
        .then((r) => r.json())
        .then((data) => {
          const city = data.city || ''
          const ipLat = data.latitude
          const ipLng = data.longitude

          // 2. Try browser geolocation for more accurate coordinates
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                // Accurate coords from browser + city name from IP
                setLocation(pos.coords.latitude, pos.coords.longitude, city)
              },
              () => {
                // Browser denied — use IP coords + city
                if (ipLat && ipLng) {
                  setLocation(ipLat, ipLng, city)
                } else {
                  setLocation(39.9042, 116.4074, '北京')
                }
              },
              { timeout: 5000 },
            )
          } else if (ipLat && ipLng) {
            setLocation(ipLat, ipLng, city)
          } else {
            setLocation(39.9042, 116.4074, '北京')
          }
        })
        .catch(() => {
          // IP geolocation failed — try browser
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              (pos) => setLocation(pos.coords.latitude, pos.coords.longitude),
              () => setLocation(39.9042, 116.4074, '北京'),
              { timeout: 5000 },
            )
          } else {
            setLocation(39.9042, 116.4074, '北京')
          }
        })
    }
  }, [latitude, longitude, setLocation])

  if (loading && !weather) {
    return (
      <div className="flex items-center gap-2 dark:text-white/50 text-gray-500 text-sm">
        <Loader2 size={14} className="animate-spin" />
        <span>加载天气...</span>
      </div>
    )
  }

  if (error && !weather) return null
  if (!weather) return null

  return (
    <div className="flex items-center gap-2 dark:text-white/80 text-gray-600 text-sm">
      <span className="text-xl">{getWeatherEmoji(weather.weatherCode)}</span>
      <span className="font-medium">{Math.round(weather.temperature)}°C</span>
      {locationName && (
        <>
          <MapPin size={12} className="dark:text-white/40 text-gray-400" />
          <span className="dark:text-white/50 text-gray-500 text-xs">{locationName}</span>
        </>
      )}
    </div>
  )
}
