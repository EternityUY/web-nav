import type { SearchEngine } from '../types'

export const SEARCH_ENGINES: Record<string, SearchEngine> = {
  google: {
    name: 'Google',
    url: 'https://www.google.com/search?q=',
    icon: 'search',
  },
  bing: {
    name: 'Bing',
    url: 'https://www.bing.com/search?q=',
    icon: 'search',
  },
  baidu: {
    name: '百度',
    url: 'https://www.baidu.com/s?wd=',
    icon: 'search',
  },
  duckduckgo: {
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q=',
    icon: 'search',
  },
  github: {
    name: 'GitHub',
    url: 'https://github.com/search?q=',
    icon: 'github',
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
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`
  }
  return `${eng.url}${encodeURIComponent(query)}`
}
