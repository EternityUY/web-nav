import { useState } from 'react'
import { useNavStore } from '../../stores/useNavStore'
import CategoryEditor from './CategoryEditor'
import LinkEditor from './LinkEditor'
import type { NavData } from '../../types'
import { X, Save, Undo2, FileDown, FileUp, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function EditorPanel() {
  const { navData, setEditing, saveNav } = useNavStore()
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
      <div className="relative ml-auto w-full max-w-lg h-full bg-zinc-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-base font-semibold text-white/90">编辑导航</h2>
          <button
            onClick={() => setEditing(false)}
            className="rounded-lg p-1.5 text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 px-5">
          <button
            onClick={() => setTab('links')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === 'links'
                ? 'border-blue-400 text-white'
                : 'border-transparent text-white/40 hover:text-white/60'
            }`}
          >
            链接
          </button>
          <button
            onClick={() => setTab('categories')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === 'categories'
                ? 'border-blue-400 text-white'
                : 'border-transparent text-white/40 hover:text-white/60'
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
                ? 'bg-green-500/10 text-green-400'
                : 'bg-red-500/10 text-red-400'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            {message.text}
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10 flex items-center gap-2">
          <button
            onClick={handleImport}
            className="px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white/70 bg-white/5 hover:bg-white/10 transition-colors"
            title="导入 JSON 备份"
          >
            <FileUp size={14} />
          </button>
          <button
            onClick={handleExport}
            className="px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white/70 bg-white/5 hover:bg-white/10 transition-colors"
            title="导出 JSON 备份"
          >
            <FileDown size={14} />
          </button>

          <div className="flex-1" />

          <button
            onClick={() => setDraft(JSON.parse(JSON.stringify(navData)))}
            className="px-4 py-2 rounded-lg text-xs text-white/50 hover:text-white/70 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1.5"
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
      </div>
    </div>
  )
}
