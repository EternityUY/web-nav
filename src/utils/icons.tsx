import type { ReactNode } from 'react'
import {
  Star, Github, Mail, MessageCircle, BookOpen,
  Layers, Package, Book, Triangle, CheckCircle,
  MessageSquare, Bot, Cpu, Figma, Image,
  Droplets, Wrench, Sparkles, Palette,
  Globe, Code, Terminal, Server, Database,
  Shield, Zap, Link, Search, Home, User,
  Settings, Clock, Cloud, MapPin, ExternalLink,
  Plus, Trash2, Edit3, GripVertical, ChevronLeft,
  ChevronRight, Sun, Moon, RefreshCw, X, Pin,
  FolderOpen, Heart, Music, Video, Camera,
  Map, List, Filter, Share, Download, Upload,
} from 'lucide-react'

const iconMap: Record<string, ReactNode> = {
  star: <Star size={18} />,
  github: <Github size={18} />,
  mail: <Mail size={18} />,
  'message-circle': <MessageCircle size={18} />,
  'book-open': <BookOpen size={18} />,
  layers: <Layers size={18} />,
  package: <Package size={18} />,
  book: <Book size={18} />,
  triangle: <Triangle size={18} />,
  'check-circle': <CheckCircle size={18} />,
  'message-square': <MessageSquare size={18} />,
  bot: <Bot size={18} />,
  cpu: <Cpu size={18} />,
  figma: <Figma size={18} />,
  image: <Image size={18} />,
  droplets: <Droplets size={18} />,
  wrench: <Wrench size={18} />,
  sparkles: <Sparkles size={18} />,
  palette: <Palette size={18} />,
  globe: <Globe size={18} />,
  code: <Code size={18} />,
  terminal: <Terminal size={18} />,
  server: <Server size={18} />,
  database: <Database size={18} />,
  shield: <Shield size={18} />,
  zap: <Zap size={18} />,
  link: <Link size={18} />,
  search: <Search size={18} />,
  home: <Home size={18} />,
  user: <User size={18} />,
  settings: <Settings size={18} />,
  clock: <Clock size={18} />,
  cloud: <Cloud size={18} />,
  folder: <FolderOpen size={18} />,
  heart: <Heart size={18} />,
  music: <Music size={18} />,
  video: <Video size={18} />,
  camera: <Camera size={18} />,
  map: <Map size={18} />,
  list: <List size={18} />,
  filter: <Filter size={18} />,
}

const fallbackIcon = <Link size={18} />

export function getIcon(name: string, size: number = 18): ReactNode {
  // If size is different, clone with new size
  const icon = iconMap[name.toLowerCase()]
  if (icon) return icon

  // Try to match by checking if it's a known lucide icon name
  // For unknown names, return fallback
  return fallbackIcon
}

export const ICON_OPTIONS = Object.keys(iconMap).sort()

// Export icons used by Editor
export {
  Star, Github, Mail, MessageCircle, BookOpen,
  Layers, Package, Book, Triangle, CheckCircle,
  MessageSquare, Bot, Cpu, Figma, Image,
  Droplets, Wrench, Sparkles, Palette,
  Globe, Code, Terminal, Server, Database,
  Shield, Zap, Link, Search, Home, User,
  Settings, Clock, Cloud, MapPin, ExternalLink,
  Plus, Trash2, Edit3, GripVertical, ChevronLeft,
  ChevronRight, Sun, Moon, RefreshCw, X, Pin,
  FolderOpen, Heart, Music, Video, Camera,
  Map, List, Filter, Share, Download, Upload,
}
