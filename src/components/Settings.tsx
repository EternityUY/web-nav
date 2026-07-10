import { useNavStore } from '../stores/useNavStore'
import { Sun, Moon } from 'lucide-react'
import LiquidGlass from 'liquid-glass-react'
import { getGlassPreset } from '../utils/glassPresets'

export default function Settings() {
  const { darkMode, toggleDarkMode } = useNavStore()
  const glassPreset = getGlassPreset('button', darkMode)

  return (
    <div className="flex items-center gap-3">
      {/* Theme toggle */}
      <div>
      <LiquidGlass
        {...glassPreset}
        overLight={!darkMode}
        padding="0"
        onClick={toggleDarkMode}
      >
        <button
          className="rounded-full dark:text-white/60 dark:hover:text-white/90 text-gray-500 hover:text-gray-800 p-2 transition-all block"
          title={darkMode ? '切换亮色模式' : '切换暗色模式'}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </LiquidGlass>
      </div>
    </div>
  )
}
