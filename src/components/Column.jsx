import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useLanguage } from '../i18n/LanguageContext'
import TaskCard from './TaskCard'

export default function Column({ column, tasks, onDelete, onEdit }) {
  const { t } = useLanguage()
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  const sorted = [...tasks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl p-4 min-h-[200px] transition-all duration-200 ${
        column.color
      } ${isOver ? 'ring-2 ring-indigo-400 dark:ring-indigo-500 shadow-lg' : 'ring-1 ring-slate-200 dark:ring-slate-700'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-slate-700 dark:text-slate-200">
          {t(`column.${column.id}`)}
        </h2>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-700/60 rounded-full px-2.5 py-1">
          {sorted.length}
        </span>
      </div>

      <SortableContext items={sorted.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {sorted.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDelete} onEdit={onEdit} />
          ))}
          {sorted.length === 0 && (
            <div className="text-center text-slate-400 dark:text-slate-500 text-sm py-8 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-lg">
              {t('column.empty')}
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}
