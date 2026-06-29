import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { NewUserDialog } from "./new-user-dialog"
import { formatDistanceToNow } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Shield, User, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

function RoleBadge({ role }: { role: string }) {
  switch (role) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Administrator</Badge>
    case "MANAGER":
      return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Manager</Badge>
    case "SALES":
      return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Sales</Badge>
    default:
      return <Badge variant="outline" className="text-slate-600">User</Badge>
  }
}

export default async function UsersPage() {
  const session = await auth()
  
  if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/dashboard") // Redirect non-admins away
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-8 font-sans h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
            <Shield className="w-6 h-6 mr-3 text-red-500" /> System Users
          </h1>
          <p className="text-slate-600 mt-1 text-sm">Manage staff access, roles, and administrative privileges.</p>
        </div>
        <NewUserDialog />
      </div>

      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-white border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-slate-600">User</TableHead>
              <TableHead className="text-slate-600">Email</TableHead>
              <TableHead className="text-slate-600">Role</TableHead>
              <TableHead className="text-slate-600 text-right">Joined</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="border-b border-slate-200/50 hover:bg-slate-100/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center font-medium text-slate-900">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center mr-3 text-xs">
                        {user.name?.[0] || <User className="w-3 h-3 text-slate-500" />}
                      </div>
                      {user.name}
                      {user.id === session.user.id && (
                        <span className="ml-2 text-[10px] bg-brand-cyan/20 text-brand-cyan px-1.5 py-0.5 rounded">You</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell className="text-right text-slate-600 text-sm">
                    {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      disabled={user.id === session.user.id} 
                      className="h-8 w-8 p-0 text-slate-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
