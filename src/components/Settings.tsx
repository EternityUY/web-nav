import { useNavStore } from '../stores/useNavStore'
import { Sun, Moon, RefreshCw, Image, Palette } from 'lucide-react'
import type { BackgroundSource } from '../types'

const BACKGROUND_OPTIONS: { value: BackgroundSource; label: string; icon: typeof Image }[] = [
  { value: 'bing', label: 'Bing 每日壁纸', icon: Image },
  { value: 'planet', label: '动态星球', icon: Palette },
]

export default function Settings() {
  const {
    darkMode,
    toggleDarkMode,
    backgroundSource,
    setBackgroundSource,
  } = useNavStore()

  return (
    <div className="flex items-center gap-3">
      {/* Theme toggle */}
      <button
        onClick={toggleDarkMode}
        className="rounded-full bg-white/10 p-2 text-white/60 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white/90"
        title={darkMode ? '切换亮色模式' : '切换暗色模式'}
      >
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Background source */}
      <div className="flex rounded-full bg-white/10 p-0.5 backdrop-blur-sm">
        {BACKGROUND_OPTIONS.map((opt) => {
          const Icon = opt.icon
          const active = backgroundSource === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => setBackgroundSource(opt.value)}
              className={`rounded-full px-3 py-1.5 text-xs flex items-center gap-1.5 transition-all ${
                active
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/40 hover:text-white/60'
              }`}
              title={opt.label}
            >
              <Icon size={12} />
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
