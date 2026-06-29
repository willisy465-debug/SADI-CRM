import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NewContactDialog } from "./new-contact-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import { ContactActions } from "./contact-actions"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Mail, Phone, Building2 } from "lucide-react"

export default async function ContactsPage() {
  const session = await auth()
  
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      account: {
        select: { name: true }
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contacts</h1>
          <p className="text-slate-600 mt-1 text-sm">Directory of individuals associated with client accounts.</p>
        </div>
        <NewContactDialog accounts={accounts} />
      </div>

      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-white border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-slate-600">Name</TableHead>
              <TableHead className="text-slate-600">Account</TableHead>
              <TableHead className="text-slate-600">Email</TableHead>
              <TableHead className="text-slate-600">Phone</TableHead>
              <TableHead className="text-slate-600 text-right">Added</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                  No contacts found. Create a new contact to get started.
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.id} className="border-b border-slate-200/50 hover:bg-slate-100/30 transition-colors">
                  <TableCell className="font-medium text-slate-900">
                    {contact.firstName} {contact.lastName}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {contact.account ? (
                      <span className="flex items-center text-sm">
                        <Building2 className="w-3 h-3 mr-2 text-slate-500" />
                        {contact.account.name}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {contact.email ? (
                      <a href={`mailto:${contact.email}`} className="flex items-center hover:text-slate-900 transition-colors">
                        <Mail className="w-3 h-3 mr-2" /> {contact.email}
                      </a>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {contact.phone ? (
                      <span className="flex items-center">
                        <Phone className="w-3 h-3 mr-2" /> {contact.phone}
                      </span>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-right text-slate-600 text-sm">
                    {formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <ContactActions contactId={contact.id} contactName={`${contact.firstName} ${contact.lastName}`} />
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
