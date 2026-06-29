"use client"

import { useTransition } from "react"
import { updateTaskStatus } from "./actions"
import { format } from "date-fns"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Calendar, AlertCircle, User, Briefcase } from "lucide-react"

export function TaskItem({ task }: { task: any }) {
  const [isPending, startTransition] = useTransition()

  const priorityColors: Record<string, string> = {
    HIGH: "text-red-400 bg-red-400/10",
    MEDIUM: "text-amber-400 bg-amber-400/10",
    LOW: "text-blue-400 bg-blue-400/10"
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 hover:border-slate-300 transition-colors shadow-sm group">
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-medium text-slate-900">{task.title}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="w-4 h-4 text-slate-500 hover:text-slate-700" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-slate-200 text-slate-700">
            {task.status !== "TODO" && (
              <DropdownMenuItem 
                onClick={() => startTransition(() => updateTaskStatus(task.id, "TODO"))}
                className="focus:bg-slate-100 focus:text-slate-900 cursor-pointer"
              >
                Move to To Do
              </DropdownMenuItem>
            )}
            {task.status !== "IN_PROGRESS" && (
              <DropdownMenuItem 
                onClick={() => startTransition(() => updateTaskStatus(task.id, "IN_PROGRESS"))}
                className="focus:bg-slate-100 focus:text-slate-900 cursor-pointer"
              >
                Move to In Progress
              </DropdownMenuItem>
            )}
            {task.status !== "COMPLETED" && (
              <DropdownMenuItem 
                onClick={() => startTransition(() => updateTaskStatus(task.id, "COMPLETED"))}
                className="focus:bg-slate-100 focus:text-slate-900 cursor-pointer"
              >
                Mark Completed
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {task.description && (
        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{task.description}</p>
      )}

      {task.project && (
        <div className="mt-3 flex items-center">
          <span className="text-xs text-slate-600 flex items-center bg-slate-100/50 px-2 py-1 rounded-md border border-slate-300/50">
            <Briefcase className="w-3 h-3 mr-1.5 text-brand-cyan" />
            {task.project.name}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 mt-4">
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center ${priorityColors[task.priority]}`}>
          {task.priority === "HIGH" && <AlertCircle className="w-3 h-3 mr-1" />}
          {task.priority}
        </span>
        <div className="flex gap-3">
          {task.assignee?.name && (
            <span className="text-xs text-slate-500 flex items-center bg-slate-100/50 px-1.5 py-0.5 rounded">
              <User className="w-3 h-3 mr-1" />
              {task.assignee.name}
            </span>
          )}
          {task.dueDate && (
            <span className="text-xs text-slate-500 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {format(new Date(task.dueDate), "MMM d")}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
