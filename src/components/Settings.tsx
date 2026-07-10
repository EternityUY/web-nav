import { useNavStore } from '../stores/useNavStore'
import { Sun, Moon } from 'lucide-react'

export default function Settings() {
  const { darkMode, toggleDarkMode } = useNavStore()

  return (
    <div className="flex items-center gap-3">
      {/* Theme toggle */}
      <button
        onClick={toggleDarkMode}
        className="rounded-full dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/20 dark:hover:text-white/90 bg-white/70 text-gray-500 border border-gray-200/50 p-2 backdrop-blur-sm transition-all hover:bg-gray-100 hover:text-gray-800"
        title={darkMode ? '切换亮色模式' : '切换暗色模式'}
      >
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </div>
  )
}
