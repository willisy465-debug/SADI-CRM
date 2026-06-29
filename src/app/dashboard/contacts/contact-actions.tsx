"use client"

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { EmailDialog } from "./email-dialog"

export function ContactActions({ contactId, contactName }: { contactId: string, contactName: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100" />}>
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4 text-slate-600" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border-slate-200 text-slate-700">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem className="focus:bg-slate-100 focus:text-slate-900 cursor-pointer">View profile</DropdownMenuItem>
        
        <EmailDialog contactId={contactId} contactName={contactName} />

        <DropdownMenuItem className="focus:bg-slate-100 focus:text-slate-900 cursor-pointer">Edit contact</DropdownMenuItem>
        <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer">Remove contact</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
