import { useNavStore } from '../stores/useNavStore'
import { Sun, Moon } from 'lucide-react'
import { Vaso } from 'vaso'
import { getGlassPreset } from '../utils/glassPresets'

export default function Settings() {
  const { darkMode, toggleDarkMode } = useNavStore()
  const preset = getGlassPreset('button', darkMode)

  return (
    <div className="flex items-center gap-3">
      <Vaso {...preset} onClick={toggleDarkMode} className="cursor-pointer">
        {darkMode
          ? <Sun size={16} className="text-white/80" />
          : <Moon size={16} className="text-gray-600" />
        }
      </Vaso>
    </div>
  )
}
