import type { Category } from '../types'
import LinkCard from './LinkCard'
import { getIcon } from '../utils/icons'

interface CategorySectionProps {
  category: Category
  searchQuery?: string
}

export default function CategorySection({ category, searchQuery = '' }: CategorySectionProps) {
  const filtered = category.links.filter((link) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      link.name.toLowerCase().includes(q) ||
      (link.description || '').toLowerCase().includes(q) ||
      link.url.toLowerCase().includes(q)
    )
  })

  if (filtered.length === 0) return null

  return (
    <section className="mb-6">
      {/* Category header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="dark:text-white/50 text-gray-400">{getIcon(category.icon, 16)}</span>
        <h2 className="text-sm font-medium dark:text-white/60 text-gray-500 tracking-wide uppercase">
          {category.name}
        </h2>
        <span className="text-xs dark:text-white/30 text-gray-400 ml-auto">
          {filtered.length}
        </span>
      </div>

      {/* Links grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {filtered.map((link, i) => (
          <LinkCard key={`${link.name}-${i}`} link={link} />
        ))}
      </div>
    </section>
  )
}
