import { useEffect } from 'react'
import { useWeather, getWeatherEmoji } from '../hooks/useWeather'
import { useNavStore } from '../stores/useNavStore'
import { MapPin, Loader2 } from 'lucide-react'
import LiquidGlass from 'liquid-glass-react'
import { getGlassPreset } from '../utils/glassPresets'

export default function Weather() {
  const { latitude, longitude, setLocation, darkMode } = useNavStore()
  const { weather, loading, error } = useWeather(latitude, longitude)
  const glassPreset = getGlassPreset('card', darkMode)

  useEffect(() => {
    if (latitude === null && longitude === null) {
      // Try to get user location
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation(pos.coords.latitude, pos.coords.longitude)
          },
          () => {
            // Fallback to Beijing coordinates
            setLocation(39.9042, 116.4074)
          },
          { timeout: 5000 },
        )
      } else {
        setLocation(39.9042, 116.4074)
      }
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
    <div>
    <LiquidGlass {...glassPreset} overLight={!darkMode} padding="6px 14px">
      <div className="flex items-center gap-2 dark:text-white/80 text-gray-600 text-sm">
        <span className="text-xl">{getWeatherEmoji(weather.weatherCode)}</span>
        <span className="font-medium">{Math.round(weather.temperature)}°C</span>
        <MapPin size={12} className="dark:text-white/40 text-gray-400" />
      </div>
    </LiquidGlass>
    </div>
  )
}
