import type { LinkItem } from '../types'
import { ExternalLink, Pin } from 'lucide-react'
import { getIcon } from '../utils/icons'

interface LinkCardProps {
  link: LinkItem
}

export default function LinkCard({ link }: LinkCardProps) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-3 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 py-3 transition-all duration-200 hover:bg-white/[0.12] hover:border-white/[0.15] hover:scale-[1.02]"
    >
      {/* Pin badge */}
      {link.pinned && (
        <Pin size={12} className="absolute -top-1 -right-1 text-yellow-400/70 rotate-45" />
      )}

      {/* Icon */}
      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white/70 group-hover:bg-white/15 group-hover:text-white/90 transition-all">
        {getIcon(link.icon, 18)}
      </span>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-white/90 truncate group-hover:text-white transition-colors">
          {link.name}
        </div>
        {link.description && (
          <div className="text-xs text-white/40 truncate mt-0.5">
            {link.description}
          </div>
        )}
      </div>

      {/* External link indicator */}
      <ExternalLink size={12} className="flex-shrink-0 text-white/20 group-hover:text-white/50 transition-colors" />
    </a>
  )
}
