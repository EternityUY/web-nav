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
      <form onSubmit={handleSubmit}>
        <div
          className={`
            relative flex items-center rounded-full border transition-all duration-300
            ${focused
              ? 'border-white/40 bg-white/15 shadow-lg shadow-black/20 scale-105'
              : 'border-white/20 bg-white/10 hover:bg-white/15'
            }
          `}
        >
          {/* Search engine switcher */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-1.5 pl-5 pr-2 py-3 text-white/80 hover:text-white transition-colors"
            >
              <span className="text-sm font-medium whitespace-nowrap">{currentEngine.name}</span>
              <ChevronDown size={14} className={`transition-transform ${showMenu ? 'rotate-180' : ''}`} />
            </button>

            {showMenu && (
              <div className="absolute top-full left-3 mt-1 w-40 rounded-xl bg-black/70 backdrop-blur-xl border border-white/10 py-1 shadow-xl z-50">
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
                        ? 'text-white bg-white/10'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
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
            className="flex-1 bg-transparent px-3 py-3 text-white placeholder-white/40 outline-none text-base"
            autoComplete="off"
          />

          {/* Submit button */}
          <button
            type="submit"
            className="pr-5 pl-2 py-3 text-white/70 hover:text-white transition-colors"
          >
            <Search size={20} />
          </button>
        </div>
      </form>

      {/* Search engine hint */}
      <p className="text-center text-xs text-white/30 mt-2">
        按 <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-white/50">/</kbd> 快速搜索
      </p>
    </div>
  )
}
