"use client"

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
import { Button } from "@/components/ui/button"
import { FileText, Download, Building2 } from "lucide-react"

type Invoice = {
  id: string
  invoiceNo: string
  amount: number
  status: string
  issueDate: Date
  dueDate: Date
  deal: { name: string, account: { name: string } | null } | null
  programme: { title: string } | null
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "DRAFT":
      return <Badge className="bg-zinc-500/10 text-slate-600 border-zinc-500/20">Draft</Badge>
    case "SENT":
      return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Sent</Badge>
    case "PAID":
      return <Badge className="bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20">Paid</Badge>
    case "OVERDUE":
      return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Overdue</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function InvoicesTab({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Client Invoices</h3>
          <p className="text-sm text-slate-600">Manage billing and collections.</p>
        </div>
        {/* We will add an invoice generator later or generate from Deals/Programmes directly */}
        <Button className="bg-slate-100 text-slate-500 cursor-not-allowed" disabled>
          Generate from Deals view
        </Button>
      </div>

      <div className="border border-slate-200 rounded-xl bg-white/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-white border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-slate-600">Invoice No</TableHead>
              <TableHead className="text-slate-600">Client / Source</TableHead>
              <TableHead className="text-slate-600">Issue Date</TableHead>
              <TableHead className="text-slate-600">Due Date</TableHead>
              <TableHead className="text-slate-600 text-right">Amount</TableHead>
              <TableHead className="text-slate-600 text-center">Status</TableHead>
              <TableHead className="text-slate-600 w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-slate-500">
                  No invoices generated yet.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-b border-slate-200/50 hover:bg-slate-100/30">
                  <TableCell className="font-medium text-slate-900">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-slate-500" />
                      {invoice.invoiceNo}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900 flex items-center">
                        <Building2 className="w-3 h-3 mr-1 text-slate-500" />
                        {invoice.deal?.account?.name || "Unknown Client"}
                      </span>
                      <span className="text-xs text-slate-500">
                        {invoice.programme?.title || invoice.deal?.name || "-"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {format(new Date(invoice.issueDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right font-medium text-slate-900">
                    ZAR {invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <a href={`/api/invoices/${invoice.id}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="h-8 text-xs border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                        <Download className="w-3 h-3 mr-1" /> PDF
                      </Button>
                    </a>
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
