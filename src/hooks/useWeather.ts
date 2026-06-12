import { useState, useEffect } from 'react'
import type { WeatherData } from '../types'

export function useWeather(latitude: number | null, longitude: number | null) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (latitude === null || longitude === null) return

    let cancelled = false
    setLoading(true)
    setError(null)

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (data.current_weather) {
          setWeather({
            temperature: data.current_weather.temperature,
            weatherCode: data.current_weather.weathercode,
            windSpeed: data.current_weather.windspeed,
          })
        } else {
          setError('No weather data')
        }
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) {
          setError('Failed to fetch weather')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [latitude, longitude])

  return { weather, loading, error }
}

/**
 * Map WMO weather codes to labels and icons.
 * https://open-meteo.com/en/docs#weathervariables
 */
export function getWeatherEmoji(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 2) return '⛅'
  if (code <= 3) return '☁️'
  if (code <= 48) return '🌫️'
  if (code <= 57) return '🌧️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '🌨️'
  if (code <= 82) return '🌧️'
  if (code <= 86) return '🌨️'
  return '🌦️'
}
