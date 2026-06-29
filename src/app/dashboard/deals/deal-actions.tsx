"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
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
import { convertToProgramme, createInvoice } from "./actions"
import { ProposalDialog } from "./proposal-dialog"

export function DealActions({ dealId, hasProgramme }: { dealId: string, hasProgramme: boolean }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100" disabled={isPending} />}>
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4 text-slate-600" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border-slate-200 text-slate-700">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem className="focus:bg-slate-100 focus:text-slate-900 cursor-pointer">View details</DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-slate-100 focus:text-slate-900 cursor-pointer">Edit stage</DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-100" />
        
        {!hasProgramme ? (
          <DropdownMenuItem 
            onClick={() => startTransition(async () => {
              const programmeId = await convertToProgramme(dealId)
              router.push(`/dashboard/programmes/${programmeId}`)
            })}
            className="text-brand-cyan focus:bg-brand-cyan/10 focus:text-brand-cyan cursor-pointer"
          >
            {isPending ? "Creating..." : "Create Programme"}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="text-slate-500 focus:bg-slate-100 focus:text-slate-500 cursor-not-allowed">
            Programme Created
          </DropdownMenuItem>
        )}

        <ProposalDialog dealId={dealId} />

        <DropdownMenuItem 
          onClick={() => startTransition(async () => {
            await createInvoice(dealId)
          })}
          className="text-blue-400 focus:bg-blue-500/10 focus:text-blue-400 cursor-pointer"
        >
          {isPending ? "Generating..." : "Generate Invoice"}
        </DropdownMenuItem>
        
        <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer">Delete deal</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
