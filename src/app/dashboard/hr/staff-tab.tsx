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
import { UserCircle, Briefcase, Mail } from "lucide-react"

type StaffProfile = {
  id: string
  department: string | null
  jobTitle: string | null
  joinDate: Date | null
  leaveBalances: number
  user: {
    name: string | null
    email: string
  }
}

export function StaffTab({ staff }: { staff: StaffProfile[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Staff Directory</h3>
          <p className="text-sm text-slate-600">View and manage internal SADI team members.</p>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl bg-white/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-white border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-slate-600">Employee</TableHead>
              <TableHead className="text-slate-600">Department</TableHead>
              <TableHead className="text-slate-600">Job Title</TableHead>
              <TableHead className="text-slate-600">Join Date</TableHead>
              <TableHead className="text-slate-600 text-center">Leave Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                  No staff profiles found.
                </TableCell>
              </TableRow>
            ) : (
              staff.map((profile) => (
                <TableRow key={profile.id} className="border-b border-slate-200/50 hover:bg-slate-100/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-300">
                        <UserCircle className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{profile.user.name || "Unknown"}</p>
                        <p className="text-xs text-slate-500 flex items-center mt-0.5">
                          <Mail className="w-3 h-3 mr-1" /> {profile.user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {profile.department ? (
                      <Badge variant="outline" className="text-slate-600 border-slate-300 bg-slate-100/50">
                        {profile.department}
                      </Badge>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    <div className="flex items-center">
                      <Briefcase className="w-3 h-3 mr-2 text-slate-500" />
                      {profile.jobTitle || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {profile.joinDate ? format(new Date(profile.joinDate), "MMM d, yyyy") : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium text-brand-cyan bg-brand-cyan/10 px-2.5 py-1 rounded-md">
                      {profile.leaveBalances} days
                    </span>
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
