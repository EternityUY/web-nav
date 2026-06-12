import { useState, useMemo } from 'react'
import { useNavStore } from '../stores/useNavStore'
import CategorySection from './CategorySection'
import { Search, Loader2, AlertCircle } from 'lucide-react'

export default function NavGrid() {
  const { navData, loading, error } = useNavStore()
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
        <Loader2 size={24} className="text-white/40 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle size={32} className="text-red-400/60" />
        <p className="text-white/50 text-sm">{error}</p>
      </div>
    )
  }

  if (!hasLinks) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Search size={32} className="text-white/30" />
        <p className="text-white/40 text-sm">暂无导航链接，点击右上角编辑添加</p>
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
      {/* Local filter bar */}
      <div className="relative mb-6">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`在 ${totalLinks} 个链接中筛选...`}
          className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg pl-9 pr-3 py-2 text-sm text-white/80 placeholder-white/30 outline-none transition-all focus:border-white/20 focus:bg-white/[0.1]"
        />
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
            <p className="text-white/40 text-sm">没有匹配的链接</p>
          </div>
        )}
    </div>
  )
}
