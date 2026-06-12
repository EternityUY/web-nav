export interface LinkItem {
  name: string
  url: string
  icon: string
  description?: string
  pinned?: boolean
}

export interface Category {
  name: string
  icon: string
  links: LinkItem[]
}

export interface NavData {
  categories: Category[]
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Background sources
export type BackgroundSource = 'bing' | 'unsplash' | 'gradient'

export interface BingImage {
  url: string
  urlbase: string
  copyright: string
  title: string
}

// Search engine definition
export interface SearchEngine {
  name: string
  url: string
  icon: string
}

// Weather data
export interface WeatherData {
  temperature: number
  weatherCode: number
  windSpeed: number
}
