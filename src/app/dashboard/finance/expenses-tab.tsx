"use client"

import { useTransition } from "react"
import { updateExpenseStatus } from "./actions"
import { NewExpenseDialog } from "./new-expense-dialog"
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
import { Check, X, FileText, User } from "lucide-react"

type Expense = {
  id: string
  description: string
  amount: number
  startDate: Date
  endDate: Date
  category: string
  status: string
  receiptUrl: string | null
  submitter: {
    name: string | null
    email: string
  }
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "PENDING":
      return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending</Badge>
    case "APPROVED":
      return <Badge className="bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20">Approved</Badge>
    case "REJECTED":
      return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Rejected</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function ExpensesTab({ expenses, isAdmin }: { expenses: Expense[], isAdmin: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Organisational Expenses</h3>
          <p className="text-sm text-slate-600">Track and manage internal spending.</p>
        </div>
        <NewExpenseDialog />
      </div>

      <div className="border border-slate-200 rounded-xl bg-white/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-white border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-slate-600">Date</TableHead>
              <TableHead className="text-slate-600">Description</TableHead>
              <TableHead className="text-slate-600">Category</TableHead>
              <TableHead className="text-slate-600">Submitter</TableHead>
              <TableHead className="text-slate-600 text-right">Amount</TableHead>
              <TableHead className="text-slate-600 text-center">Status</TableHead>
              <TableHead className="text-slate-600 w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-slate-500">
                  No expenses logged yet.
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow key={expense.id} className="border-b border-slate-200/50 hover:bg-slate-100/30">
                  <TableCell className="text-slate-700">
                    <div className="text-xs">
                      {format(new Date(expense.startDate), "MMM d")} - {format(new Date(expense.endDate), "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-slate-900">{expense.description}</p>
                    {expense.receiptUrl && (
                      <a href="#" className="text-xs text-blue-400 hover:underline flex items-center mt-1">
                        <FileText className="w-3 h-3 mr-1" /> View Receipt
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-slate-600 border-slate-300">
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-slate-700">
                      <User className="w-3 h-3 mr-2 text-slate-500" />
                      {expense.submitter.name || expense.submitter.email}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-slate-900">
                    ZAR {expense.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={expense.status} />
                  </TableCell>
                  <TableCell>
                    {isAdmin && expense.status === "PENDING" && (
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={isPending}
                          onClick={() => startTransition(() => updateExpenseStatus(expense.id, "APPROVED"))}
                          className="h-8 w-8 text-slate-500 hover:text-brand-cyan hover:bg-brand-cyan/10"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={isPending}
                          onClick={() => startTransition(() => updateExpenseStatus(expense.id, "REJECTED"))}
                          className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
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
