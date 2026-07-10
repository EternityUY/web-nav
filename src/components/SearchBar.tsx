import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { SEARCH_ENGINES } from '../utils/search'
import { useNavStore } from '../stores/useNavStore'
import { getSearchUrl } from '../utils/search'

const ENGINES = Object.entries(SEARCH_ENGINES)

export default function SearchBar() {
  const { searchEngine, setSearchEngine } = useNavStore()
  const [query, setQuery] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [focused, setFocused] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentEngine = SEARCH_ENGINES[searchEngine] || SEARCH_ENGINES.bing

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
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
      {/* Inline SVG filter for liquid glass displacement */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id="liquid-glass-filter" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
            <feDisplacementMap scale="50" in="SourceGraphic" in2="SourceGraphic" />
          </filter>
        </defs>
      </svg>

      <form onSubmit={handleSubmit}>
        <div
          className={`
            relative flex items-center rounded-full overflow-hidden
            transition-all duration-300
            ${focused ? 'scale-105' : ''}
          `}
        >
          {/* Liquid Glass layers — pure CSS + SVG filter, no external dependency */}
          <div className="liquid-glass-outer" />
          <div className="liquid-glass-cover" />
          <div className="liquid-glass-sharp" />
          <div className="liquid-glass-reflect" />

          <div className="relative z-10 flex items-center w-full">
          {/* Search engine switcher */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-1.5 pl-5 pr-2 py-3 dark:text-white/80 dark:hover:text-white text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span className="text-sm font-medium whitespace-nowrap">{currentEngine.name}</span>
              <ChevronDown size={14} className={`transition-transform ${showMenu ? 'rotate-180' : ''}`} />
            </button>

            {showMenu && (
              <div className="absolute top-full left-3 mt-1 w-40 rounded-xl glass-dropdown py-1 z-50">
                {ENGINES.map(([key, eng]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSearchEngine(key)
                      setShowMenu(false)
                      inputRef.current?.focus()
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      searchEngine === key
                        ? 'dark:text-white dark:bg-white/10 text-gray-800 bg-gray-100'
                        : 'dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5 text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {eng.name}
                  </button>
                ))}
              </div>
            )}
          </div>

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
        </div>
      </form>

      {/* Search engine hint */}
      <p className="text-center text-xs dark:text-white/30 text-gray-400 mt-2">
        按 <kbd className="rounded dark:bg-white/10 dark:text-white/50 bg-gray-200 text-gray-500 px-1.5 py-0.5">/</kbd> 快速搜索
      </p>
    </div>
  )
}
