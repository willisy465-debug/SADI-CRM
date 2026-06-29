import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NewLeadDialog } from "./new-lead-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { LeadActions } from "./lead-actions"
import { MoreHorizontal, Mail, Phone } from "lucide-react"

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "NEW":
      return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">New</Badge>
    case "CONTACTED":
      return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Contacted</Badge>
    case "QUALIFIED":
      return <Badge className="bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20">Qualified</Badge>
    case "LOST":
      return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Lost</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default async function LeadsPage() {
  const session = await auth()
  
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-8 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leads</h1>
          <p className="text-slate-600 mt-1 text-sm">Manage incoming inquiries and prospective clients.</p>
        </div>
        <NewLeadDialog />
      </div>

      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-white border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-slate-600">Name</TableHead>
              <TableHead className="text-slate-600">Company</TableHead>
              <TableHead className="text-slate-600">Contact</TableHead>
              <TableHead className="text-slate-600">Status</TableHead>
              <TableHead className="text-slate-600 text-right">Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                  No leads found. Create a new lead to get started.
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead.id} className="border-b border-slate-200/50 hover:bg-slate-100/30 transition-colors">
                  <TableCell className="font-medium text-slate-900">
                    {lead.firstName} {lead.lastName}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {lead.company || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm text-slate-600">
                      <span className="flex items-center"><Mail className="w-3 h-3 mr-2" /> {lead.email}</span>
                      {lead.phone && <span className="flex items-center"><Phone className="w-3 h-3 mr-2" /> {lead.phone}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className="text-right text-slate-600 text-sm">
                    {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <LeadActions leadId={lead.id} leadName={`${lead.firstName} ${lead.lastName}`} />
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
