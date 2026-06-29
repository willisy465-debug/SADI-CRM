import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NewProgrammeDialog } from "./new-programme-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Calendar, Users, MapPin } from "lucide-react"

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

export default async function ProgrammesPage() {
  const session = await auth()
  
  const programmes = await prisma.programme.findMany({
    orderBy: { startDate: "asc" },
    include: {
      _count: {
        select: { delegates: true, facilitators: true }
      },
      logistics: true
    }
  })

  return (
    <div className="p-8 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Programmes</h1>
          <p className="text-slate-600 mt-1 text-sm">Manage training deliveries and operations.</p>
        </div>
        <NewProgrammeDialog />
      </div>

      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-white border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-slate-600">Programme Title</TableHead>
              <TableHead className="text-slate-600">Dates</TableHead>
              <TableHead className="text-slate-600">Location/Type</TableHead>
              <TableHead className="text-slate-600 text-center">Attendees</TableHead>
              <TableHead className="text-slate-600">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programmes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                  No programmes found. Create a new programme to get started.
                </TableCell>
              </TableRow>
            ) : (
              programmes.map((prog) => (
                <TableRow key={prog.id} className="border-b border-slate-200/50 hover:bg-slate-100/30 transition-colors">
                  <TableCell className="font-medium text-slate-900">
                    <a href={`/dashboard/programmes/${prog.id}`} className="hover:text-brand-cyan transition-colors">
                      {prog.title}
                    </a>
                  </TableCell>
                  <TableCell className="text-slate-700">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-3 h-3 mr-2 text-slate-500" />
                      {format(new Date(prog.startDate), "MMM d")} - {format(new Date(prog.endDate), "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-700">
                    <div className="flex flex-col gap-1 text-sm text-slate-600">
                      <span className="font-medium text-slate-700">{prog.type.replace("_", " ")}</span>
                      {prog.logistics?.venueName && (
                        <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {prog.logistics.venueName}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-slate-600">
                    <span className="flex items-center justify-center gap-1">
                      <Users className="w-3 h-3 text-brand-cyan" />
                      {prog._count.delegates}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={prog.status} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100" />}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4 text-slate-600" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-slate-200 text-slate-700">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="focus:bg-slate-100 focus:text-slate-900 cursor-pointer" render={<a href={`/dashboard/programmes/${prog.id}`} />}>
                          Manage operations
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
