"use client"

import { useTransition } from "react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { convertLead } from "./actions"
import { EmailDialog } from "./email-dialog"

export function LeadActions({ leadId, leadName }: { leadId: string, leadName: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100" disabled={isPending} />}>
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4 text-slate-600" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border-slate-200 text-slate-700">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem className="focus:bg-slate-100 focus:text-slate-900 cursor-pointer">View details</DropdownMenuItem>
        
        <EmailDialog leadId={leadId} leadName={leadName} />

        <DropdownMenuSeparator className="bg-slate-100" />
        <DropdownMenuItem 
          onClick={() => startTransition(() => convertLead(leadId))}
          className="text-brand-cyan focus:bg-brand-cyan/10 focus:text-brand-cyan cursor-pointer"
        >
          {isPending ? "Converting..." : "Convert to Account"}
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer">Delete lead</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
