import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useLanguage } from '../i18n/LanguageContext'
import MarkdownPreview from './MarkdownPreview'

const priorityBadge = {
  none: null,
  high: { label: 'priority.high', class: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' },
  medium: { label: 'priority.medium', class: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300' },
  low: { label: 'priority.low', class: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' },
}

export default function TaskCard({ task, onDelete, onEdit }) {
  const { t } = useLanguage()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const badge = priorityBadge[task.priority] || null

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onEdit?.(task)}
      className={`bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 p-4 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md ${
        isDragging ? 'opacity-50 ring-2 ring-indigo-400 z-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">
            {task.title}
          </h3>
          {badge && (
            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${badge.class}`}>
              {t(badge.label)}
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(task.id)
          }}
          className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 flex-shrink-0 ml-2"
          title={t('task.delete')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c-.84 0-1.673.025-2.5.075V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.325C11.673 4.025 10.84 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.42.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {task.content && (
        <div className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
          <MarkdownPreview content={task.content} />
        </div>
      )}

      <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
        {new Date(task.createdAt).toLocaleDateString()}
      </div>
    </div>
  )
}
