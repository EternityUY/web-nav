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

export default function App() {
  const { fetchNav, editing, setEditing, darkMode } = useNavStore()

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
            <button
              onClick={() => setEditing(true)}
              className="rounded-full dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/20 dark:hover:text-white/90 bg-white/70 text-gray-600 border border-gray-200/50 p-2 backdrop-blur-sm transition-all hover:bg-gray-100 hover:text-gray-800"
              title="编辑导航"
            >
              <Edit3 size={16} />
            </button>
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
