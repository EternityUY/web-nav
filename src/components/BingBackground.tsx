import { useBackground } from '../hooks/useBackground'
import { useNavStore } from '../stores/useNavStore'
import { RefreshCw } from 'lucide-react'

export default function BingBackground() {
  const { imageUrl, loading, copyright, refresh } = useBackground()
  const darkMode = useNavStore((s) => s.darkMode)

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
        <div className="h-full w-full bg-gradient-to-br dark:from-slate-900 dark:via-blue-900 dark:to-slate-800 from-gray-100 via-gray-200 to-gray-300" />
      )}

      {/* Loading gradient */}
      {loading && !imageUrl && (
        <div className="h-full w-full bg-gradient-to-br dark:from-slate-900 dark:via-blue-900 dark:to-slate-800 from-gray-100 via-gray-200 to-gray-300 animate-pulse" />
      )}

      {/* Adaptive overlay */}
      <div className={`absolute inset-0 transition-colors duration-500 ${darkMode ? 'bg-black/35' : 'bg-white/20'}`} />
      <div className={`absolute inset-0 transition-colors duration-500 ${
        darkMode
          ? 'bg-gradient-to-b from-black/10 via-transparent to-black/40'
          : 'bg-gradient-to-b from-white/10 via-transparent to-white/30'
      }`} />

      {/* Copyright and refresh */}
      <div className="absolute bottom-4 left-4 z-10">
        {copyright && (
          <p className="text-xs dark:text-white/50 text-gray-600 max-w-md truncate">{copyright}</p>
        )}
      </div>
      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={refresh}
          className="rounded-full dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/20 dark:hover:text-white/90 bg-white/70 text-gray-500 border border-gray-200/50 p-2 backdrop-blur-sm transition-all hover:bg-gray-100 hover:text-gray-800"
          title="刷新背景"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  )
}
