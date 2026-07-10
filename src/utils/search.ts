import type { SearchEngine } from '../types'

export const SEARCH_ENGINES: Record<string, SearchEngine> = {
  bing: {
    name: 'Bing',
    url: 'https://www.bing.com/search?q=',
    icon: 'search',
  },
  bilibili: {
    name: 'Bilibili',
    url: 'https://search.bilibili.com/all?keyword=',
    icon: 'search',
  },
}

export function getSearchUrl(engine: string, query: string): string {
  const eng = SEARCH_ENGINES[engine]
  if (!eng) {
    return `https://www.bing.com/search?q=${encodeURIComponent(query)}`
  }
  return `${eng.url}${encodeURIComponent(query)}`
}
