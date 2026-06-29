import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NewTaskDialog } from "./new-task-dialog"
import { TaskList } from "./task-list"
import { redirect } from "next/navigation"

export default async function TasksPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }
  
  const tasks = await prisma.task.findMany({
    where: { assignedTo: session.user.id },
    include: { 
      assignee: { select: { name: true } },
      project: { select: { name: true } }
    },
    orderBy: [
      { status: 'asc' }, // TODO first
      { priority: 'desc' }, // HIGH first
      { createdAt: 'desc' }
    ]
  })

  const allUsers = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' }
  })

  const projects = await prisma.project.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  })

  const todos = tasks.filter(t => t.status === "TODO")
  const inProgress = tasks.filter(t => t.status === "IN_PROGRESS")
  const completed = tasks.filter(t => t.status === "COMPLETED")

  return (
    <div className="p-8 font-sans h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tasks</h1>
          <p className="text-slate-600 mt-1 text-sm">Manage your daily activities and follow-ups.</p>
        </div>
        <NewTaskDialog users={allUsers} currentUser={session.user} projects={projects} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaskList title="To Do" tasks={todos} color="border-zinc-500" />
        <TaskList title="In Progress" tasks={inProgress} color="border-amber-500" />
        <TaskList title="Completed" tasks={completed} color="border-brand-cyan" />
      </div>
    </div>
  )
}
