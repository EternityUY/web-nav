import { useState, useEffect, useCallback } from 'react'
import type { BingImage } from '../types'

interface BackgroundState {
  imageUrl: string | null
  loading: boolean
  error: string | null
  copyright: string | null
}

export function useBackground() {
  const [state, setState] = useState<BackgroundState>({
    imageUrl: null,
    loading: true,
    error: null,
    copyright: null,
  })
  const [imagesCache, setImagesCache] = useState<BingImage[]>([])

  const fetchBackground = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const res = await fetch('/api/background?idx=0&n=8')
      const json = await res.json()
      if (json.success && json.images?.length > 0) {
        const images: BingImage[] = json.images
        setImagesCache(images)
        const random = images[Math.floor(Math.random() * images.length)]
        // Use UHD quality
        const uhd = random.url.replace('1920x1080', 'UHD')
        setState({
          imageUrl: uhd,
          loading: false,
          error: null,
          copyright: random.copyright || null,
        })
      } else {
        setState((s) => ({ ...s, loading: false, error: 'No images returned' }))
      }
    } catch {
      setState((s) => ({ ...s, loading: false, error: 'Failed to load background' }))
    }
  }, [])

  const refresh = useCallback(() => {
    fetchBackground()
  }, [fetchBackground])

  useEffect(() => {
    fetchBackground()
  }, [fetchBackground])

  return { ...state, refresh }
}
