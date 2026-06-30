import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import MarkdownPreview from './MarkdownPreview'

const PRIORITIES = ['none', 'high', 'medium', 'low']

const priorityColors = {
  none: 'bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300',
  high: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  medium: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
  low: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
}

export default function TaskEditModal({ task, onSave, onCancel }) {
  const { t } = useLanguage()
  const [title, setTitle] = useState(task.title)
  const [content, setContent] = useState(task.content)
  const [priority, setPriority] = useState(task.priority || 'none')
  const [showPreview, setShowPreview] = useState(false)

  const handleSave = () => {
    if (!title.trim()) return
    onSave({ ...task, title: title.trim(), content: content.trim(), priority })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {t('edit.title')}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t('edit.title_label')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              autoFocus
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('edit.content_label')}
              </label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {showPreview ? t('edit.edit') : t('edit.preview')}
              </button>
            </div>
            {showPreview ? (
              <div className="min-h-[120px] p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50">
                <MarkdownPreview content={content} />
                {!content && (
                  <span className="text-slate-400 text-sm italic">(empty)</span>
                )}
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm resize-none font-mono"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t('edit.priority_label')}
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    priority === p
                      ? `${priorityColors[p]} ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-slate-800`
                      : `${priorityColors[p]} opacity-60 hover:opacity-100`
                  }`}
                >
                  {t(`priority.${p}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {t('edit.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t('edit.save')}
          </button>
        </div>
      </div>
    </div>
  )
}
