import { useEffect, useRef } from 'react'
import { useNavStore } from './stores/useNavStore'
import Background from './components/Background'
import SearchBar from './components/SearchBar'
import Clock from './components/Clock'
import Weather from './components/Weather'
import NavGrid from './components/NavGrid'
import Settings from './components/Settings'
import EditorPanel from './components/Editor/EditorPanel'
import { Edit3 } from 'lucide-react'
import LiquidGlass from 'liquid-glass-react'
import { getGlassPreset } from './utils/glassPresets'

export default function App() {
  const { fetchNav, editing, setEditing, darkMode } = useNavStore()
  const rootRef = useRef<HTMLDivElement>(null)
  const glassPreset = getGlassPreset('button', darkMode)

  useEffect(() => {
    fetchNav()
  }, [fetchNav])

  // Apply dark mode class to html
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div ref={rootRef} className="relative h-full w-full overflow-y-auto">
      {/* Background layer */}
      <Background />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center min-h-full">
        {/* Top bar: Weather + Settings */}
        <div className="w-full flex items-center justify-between px-6 pt-4 pb-8">
          <Weather />
          <div className="flex items-center gap-2">
            <Settings />
            <div>
              <LiquidGlass
                {...glassPreset}
                overLight={!darkMode}
                padding="0"
                onClick={() => setEditing(true)}
              >
                <button
                  className="rounded-full dark:text-white/60 dark:hover:text-white/90 text-gray-600 hover:text-gray-800 p-2 transition-all block"
                  title="编辑导航"
                >
                  <Edit3 size={16} />
                </button>
              </LiquidGlass>
            </div>
          </div>
        </div>

        {/* Clock */}
        <div className="mt-8 mb-6">
          <Clock />
        </div>

        {/* Search bar */}
        <div className="w-full mb-10">
          <SearchBar />
        </div>

        {/* Navigation grid */}
        <div className="w-full flex-1 pb-8">
          <NavGrid />
        </div>
      </div>

      {/* Editor overlay */}
      {editing && <EditorPanel />}
    </div>
  )
}
