import { Suspense, lazy } from 'react'
import { useBackground } from '../hooks/useBackground'
import { useNavStore } from '../stores/useNavStore'
import { RefreshCw } from 'lucide-react'

const ParticlePlanet = lazy(() => import('./ParticlePlanet'))

interface BackgroundProps {
  onRefresh?: () => void
}

export default function Background({ onRefresh }: BackgroundProps) {
  const { imageUrl, loading, copyright, refresh } = useBackground()
  const backgroundSource = useNavStore((s) => s.backgroundSource)
  const handleRefresh = onRefresh || refresh

  // Three.js 粒子星球（懒加载）
  if (backgroundSource === 'gradient') {
    return (
      <Suspense fallback={
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800" />
      }>
        <ParticlePlanet />
      </Suspense>
    )
  }

  return (
    <div className="fixed inset-0 -z-10">
      {/* Background image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Background"
          className={`h-full w-full object-cover transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}
        />
      )}

      {/* Fallback gradient when no image */}
      {!imageUrl && !loading && (
        <div className="h-full w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800" />
      )}

      {/* Loading gradient */}
      {loading && !imageUrl && (
        <div className="h-full w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 animate-pulse" />
      )}

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />

      {/* Copyright and refresh */}
      <div className="absolute bottom-4 left-4 z-10">
        {copyright && (
          <p className="text-xs text-white/50 max-w-md truncate">{copyright}</p>
        )}
      </div>
      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={handleRefresh}
          className="rounded-full bg-white/10 p-2 text-white/60 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white/90"
          title="刷新背景"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  )
}
