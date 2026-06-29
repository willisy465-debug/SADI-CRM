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
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 bg-white/50">
          <Shield className="w-5 h-5 text-brand-cyan mr-3" />
          <span className="font-semibold tracking-wide">SADI CRM</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {NAVIGATION.map((item) => {
            if (item.adminOnly && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
              return null
            }
            return (
              <a 
                key={item.name} 
                href={item.href} 
                className="flex items-center px-3 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
              >
                <item.icon className="w-4 h-4 mr-3" /> {item.name}
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
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 bg-slate-50/50 backdrop-blur-md">
          <div className="flex items-center text-slate-600 text-sm">
            <span>Welcome back, {session.user.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-600 hover:text-slate-900 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-brand-navy flex items-center justify-center text-sm font-semibold shadow-inner shadow-white/20">
              {session.user.name?.[0] || "U"}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
