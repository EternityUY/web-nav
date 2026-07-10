import { useClock } from '../hooks/useClock'
import LiquidGlass from 'liquid-glass-react'
import { useNavStore } from '../stores/useNavStore'
import { getGlassPreset } from '../utils/glassPresets'

export default function Clock() {
  const { hours, minutes, dateStr, dayStr } = useClock()
  const darkMode = useNavStore((s) => s.darkMode)
  const glassPreset = getGlassPreset('clock', darkMode)

  return (
    <LiquidGlass {...glassPreset} overLight={!darkMode} padding="24px 48px">
      <div className="text-center select-none">
        <div className="text-6xl font-medium dark:text-white/90 text-gray-800 tracking-wider">
          {hours}:{minutes}
        </div>
        <div className="text-lg dark:text-white/60 text-gray-500 mt-2 font-light">
          {dateStr} {dayStr}
        </div>
      </div>
    </LiquidGlass>
  )
}
