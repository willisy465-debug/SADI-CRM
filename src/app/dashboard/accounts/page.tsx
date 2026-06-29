import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NewAccountDialog } from "./new-account-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Globe, Building2 } from "lucide-react"

export default async function AccountsPage() {
  const session = await auth()

  const accounts = await prisma.account.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { contacts: true, deals: true }
      }
    }
  })

  return (
    <div className="p-8 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Accounts</h1>
          <p className="text-slate-600 mt-1 text-sm">Manage client institutions and organizations.</p>
        </div>
        <NewAccountDialog />
      </div>

      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-white border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-slate-600">Account Name</TableHead>
              <TableHead className="text-slate-600">Industry</TableHead>
              <TableHead className="text-slate-600 text-center">Contacts</TableHead>
              <TableHead className="text-slate-600 text-center">Deals</TableHead>
              <TableHead className="text-slate-600 text-right">Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                  No accounts found. Create a new account to get started.
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => (
                <TableRow key={account.id} className="border-b border-slate-200/50 hover:bg-slate-100/30 transition-colors">
                  <TableCell className="font-medium text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center border border-slate-300">
                      <Building2 className="w-4 h-4 text-slate-600" />
                    </div>
                    {account.name}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {account.industry || "-"}
                  </TableCell>
                  <TableCell className="text-center text-slate-600">
                    <span className="bg-slate-100 px-2 py-1 rounded-md text-xs font-medium">{account._count.contacts}</span>
                  </TableCell>
                  <TableCell className="text-center text-slate-600">
                    <span className="bg-slate-100 px-2 py-1 rounded-md text-xs font-medium">{account._count.deals}</span>
                  </TableCell>
                  <TableCell className="text-right text-slate-600 text-sm">
                    {formatDistanceToNow(new Date(account.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100" />}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4 text-slate-600" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-slate-200 text-slate-700">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="focus:bg-slate-100 focus:text-slate-900 cursor-pointer">View account</DropdownMenuItem>
                        {account.website && (
                          <DropdownMenuItem className="focus:bg-slate-100 focus:text-slate-900 cursor-pointer">
                            <Globe className="w-4 h-4 mr-2" /> Visit website
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-brand-cyan focus:bg-brand-cyan/10 focus:text-brand-cyan cursor-pointer">Add deal</DropdownMenuItem>
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
