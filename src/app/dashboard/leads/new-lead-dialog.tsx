"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createLead } from "./actions"
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
import { Plus, Loader2 } from "lucide-react"

export function NewLeadDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    
    try {
      await createLead(formData)
      setOpen(false)
    } catch (error) {
      console.error(error)
      // Basic error handling
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-brand-navy hover:bg-brand-cyan text-white" />}>
        <Plus className="w-4 h-4 mr-2" /> New Lead
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-200 text-slate-900">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription className="text-slate-600">
            Enter the details of the prospective client here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-slate-700">First Name</Label>
              <Input id="firstName" name="firstName" required className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-slate-700">Last Name</Label>
              <Input id="lastName" name="lastName" required className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700">Email</Label>
            <Input id="email" name="email" type="email" required className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-700">Phone</Label>
            <Input id="phone" name="phone" type="tel" className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company" className="text-slate-700">Company</Label>
            <Input id="company" name="company" className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="hover:bg-slate-100 text-slate-700">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-brand-navy hover:bg-brand-cyan text-white">
              {loading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              Save Lead
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
