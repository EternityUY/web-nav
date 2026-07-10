import type { LinkItem, NavData } from '../../types'
import { Trash2, Pin, Plus } from 'lucide-react'
import { ICON_OPTIONS } from '../../utils/icons'

interface LinkEditorProps {
  data: NavData
  onChange: (data: NavData) => void
}

export default function LinkEditor({ data, onChange }: LinkEditorProps) {
  const addLink = (catIndex: number) => {
    const cats = data.categories.map((cat, i) => {
      if (i !== catIndex) return cat
      return {
        ...cat,
        links: [
          ...cat.links,
          { name: '新链接', url: 'https://', icon: 'link', description: '', pinned: false },
        ],
      }
    })
    onChange({ ...data, categories: cats })
  }

  const updateLink = (
    catIndex: number,
    linkIndex: number,
    field: keyof LinkItem,
    value: string | boolean,
  ) => {
    const cats = data.categories.map((cat, ci) => {
      if (ci !== catIndex) return cat
      return {
        ...cat,
        links: cat.links.map((link, li) =>
          li === linkIndex ? { ...link, [field]: value } : link,
        ),
      }
    })
    onChange({ ...data, categories: cats })
  }

  const removeLink = (catIndex: number, linkIndex: number) => {
    const cats = data.categories.map((cat, ci) => {
      if (ci !== catIndex) return cat
      return { ...cat, links: cat.links.filter((_, li) => li !== linkIndex) }
    })
    onChange({ ...data, categories: cats })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium dark:text-white/70 text-gray-700">链接管理</h3>

      {data.categories.map((cat, ci) => (
        <div key={ci} className="rounded-lg dark:bg-white/[0.04] dark:border-white/[0.06] bg-gray-50/50 border border-gray-100 p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium dark:text-white/50 text-gray-500 uppercase">{cat.name}</h4>
            <button
              onClick={() => addLink(ci)}
              className="flex items-center gap-1 text-xs dark:text-blue-400 dark:hover:text-blue-300 text-blue-600 hover:text-blue-500 transition-colors"
            >
              <Plus size={12} />
              添加链接
            </button>
          </div>

          <div className="space-y-2">
            {cat.links.map((link, li) => (
              <div
                key={li}
                className="flex items-start gap-2 rounded-lg dark:bg-white/[0.04] dark:border-white/[0.04] bg-gray-50 border border-gray-100 p-2"
              >
                <div className="flex-1 min-w-0 space-y-1.5">
                  {/* Row 1: Name + URL */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => updateLink(ci, li, 'name', e.target.value)}
                      className="flex-1 dark:bg-white/10 dark:text-white/90 bg-gray-100 text-gray-800 text-sm outline-none rounded px-2 py-1 border dark:border-white/10 border-gray-200 focus:border-blue-400/50 transition-colors"
                      placeholder="名称"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => updateLink(ci, li, 'url', e.target.value)}
                      className="flex-[2] dark:bg-white/10 dark:text-white/70 bg-gray-100 text-gray-600 text-sm outline-none rounded px-2 py-1 border dark:border-white/10 border-gray-200 focus:border-blue-400/50 transition-colors font-mono"
                      placeholder="https://..."
                    />
                  </div>

                  {/* Row 2: Icon + Description */}
                  <div className="flex gap-2">
                    <select
                      value={link.icon}
                      onChange={(e) => updateLink(ci, li, 'icon', e.target.value)}
                      className="dark:bg-white/10 dark:text-white/60 bg-gray-100 text-gray-600 text-xs rounded px-2 py-1 border dark:border-white/10 border-gray-200 outline-none focus:border-gray-400 dark:focus:border-white/30 transition-colors"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={link.description || ''}
                      onChange={(e) => updateLink(ci, li, 'description', e.target.value)}
                      className="flex-1 dark:bg-white/10 dark:text-white/60 bg-gray-100 text-gray-600 text-xs outline-none rounded px-2 py-1 border dark:border-white/10 border-gray-200 focus:border-gray-400 dark:focus:border-white/30 transition-colors"
                      placeholder="描述（可选）"
                    />

                    {/* Pin toggle */}
                    <button
                      onClick={() => updateLink(ci, li, 'pinned', !link.pinned)}
                      className={`p-1 rounded transition-colors ${
                        link.pinned
                          ? 'text-yellow-400 bg-yellow-400/10'
                          : 'dark:text-white/30 dark:hover:text-white/60 text-gray-400 hover:text-gray-600'
                      }`}
                      title={link.pinned ? '取消固定' : '固定'}
                    >
                      <Pin size={14} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => removeLink(ci, li)}
                      className="p-1 text-red-400/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
