import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { Shield, Home, Users, Briefcase, FileText, Settings, LogOut, GraduationCap, LayoutDashboard, Inbox, Target, Building2, DollarSign, UserCheck, CheckSquare, FolderOpen, BadgeInfo } from "lucide-react"
import { ForcePasswordChange } from "./force-password-change"

const NAVIGATION = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Leads", href: "/dashboard/leads", icon: Inbox },
  { name: "Deals", href: "/dashboard/deals", icon: Target },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Projects", href: "/dashboard/projects", icon: Briefcase },
  { name: "Programmes", href: "/dashboard/programmes", icon: GraduationCap },
  { name: "Delegates", href: "/dashboard/delegates", icon: BadgeInfo },
  { name: "Finance", href: "/dashboard/finance", icon: DollarSign },
  { name: "HR", href: "/dashboard/hr", icon: UserCheck },
  { name: "Accounts", href: "/dashboard/accounts", icon: Building2 },
  { name: "Contacts", href: "/dashboard/contacts", icon: Users },
  { name: "Documents", href: "/dashboard/documents", icon: FolderOpen },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Users", href: "/dashboard/users", icon: Shield, adminOnly: true },
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Force password change check
  if ((session.user as any).forcePasswordChange) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
        <ForcePasswordChange />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
        <div className="h-20 flex items-center px-6 border-b border-slate-200 bg-white">
          <img src="/Logo.jpg" alt="SADI Logo" className="h-10 mr-4 object-contain rounded" />
          <span className="font-bold text-lg tracking-wide text-brand-navy">SADI CRM</span>
        </div>
        
        <nav className="flex-1 py-8 px-5 space-y-2 overflow-y-auto">
          {NAVIGATION.map((item) => {
            if (item.adminOnly && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
              return null
            }
            return (
              <a 
                key={item.name} 
                href={item.href} 
                className="flex items-center px-4 py-3 text-slate-600 hover:text-brand-navy hover:bg-slate-50 rounded-xl text-base font-medium transition-all group"
              >
                <item.icon className="w-5 h-5 mr-4 text-slate-400 group-hover:text-brand-cyan transition-colors" /> {item.name}
              </a>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}>
            <button type="submit" className="w-full flex items-center px-3 py-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors">
              <LogOut className="w-4 h-4 mr-3" /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
        <header className="h-20 flex items-center justify-between px-10 border-b border-slate-200 bg-white/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center text-slate-700 text-base font-medium">
            <span>Welcome back, {session.user.name}</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-brand-cyan transition-colors">
              <Settings className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-navy to-brand-cyan flex items-center justify-center text-base font-bold text-white shadow-md">
              {session.user.name?.[0] || "U"}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
