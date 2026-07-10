import { useEffect, useMemo } from 'react'
import { useNavStore } from './stores/useNavStore'
import Background from './components/Background'
import SearchBar from './components/SearchBar'
import Clock from './components/Clock'
import Weather from './components/Weather'
import NavGrid from './components/NavGrid'
import Settings from './components/Settings'
import EditorPanel from './components/Editor/EditorPanel'
import { Edit3 } from 'lucide-react'
import LiquidGlass from '@skyline23/liquid-glass-react'

export default function App() {
  const { fetchNav, editing, setEditing, darkMode } = useNavStore()

  // Edit button only visible when URL has ?set=true
  const showEdit = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('set') === 'true'
  }, [])

  useEffect(() => {
    fetchNav()
  }, [fetchNav])

  // Apply dark mode class to html
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className="relative h-full w-full overflow-y-auto">
      {/* Background layer */}
      <Background />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center min-h-full">
        {/* Top bar: Weather + Settings */}
        <div className="w-full flex items-center justify-between px-6 pt-4 pb-8">
          <Weather />
          <div className="flex items-center gap-2">
            <Settings />
            {showEdit && (
              <LiquidGlass
                cornerRadius={100}
                displacementScale={60}
                blurAmount={0.08}
                saturation={130}
                aberrationIntensity={2}
                elasticity={0.25}
                padding="8px"
                overLight={!darkMode}
                onClick={() => setEditing(true)}
                style={{ display: 'inline-flex', cursor: 'pointer' }}
              >
                <span className="flex items-center justify-center" title="编辑导航">
                  <Edit3 size={16} color={darkMode ? 'rgba(255,255,255,0.65)' : 'rgba(80,80,80,0.7)'} />
                </span>
              </LiquidGlass>
            )}
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
