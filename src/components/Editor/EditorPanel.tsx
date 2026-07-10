import { useState } from 'react'
import { useNavStore } from '../../stores/useNavStore'
import CategoryEditor from './CategoryEditor'
import LinkEditor from './LinkEditor'
import type { NavData } from '../../types'
import { X, Save, Undo2, FileDown, FileUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import LiquidGlass from 'liquid-glass-react'
import { getGlassPreset } from '../../utils/glassPresets'

export default function EditorPanel() {
  const { navData, setEditing, saveNav, darkMode } = useNavStore()
  const glassPreset = getGlassPreset('panel', darkMode)
  const [draft, setDraft] = useState<NavData>(() =>
    navData ? JSON.parse(JSON.stringify(navData)) : { categories: [] },
  )
  const [tab, setTab] = useState<'categories' | 'links'>('links')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  if (!navData) return null

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSave = async () => {
    setSaving(true)
    const ok = await saveNav(draft)
    setSaving(false)
    if (ok) {
      showMessage('success', '保存成功')
    } else {
      showMessage('error', '保存失败')
    }
  }

  const handleExport = () => {
    const raw = JSON.stringify(draft, null, 2)
    const blob = new Blob([raw], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'nav-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,.yaml,.yml'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const parsed = JSON.parse(text) as NavData
        if (parsed.categories && Array.isArray(parsed.categories)) {
          setDraft(parsed)
          showMessage('success', '导入成功')
        } else {
          showMessage('error', '无效的数据格式')
        }
      } catch {
        showMessage('error', '文件解析失败')
      }
    }
    input.click()
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setEditing(false)}
      />

      {/* Panel */}
      <LiquidGlass {...glassPreset} overLight={!darkMode} className="relative ml-auto w-full max-w-lg h-full glass-dropdown shadow-2xl flex flex-col" padding="0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b dark:border-white/10 border-gray-200">
          <h2 className="text-base font-semibold dark:text-white/90 text-gray-800">编辑导航</h2>
          <button
            onClick={() => setEditing(false)}
            className="rounded-lg p-1.5 dark:text-white/40 dark:hover:text-white/80 dark:hover:bg-white/10 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b dark:border-white/10 border-gray-200 px-5">
          <button
            onClick={() => setTab('links')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === 'links'
                ? 'dark:border-blue-400 dark:text-white border-blue-500 text-blue-600'
                : 'dark:border-transparent dark:text-white/40 dark:hover:text-white/60 border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            链接
          </button>
          <button
            onClick={() => setTab('categories')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === 'categories'
                ? 'dark:border-blue-400 dark:text-white border-blue-500 text-blue-600'
                : 'dark:border-transparent dark:text-white/40 dark:hover:text-white/60 border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            分类
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 edit-panel-scroll">
          {tab === 'categories' ? (
            <CategoryEditor data={draft} onChange={setDraft} />
          ) : (
            <LinkEditor data={draft} onChange={setDraft} />
          )}
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mx-5 mb-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
              message.type === 'success'
                ? 'dark:bg-green-500/10 dark:text-green-400 bg-green-50 text-green-600'
                : 'dark:bg-red-500/10 dark:text-red-400 bg-red-50 text-red-600'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            {message.text}
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-4 border-t dark:border-white/10 border-gray-200 flex items-center gap-2">
          <button
            onClick={handleImport}
            className="px-3 py-2 rounded-lg text-xs dark:text-white/50 dark:hover:text-white/70 dark:bg-white/5 dark:hover:bg-white/10 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            title="导入 JSON 备份"
          >
            <FileUp size={14} />
          </button>
          <button
            onClick={handleExport}
            className="px-3 py-2 rounded-lg text-xs dark:text-white/50 dark:hover:text-white/70 dark:bg-white/5 dark:hover:bg-white/10 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            title="导出 JSON 备份"
          >
            <FileDown size={14} />
          </button>

          <div className="flex-1" />

          <button
            onClick={() => setDraft(JSON.parse(JSON.stringify(navData)))}
            className="px-4 py-2 rounded-lg text-xs dark:text-white/50 dark:hover:text-white/70 dark:bg-white/5 dark:hover:bg-white/10 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-1.5"
          >
            <Undo2 size={14} />
            重置
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-lg text-xs font-medium bg-blue-500 hover:bg-blue-400 text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </LiquidGlass>
    </div>
  )
}
