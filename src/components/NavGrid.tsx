import { useState, useMemo } from 'react'
import { useNavStore } from '../stores/useNavStore'
import CategorySection from './CategorySection'
import { Search, Loader2, AlertCircle } from 'lucide-react'
import LiquidGlass from '@skyline23/liquid-glass-react'

export default function NavGrid() {
  const { navData, loading, error, darkMode } = useNavStore()
  const [searchQuery, setSearchQuery] = useState('')

  const hasLinks = useMemo(() => {
    if (!navData?.categories) return false
    return navData.categories.some((c) => c.links.length > 0)
  }, [navData])

  const totalLinks = useMemo(() => {
    if (!navData?.categories) return 0
    return navData.categories.reduce((sum, c) => sum + c.links.length, 0)
  }, [navData])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="dark:text-white/40 text-gray-400 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle size={32} className="text-red-400/60" />
        <p className="dark:text-white/50 text-gray-500 text-sm">{error}</p>
      </div>
    )
  }

  if (!hasLinks) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Search size={32} className="dark:text-white/30 text-gray-300" />
        <p className="dark:text-white/40 text-gray-500 text-sm">暂无导航链接，点击右上角编辑添加</p>
      </div>
    )
  }

  // Sort: pinned items first within each category
  const sortedCategories = navData!.categories.map((cat) => ({
    ...cat,
    links: [...cat.links].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return 0
    }),
  }))

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Local filter bar — Liquid Glass */}
      <div className="relative mb-6">
        <LiquidGlass
          cornerRadius={12}
          displacementScale={50}
          blurAmount={0.06}
          saturation={130}
          aberrationIntensity={2}
          elasticity={0.15}
          padding="0"
          overLight={!darkMode}
        >
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-white/30 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`在 ${totalLinks} 个链接中筛选...`}
              className="w-full bg-transparent pl-9 pr-3 py-2 dark:text-white/80 dark:placeholder-white/30 text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>
        </LiquidGlass>
      </div>

      {/* Categories */}
      {sortedCategories.map((cat, i) => (
        <CategorySection key={`${cat.name}-${i}`} category={cat} searchQuery={searchQuery} />
      ))}

      {searchQuery &&
        sortedCategories.every((c) =>
          c.links.every(
            (l) =>
              !l.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
              !(l.description || '').toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        ) && (
          <div className="text-center py-10">
            <p className="dark:text-white/40 text-gray-500 text-sm">没有匹配的链接</p>
          </div>
        )}
    </div>
  )
}
