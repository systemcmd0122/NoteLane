import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

const PRIORITIES = ['none', 'high', 'medium', 'low']

const priorityColors = {
  none: 'bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300',
  high: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  medium: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
  low: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
}

export default function AddTaskForm({ onAdd }) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [priority, setPriority] = useState('none')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim(), content.trim(), priority)
    setTitle('')
    setContent('')
    setPriority('none')
    setIsOpen(false)
  }

  const handleCancel = () => {
    setIsOpen(false)
    setTitle('')
    setContent('')
    setPriority('none')
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors text-sm font-medium"
      >
        {t('add.button')}
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 space-y-3"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t('add.title_placeholder')}
        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-medium"
        autoFocus
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t('add.content_placeholder')}
        rows={3}
        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm resize-none"
      />
      <div>
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
          {t('add.priority_label')}
        </label>
        <div className="flex gap-1.5">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                priority === p
                  ? `${priorityColors[p]} ring-1 ring-indigo-400`
                  : `${priorityColors[p]} opacity-50 hover:opacity-80`
              }`}
            >
              {t(`priority.${p}`)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          {t('add.cancel')}
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {t('add.submit')}
        </button>
      </div>
    </form>
  )
}
