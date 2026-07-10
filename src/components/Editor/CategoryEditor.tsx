import type { Category, NavData } from '../../types'
import { Trash2, Plus } from 'lucide-react'
import { ICON_OPTIONS } from '../../utils/icons'

interface CategoryEditorProps {
  data: NavData
  onChange: (data: NavData) => void
}

export default function CategoryEditor({ data, onChange }: CategoryEditorProps) {
  const addCategory = () => {
    onChange({
      ...data,
      categories: [
        ...data.categories,
        { name: '新分类', icon: 'folder', links: [] },
      ],
    })
  }

  const updateCategory = (index: number, field: keyof Category, value: string) => {
    const cats = data.categories.map((c, i) =>
      i === index ? { ...c, [field]: value } : c,
    )
    onChange({ ...data, categories: cats })
  }

  const removeCategory = (index: number) => {
    onChange({
      ...data,
      categories: data.categories.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium dark:text-white/70 text-gray-700">分类列表</h3>
        <button
          onClick={addCategory}
          className="flex items-center gap-1 text-xs dark:text-blue-400 dark:hover:text-blue-300 text-blue-600 hover:text-blue-500 transition-colors"
        >
          <Plus size={14} />
          添加分类
        </button>
      </div>

      {data.categories.map((cat, i) => (
        <div key={i} className="rounded-lg dark:bg-white/[0.06] dark:border-white/[0.08] bg-gray-50 border border-gray-200 p-3">
          <div className="flex items-center gap-2 mb-2">
            {/* Icon picker */}
            <select
              value={cat.icon}
              onChange={(e) => updateCategory(i, 'icon', e.target.value)}
              className="dark:bg-white/10 dark:text-white/80 dark:border-white/10 bg-gray-100 text-gray-700 border border-gray-200 text-xs rounded-lg px-2 py-1 outline-none focus:border-gray-400 dark:focus:border-white/30 transition-colors"
            >
              {ICON_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            {/* Name */}
            <input
              type="text"
              value={cat.name}
              onChange={(e) => updateCategory(i, 'name', e.target.value)}
              className="flex-1 bg-transparent text-sm dark:text-white/90 text-gray-800 outline-none border-b border-transparent dark:focus:border-white/30 focus:border-gray-400 transition-colors"
              placeholder="分类名称"
            />

            {/* Delete */}
            <button
              onClick={() => removeCategory(i)}
              className="text-red-400/50 hover:text-red-400 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Links in this category */}
          {cat.links.length > 0 && (
            <div className="text-xs dark:text-white/30 text-gray-400 ml-1">
              {cat.links.length} 个链接
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
