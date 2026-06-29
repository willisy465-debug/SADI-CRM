import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NewDealDialog } from "./new-deal-dialog"
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
import { DealActions } from "./deal-actions"
import { Building2, Banknote } from "lucide-react"

function StageBadge({ stage }: { stage: string }) {
  switch (stage) {
    case "PROSPECTING":
      return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Prospecting</Badge>
    case "QUALIFICATION":
      return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">Qualification</Badge>
    case "PROPOSAL":
      return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Proposal Sent</Badge>
    case "WON":
      return <Badge className="bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20">Closed Won</Badge>
    case "LOST":
      return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Closed Lost</Badge>
    default:
      return <Badge variant="outline">{stage}</Badge>
  }
}

export default async function DealsPage() {
  const session = await auth()
  
  const deals = await prisma.deal.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      account: {
        select: { name: true }
      },
      programme: {
        select: { id: true }
      }
    }
  })

  const accounts = await prisma.account.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" }
  })

  return (
    <div className="p-8 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Deals & Pipeline</h1>
          <p className="text-slate-600 mt-1 text-sm">Track revenue opportunities and pipeline stages.</p>
        </div>
        <NewDealDialog accounts={accounts} />
      </div>

      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-white border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-slate-600">Deal Name</TableHead>
              <TableHead className="text-slate-600">Account</TableHead>
              <TableHead className="text-slate-600 text-right">Amount</TableHead>
              <TableHead className="text-slate-600">Stage</TableHead>
              <TableHead className="text-slate-600 text-right">Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                  No deals found. Create a new deal to get started.
                </TableCell>
              </TableRow>
            ) : (
              deals.map((deal) => (
                <TableRow key={deal.id} className="border-b border-slate-200/50 hover:bg-slate-100/30 transition-colors">
                  <TableCell className="font-medium text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center border border-slate-300">
                      <Banknote className="w-4 h-4 text-brand-cyan" />
                    </div>
                    {deal.name}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {deal.account ? (
                      <span className="flex items-center text-sm">
                        <Building2 className="w-3 h-3 mr-2 text-slate-500" />
                        {deal.account.name}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-slate-900 font-medium">
                    {deal.amount ? new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(deal.amount) : "-"}
                  </TableCell>
                  <TableCell>
                    <StageBadge stage={deal.stage} />
                  </TableCell>
                  <TableCell className="text-right text-slate-600 text-sm">
                    {formatDistanceToNow(new Date(deal.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <DealActions dealId={deal.id} hasProgramme={!!deal.programme} />
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
