import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, GraduationCap, ChevronLeft } from "lucide-react"
import { DelegatesTab } from "./delegates-tab"
import { FacilitatorsTab } from "./facilitators-tab"
import { LogisticsTab } from "./logistics-tab"

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "DRAFT":
      return <Badge className="bg-zinc-500/10 text-slate-600 border-zinc-500/20">Draft</Badge>
    case "CONFIRMED":
      return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Confirmed</Badge>
    case "COMPLETED":
      return <Badge className="bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20">Completed</Badge>
    case "CANCELLED":
      return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Cancelled</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default async function ProgrammePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const programme = await prisma.programme.findUnique({
    where: { id },
    include: {
      delegates: {
        include: { contact: true }
      },
      facilitators: {
        include: { facilitator: true }
      },
      logistics: true,
      deal: {
        include: { account: true }
      }
    }
  })

  if (!programme) return notFound()

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      <div className="mb-6">
        <a href="/dashboard/programmes" className="text-slate-600 hover:text-slate-900 flex items-center text-sm font-medium transition-colors w-fit">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Programmes
        </a>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{programme.title}</h1>
            <StatusBadge status={programme.status} />
          </div>
          {programme.description && (
            <p className="text-slate-600 text-lg mb-4">{programme.description}</p>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm text-slate-700">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-brand-cyan" />
              {format(new Date(programme.startDate), "MMMM d, yyyy")} - {format(new Date(programme.endDate), "MMMM d, yyyy")}
            </div>
            <div className="flex items-center">
              <GraduationCap className="w-4 h-4 mr-2 text-blue-500" />
              {programme.type.replace("_", " ")}
            </div>
            {programme.logistics?.venueName && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-red-500" />
                {programme.logistics.venueName}
              </div>
            )}
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-amber-500" />
              {programme.delegates.length} Delegates
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-white border border-slate-200 p-1 mb-6 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-md px-4 text-slate-600">Overview</TabsTrigger>
          <TabsTrigger value="delegates" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-md px-4 text-slate-600">Delegates ({programme.delegates.length})</TabsTrigger>
          <TabsTrigger value="facilitators" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-md px-4 text-slate-600">Facilitators ({programme.facilitators.length})</TabsTrigger>
          <TabsTrigger value="logistics" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-md px-4 text-slate-600">Logistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="outline-none">
          {/* Overview content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-white/50">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Programme Details</h3>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-slate-500">Source Deal</dt>
                  <dd className="text-slate-700 font-medium">{programme.deal?.name || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Client Institution</dt>
                  <dd className="text-slate-700 font-medium">{programme.deal?.account?.name || "N/A"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="delegates" className="outline-none">
          <DelegatesTab programmeId={programme.id} delegates={programme.delegates} />
        </TabsContent>

        <TabsContent value="facilitators" className="outline-none">
          <FacilitatorsTab programmeId={programme.id} assignments={programme.facilitators} />
        </TabsContent>

        <TabsContent value="logistics" className="outline-none">
          <LogisticsTab programmeId={programme.id} logistics={programme.logistics} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
