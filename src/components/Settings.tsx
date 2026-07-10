import { useNavStore } from '../stores/useNavStore'
import { Sun, Moon } from 'lucide-react'
import LiquidGlass from 'liquid-glass-react'
import { getGlassPreset } from '../utils/glassPresets'

export default function Settings() {
  const { darkMode, toggleDarkMode } = useNavStore()
  const glassPreset = getGlassPreset('button', darkMode)

  return (
    <div className="flex items-center gap-3">
      <div>
        <LiquidGlass
          {...glassPreset}
          overLight={!darkMode}
          padding="8px"
          onClick={toggleDarkMode}
        >
          {darkMode
            ? <Sun size={16} className="text-white/80" />
            : <Moon size={16} className="text-gray-600" />
          }
        </LiquidGlass>
      </div>
    </div>
  )
}
