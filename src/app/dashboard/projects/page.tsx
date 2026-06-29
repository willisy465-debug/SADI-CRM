import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { NewProjectDialog } from "./new-project-dialog"
import { Briefcase, Calendar, CheckSquare, MoreVertical, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function ProjectsPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const projects = await prisma.project.findMany({
    include: {
      lead: { select: { name: true } },
      _count: { select: { tasks: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  const allUsers = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="p-8 font-sans h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-slate-600 mt-1 text-sm">Manage projects and their associated tasks.</p>
        </div>
        <NewProjectDialog users={allUsers} currentUser={session.user} />
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white/50 border border-slate-200 rounded-xl text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No projects yet</h3>
          <p className="text-slate-600 text-sm max-w-sm">Create your first project to start organizing tasks and tracking progress.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all flex flex-col group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-brand-cyan transition-colors">{project.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-300">
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <button className="text-slate-500 hover:text-slate-900 p-1 rounded-md hover:bg-slate-100 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-sm text-slate-600 line-clamp-2 mb-6 flex-1">
                {project.description || "No description provided."}
              </p>
              
              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-600 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[120px]">{project.lead?.name || "Unassigned"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-cyan" />
                    <span className="text-slate-700 font-medium">{project._count.tasks}</span>
                    <span className="text-slate-500">Tasks</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-slate-100 text-slate-700 hover:text-slate-900">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
