import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StaffTab } from "./staff-tab"
import { LeaveTab } from "./leave-tab"
import { AttendanceTab } from "./attendance-tab"
import { redirect } from "next/navigation"

export default async function HRPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  const isAdmin = session.user.role === "ADMIN"

  const staff = await prisma.staffProfile.findMany({
    include: {
      user: { select: { name: true, email: true } }
    }
  })

  // Determine if the current user has a staff profile
  const hasProfile = staff.some(s => s.userId === session.user.id)
  const currentStaffProfile = staff.find(s => s.userId === session.user.id)

  const leaves = await prisma.leaveApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      staff: {
        include: { user: { select: { name: true } } }
      }
    }
  })

  // Fetch user's attendance records if they have a profile
  const attendanceRecords = currentStaffProfile ? await prisma.attendanceRecord.findMany({
    where: { staffId: currentStaffProfile.id },
    orderBy: { date: "desc" },
    include: { location: true },
    take: 30 // Last 30 days
  }) : []

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Human Resources</h1>
        <p className="text-slate-600 mt-1 text-sm">Manage staff profiles, attendance, and leave applications.</p>
      </div>

      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="bg-white border border-slate-200 p-1 mb-6 rounded-lg inline-flex h-10 items-center justify-center">
          <TabsTrigger value="attendance" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-md px-8 py-1.5 text-sm font-medium transition-all text-slate-600">
            Attendance & Time
          </TabsTrigger>
          <TabsTrigger value="staff" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-md px-8 py-1.5 text-sm font-medium transition-all text-slate-600">
            Staff Directory
          </TabsTrigger>
          <TabsTrigger value="leave" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-md px-8 py-1.5 text-sm font-medium transition-all text-slate-600">
            Leave Management
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance" className="outline-none">
          <AttendanceTab records={attendanceRecords} hasProfile={hasProfile} />
        </TabsContent>

        <TabsContent value="staff" className="outline-none">
          <StaffTab staff={staff} />
        </TabsContent>
        
        <TabsContent value="leave" className="outline-none">
          <LeaveTab leaves={leaves} isAdmin={isAdmin} hasProfile={hasProfile} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
