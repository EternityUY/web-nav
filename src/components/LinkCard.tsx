import type { LinkItem } from '../types'
import { ExternalLink, Pin } from 'lucide-react'
import { getIcon } from '../utils/icons'
import LiquidGlass from 'liquid-glass-react'
import { useNavStore } from '../stores/useNavStore'
import { getGlassPreset } from '../utils/glassPresets'

interface LinkCardProps {
  link: LinkItem
}

export default function LinkCard({ link }: LinkCardProps) {
  const darkMode = useNavStore((s) => s.darkMode)
  const glassPreset = getGlassPreset('card', darkMode)

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block transition-all duration-200 hover:scale-[1.02]"
    >
      <LiquidGlass
        {...glassPreset}
        overLight={!darkMode}
        className="glass-card"
        padding="12px 16px"
      >
        <span className="relative flex items-center gap-3">
          {/* Pin badge */}
          {link.pinned && (
            <Pin size={12} className="absolute -top-1 -right-1 text-yellow-400/70 rotate-45" />
          )}

          {/* Icon */}
          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg dark:bg-white/10 dark:text-white/70 dark:group-hover:bg-white/15 dark:group-hover:text-white/90 bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-800 transition-all">
            {getIcon(link.icon, 18)}
          </span>

          {/* Text */}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium dark:text-white/90 dark:group-hover:text-white text-gray-800 group-hover:text-gray-900 truncate transition-colors">
              {link.name}
            </div>
            {link.description && (
              <div className="text-xs dark:text-white/40 text-gray-500 truncate mt-0.5">
                {link.description}
              </div>
            )}
          </div>

          {/* External link indicator */}
          <ExternalLink size={12} className="flex-shrink-0 dark:text-white/20 dark:group-hover:text-white/50 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </span>
      </LiquidGlass>
    </a>
  )
}
