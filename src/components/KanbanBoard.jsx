import { useState, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useLanguage } from '../i18n/LanguageContext'
import { languages } from '../i18n/translations'
import { useDarkMode } from '../hooks/useDarkMode'
import Column from './Column'
import AddTaskForm from './AddTaskForm'
import SearchBar from './SearchBar'
import TaskEditModal from './TaskEditModal'

const COLUMNS = [
  { id: 'todo', color: 'bg-yellow-50/80 dark:bg-yellow-900/20' },
  { id: 'inprogress', color: 'bg-blue-50/80 dark:bg-blue-900/20' },
  { id: 'done', color: 'bg-green-50/80 dark:bg-green-900/20' },
]

export default function KanbanBoard() {
  const { t, lang, setLang } = useLanguage()
  const { isDark, toggle: toggleDark } = useDarkMode()
  const [tasks, setTasks] = useLocalStorage('notelane-tasks', [])
  const [activeTask, setActiveTask] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks
    const q = searchQuery.toLowerCase()
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.content.toLowerCase().includes(q),
    )
  }, [tasks, searchQuery])

  const addTask = (title, content, priority) => {
    const columnTasks = tasks.filter((t) => t.column === 'todo')
    const maxOrder = columnTasks.reduce((m, t) => Math.max(m, t.order ?? 0), -1)
    const newTask = {
      id: crypto.randomUUID(),
      title,
      content,
      column: 'todo',
      priority: priority || 'none',
      order: maxOrder + 1,
      createdAt: Date.now(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const updateTask = (updated) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    setEditingTask(null)
  }

  const findColumn = (id) => {
    const task = tasks.find((t) => t.id === id)
    if (task) return task.column
    const col = COLUMNS.find((c) => c.id === id)
    return col ? col.id : null
  }

  const handleDragStart = (event) => {
    const task = tasks.find((t) => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = (event) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeCol = findColumn(active.id)
    const overCol = findColumn(over.id)
    if (!activeCol || !overCol) return

    setTasks((prev) => {
      if (activeCol === overCol) {
        const columnTasks = prev
          .filter((t) => t.column === activeCol)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        const ids = columnTasks.map((t) => t.id)
        const oldIdx = ids.indexOf(active.id)
        const newIdx = ids.indexOf(over.id)
        if (oldIdx === -1 || newIdx === -1) return prev
        const reordered = arrayMove(columnTasks, oldIdx, newIdx)
        const updated = reordered.map((t, i) => ({ ...t, order: i }))
        const other = prev.filter((t) => t.column !== activeCol)
        return [...other, ...updated]
      } else {
        const sourceTasks = prev
          .filter((t) => t.column === activeCol)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        const targetTasks = prev
          .filter((t) => t.column === overCol)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        const overIdx = targetTasks.findIndex((t) => t.id === over.id)
        const insertAt = overIdx >= 0 ? overIdx : targetTasks.length
        const movingTask = prev.find((t) => t.id === active.id)
        if (!movingTask) return prev
        const updated = prev.map((t) => {
          if (t.id === active.id) {
            return { ...t, column: overCol, order: insertAt }
          }
          if (t.column === overCol && (t.order ?? 0) >= insertAt) {
            return { ...t, order: (t.order ?? 0) + 1 }
          }
          if (t.column === activeCol && (t.order ?? 0) > (movingTask.order ?? 0)) {
            return { ...t, order: (t.order ?? 0) - 1 }
          }
          return t
        })
        return updated
      }
    })
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `notelane-export-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result)
          if (!Array.isArray(data)) throw new Error()
          const validated = data.map((t, i) => ({
            id: t.id || crypto.randomUUID(),
            title: t.title || 'Untitled',
            content: t.content || '',
            column: ['todo', 'inprogress', 'done'].includes(t.column)
              ? t.column
              : 'todo',
            priority: ['none', 'high', 'medium', 'low'].includes(t.priority)
              ? t.priority
              : 'none',
            order: typeof t.order === 'number' ? t.order : i,
            createdAt: t.createdAt || Date.now(),
          }))
          setTasks(validated)
          input.remove()
        } catch {
          alert(t('board.import_error'))
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            NoteLane
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title={isDark ? t('board.light') : t('board.dark')}
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM17.661 14.596a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 011.06-1.06l1.06 1.06zM4.939 5.404a.75.75 0 011.06-1.06l1.06 1.06a.75.75 0 01-1.06 1.06l-1.06-1.06z" />
                </svg>
              )}
            </button>
            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    lang === l.code
                      ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">
              {t('board.task_count', { count: tasks.length })}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <button
            onClick={handleExport}
            disabled={tasks.length === 0}
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {t('board.export')}
          </button>
          <button
            onClick={handleImport}
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors whitespace-nowrap"
          >
            {t('board.import')}
          </button>
        </div>

        <AddTaskForm onAdd={addTask} />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {COLUMNS.map((col) => {
              const colTasks = filteredTasks.filter(
                (t) => t.column === col.id,
              )
              return (
                <Column
                  key={col.id}
                  column={col}
                  tasks={colTasks}
                  onDelete={deleteTask}
                  onEdit={setEditingTask}
                />
              )
            })}
          </div>

          {filteredTasks.length === 0 && tasks.length > 0 && (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500">
              {t('board.no_results')}
            </div>
          )}

          {tasks.length === 0 && !searchQuery && (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500">
              {t('board.no_results')}
            </div>
          )}

          <DragOverlay>
            {activeTask ? (
              <div className="bg-white dark:bg-slate-700 rounded-lg shadow-xl border-2 border-indigo-400 dark:border-indigo-500 p-4 opacity-90 rotate-2 scale-105 w-72">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {activeTask.title}
                </h3>
                {activeTask.content && (
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {activeTask.content}
                  </div>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onSave={updateTask}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </div>
  )
}
