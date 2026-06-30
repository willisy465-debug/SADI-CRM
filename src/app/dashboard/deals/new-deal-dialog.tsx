"use client"

import { useState } from "react"
import { createDeal } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"

export function NewDealDialog({ accounts }: { accounts: { id: string, name: string }[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [accountId, setAccountId] = useState("")
  const [stage, setStage] = useState("PROSPECTING")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    
    try {
      await createDeal(formData)
      setOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-brand-navy hover:bg-brand-cyan text-white" />}>
        <Plus className="w-4 h-4 mr-2" /> New Deal
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-200 text-slate-900">
        <DialogHeader>
          <DialogTitle>Add New Deal</DialogTitle>
          <DialogDescription className="text-slate-600">
            Create a new revenue opportunity.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700">Deal Name</Label>
            <Input id="name" name="name" required className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" placeholder="Leadership Training Q3" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-slate-700">Expected Amount (ZAR)</Label>
            <Input id="amount" name="amount" type="number" step="0.01" className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" placeholder="50000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountId" className="text-slate-700">Associated Account</Label>
            <input type="hidden" name="accountId" value={accountId} />
            <Select required value={accountId} onValueChange={setAccountId}>
              <SelectTrigger className="bg-slate-100 border-slate-300 text-slate-900 focus:ring-brand-cyan">
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent className="bg-slate-100 border-slate-300 text-slate-900">
                {accounts.map(acc => (
                  <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stage" className="text-slate-700">Pipeline Stage</Label>
            <input type="hidden" name="stage" value={stage} />
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger className="bg-slate-100 border-slate-300 text-slate-900 focus:ring-brand-cyan">
                <SelectValue placeholder="Select a stage" />
              </SelectTrigger>
              <SelectContent className="bg-slate-100 border-slate-300 text-slate-900">
                <SelectItem value="PROSPECTING">Prospecting</SelectItem>
                <SelectItem value="QUALIFICATION">Qualification</SelectItem>
                <SelectItem value="PROPOSAL">Proposal Sent</SelectItem>
                <SelectItem value="WON">Closed Won</SelectItem>
                <SelectItem value="LOST">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expectedCloseDate" className="text-slate-700">Expected Close Date</Label>
            <Input id="expectedCloseDate" name="expectedCloseDate" type="date" required className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="hover:bg-slate-100 text-slate-700">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-brand-navy hover:bg-brand-cyan text-white">
              {loading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              Save Deal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
