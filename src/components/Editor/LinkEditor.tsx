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
      <h3 className="text-sm font-medium text-white/70">链接管理</h3>

      {data.categories.map((cat, ci) => (
        <div key={ci} className="rounded-lg bg-white/[0.04] border border-white/[0.06] p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-white/50 uppercase">{cat.name}</h4>
            <button
              onClick={() => addLink(ci)}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Plus size={12} />
              添加链接
            </button>
          </div>

          <div className="space-y-2">
            {cat.links.map((link, li) => (
              <div
                key={li}
                className="flex items-start gap-2 rounded-lg bg-white/[0.04] p-2 border border-white/[0.04]"
              >
                <div className="flex-1 min-w-0 space-y-1.5">
                  {/* Row 1: Name + URL */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => updateLink(ci, li, 'name', e.target.value)}
                      className="flex-1 bg-white/10 text-sm text-white/90 outline-none rounded px-2 py-1 border border-white/10 focus:border-blue-400/50 transition-colors"
                      placeholder="名称"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => updateLink(ci, li, 'url', e.target.value)}
                      className="flex-[2] bg-white/10 text-sm text-white/70 outline-none rounded px-2 py-1 border border-white/10 focus:border-blue-400/50 transition-colors font-mono"
                      placeholder="https://..."
                    />
                  </div>

                  {/* Row 2: Icon + Description */}
                  <div className="flex gap-2">
                    <select
                      value={link.icon}
                      onChange={(e) => updateLink(ci, li, 'icon', e.target.value)}
                      className="bg-white/10 text-white/60 text-xs rounded px-2 py-1 border border-white/10 outline-none focus:border-white/30"
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
                      className="flex-1 bg-white/10 text-xs text-white/60 outline-none rounded px-2 py-1 border border-white/10 focus:border-white/30 transition-colors"
                      placeholder="描述（可选）"
                    />

                    {/* Pin toggle */}
                    <button
                      onClick={() => updateLink(ci, li, 'pinned', !link.pinned)}
                      className={`p-1 rounded transition-colors ${
                        link.pinned
                          ? 'text-yellow-400 bg-yellow-400/10'
                          : 'text-white/30 hover:text-white/60'
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
