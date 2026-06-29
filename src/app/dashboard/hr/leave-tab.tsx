"use client"

import { useTransition } from "react"
import { updateLeaveStatus } from "./actions"
import { NewLeaveDialog } from "./new-leave-dialog"
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
import { Check, X, User } from "lucide-react"

type LeaveApplication = {
  id: string
  startDate: Date
  endDate: Date
  type: string
  status: string
  staff: {
    user: { name: string | null }
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

export function LeaveTab({ leaves, isAdmin, hasProfile }: { leaves: LeaveApplication[], isAdmin: boolean, hasProfile: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Leave Management</h3>
          <p className="text-sm text-slate-600">Track and approve staff leave requests.</p>
        </div>
        <NewLeaveDialog hasProfile={hasProfile} />
      </div>

      <div className="border border-slate-200 rounded-xl bg-white/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-white border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-slate-600">Staff Member</TableHead>
              <TableHead className="text-slate-600">Leave Type</TableHead>
              <TableHead className="text-slate-600">Duration</TableHead>
              <TableHead className="text-slate-600 text-center">Status</TableHead>
              <TableHead className="text-slate-600 w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                  No leave applications found.
                </TableCell>
              </TableRow>
            ) : (
              leaves.map((leave) => (
                <TableRow key={leave.id} className="border-b border-slate-200/50 hover:bg-slate-100/30">
                  <TableCell>
                    <div className="flex items-center font-medium text-slate-900">
                      <User className="w-4 h-4 mr-2 text-slate-500" />
                      {leave.staff.user.name || "Unknown"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-slate-600 border-slate-300">
                      {leave.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {format(new Date(leave.startDate), "MMM d")} - {format(new Date(leave.endDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={leave.status} />
                  </TableCell>
                  <TableCell>
                    {isAdmin && leave.status === "PENDING" && (
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={isPending}
                          onClick={() => startTransition(() => updateLeaveStatus(leave.id, "APPROVED"))}
                          className="h-8 w-8 text-slate-500 hover:text-brand-cyan hover:bg-brand-cyan/10"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={isPending}
                          onClick={() => startTransition(() => updateLeaveStatus(leave.id, "REJECTED"))}
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
