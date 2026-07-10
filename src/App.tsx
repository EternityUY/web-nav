import { useEffect } from 'react'
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
  const glassPreset = getGlassPreset('button', darkMode)

  useEffect(() => {
    fetchNav()
  }, [fetchNav])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className="relative h-full w-full overflow-y-auto">
      <Background />

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
                padding="8px"
                onClick={() => setEditing(true)}
              >
                <Edit3 size={16} className={darkMode ? 'text-white/80' : 'text-gray-600'} />
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

      {editing && <EditorPanel />}
    </div>
  )
}
