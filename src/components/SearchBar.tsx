import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Search, ChevronDown } from 'lucide-react'
import { SEARCH_ENGINES } from '../utils/search'
import { useNavStore } from '../stores/useNavStore'
import { getSearchUrl } from '../utils/search'
import LiquidGlass from '@skyline23/liquid-glass-react'

const ENGINES = Object.entries(SEARCH_ENGINES)

export default function SearchBar() {
  const { searchEngine, setSearchEngine, darkMode } = useNavStore()
  const [query, setQuery] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [focused, setFocused] = useState(false)
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const menuDropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentEngine = SEARCH_ENGINES[searchEngine] || SEARCH_ENGINES.bing

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node
      if (menuBtnRef.current?.contains(target)) return
      if (menuDropdownRef.current?.contains(target)) return
      setShowMenu(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    window.open(getSearchUrl(searchEngine, trimmed), '_self')
  }

  function toggleMenu() {
    if (!showMenu && menuBtnRef.current) {
      const rect = menuBtnRef.current.getBoundingClientRect()
      setMenuPos({ top: rect.bottom + 4, left: rect.left })
    }
    setShowMenu(!showMenu)
  }

  // Keyboard shortcut: focus search on "/"
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <form onSubmit={handleSubmit}>
        <div className={`transition-all duration-300 ${focused ? 'scale-105' : ''}`}>
          <LiquidGlass
            cornerRadius={9999}
            displacementScale={70}
            blurAmount={0.06}
            saturation={140}
            aberrationIntensity={2}
            elasticity={0.18}
            padding="0"
            overLight={!darkMode}
            style={{ width: '100%', display: 'block' }}
          >
            <div className="flex items-center w-full">
              {/* Search engine switcher button */}
              <button
                ref={menuBtnRef}
                type="button"
                onClick={toggleMenu}
                className="flex items-center gap-1.5 pl-5 pr-2 py-3 dark:text-white/80 dark:hover:text-white text-gray-600 hover:text-gray-800 transition-colors"
              >
                <span className="text-sm font-medium whitespace-nowrap">{currentEngine.name}</span>
                <ChevronDown size={14} className={`transition-transform ${showMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Search input */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="搜索或输入网址..."
                className="flex-1 bg-transparent px-3 py-3 dark:text-white dark:placeholder-white/40 text-gray-800 placeholder-gray-400 outline-none text-base"
                autoComplete="off"
              />

              {/* Submit button */}
              <button
                type="submit"
                className="pr-5 pl-2 py-3 dark:text-white/70 dark:hover:text-white text-gray-500 hover:text-gray-800 transition-colors"
              >
                <Search size={20} />
              </button>
            </div>
          </LiquidGlass>
        </div>
      </form>

      {/* Engine dropdown — portal to body to escape LiquidGlass overflow:hidden */}
      {showMenu && menuPos &&
        createPortal(
          <div
            ref={menuDropdownRef}
            className="fixed rounded-xl glass-dropdown py-1 z-[9999]"
            style={{ top: menuPos.top, left: menuPos.left }}
          >
            {ENGINES.map(([key, eng]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSearchEngine(key)
                  setShowMenu(false)
                  inputRef.current?.focus()
                }}
                className={`w-40 text-left px-4 py-2 text-sm transition-colors ${
                  searchEngine === key
                    ? 'dark:text-white dark:bg-white/10 text-gray-800 bg-gray-100'
                    : 'dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5 text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {eng.name}
              </button>
            ))}
          </div>,
          document.body,
        )}

      {/* Search engine hint */}
      <p className="text-center text-xs dark:text-white/30 text-gray-400 mt-2">
        按 <kbd className="rounded dark:bg-white/10 dark:text-white/50 bg-gray-200 text-gray-500 px-1.5 py-0.5">/</kbd> 快速搜索
      </p>
    </div>
  )
}
