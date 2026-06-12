import { create } from 'zustand'
import type { NavData, BackgroundSource } from '../types'

interface NavStore {
  // Navigation data
  navData: NavData | null
  loading: boolean
  error: string | null

  // UI state
  editing: boolean
  darkMode: boolean
  backgroundSource: BackgroundSource
  searchEngine: string
  searchQuery: string

  // Weather
  latitude: number | null
  longitude: number | null

  // Actions
  fetchNav: () => Promise<void>
  saveNav: (data: NavData) => Promise<boolean>
  setEditing: (editing: boolean) => void
  toggleDarkMode: () => void
  setBackgroundSource: (source: BackgroundSource) => void
  setSearchEngine: (engine: string) => void
  setSearchQuery: (query: string) => void
  setLocation: (lat: number, lng: number) => void
}

export const useNavStore = create<NavStore>((set, get) => ({
  navData: null,
  loading: true,
  error: null,
  editing: false,
  darkMode: true,
  backgroundSource: 'bing',
  searchEngine: 'google',
  searchQuery: '',
  latitude: null,
  longitude: null,

  fetchNav: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/nav')
      const json = await res.json()
      if (json.success && json.data) {
        set({ navData: json.data, loading: false })
      } else {
        set({ error: json.error || 'Failed to load navigation data', loading: false })
      }
    } catch {
      set({ error: 'Network error while loading navigation data', loading: false })
    }
  },

  saveNav: async (data: NavData) => {
    try {
      const res = await fetch('/api/nav', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      })
      const json = await res.json()
      if (json.success) {
        set({ navData: data })
        return true
      }
      return false
    } catch {
      return false
    }
  },

  setEditing: (editing) => set({ editing }),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
  setBackgroundSource: (source) => set({ backgroundSource: source }),
  setSearchEngine: (engine) => set({ searchEngine: engine }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setLocation: (lat, lng) => set({ latitude: lat, longitude: lng }),
}))
