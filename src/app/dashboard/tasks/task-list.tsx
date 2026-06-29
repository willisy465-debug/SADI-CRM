"use client"

import { TaskItem } from "./task-item"

interface TaskListProps {
  title: string
  tasks: any[]
  color: string
}

export function TaskList({ title, tasks, color }: TaskListProps) {
  return (
    <div className="flex flex-col h-full bg-white/50 rounded-xl border border-slate-200/50 overflow-hidden">
      <div className={`px-4 py-3 border-t-2 ${color} bg-white flex justify-between items-center`}>
        <h3 className="font-medium text-slate-900">{title}</h3>
        <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{tasks.length}</span>
      </div>
      <div className="p-4 flex-1 overflow-y-auto space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No tasks here</p>
        ) : (
          tasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  )
}
