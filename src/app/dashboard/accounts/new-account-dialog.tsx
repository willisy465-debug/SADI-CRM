"use client"

import { useState } from "react"
import { createAccount } from "./actions"
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

export function NewAccountDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    
    try {
      await createAccount(formData)
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
        <Plus className="w-4 h-4 mr-2" /> New Account
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-200 text-slate-900">
        <DialogHeader>
          <DialogTitle>Add New Account</DialogTitle>
          <DialogDescription className="text-slate-600">
            Create a new client institution in the CRM.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700">Account Name</Label>
            <Input id="name" name="name" required className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" placeholder="Ministry of Health" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry" className="text-slate-700">Industry</Label>
            <Input id="industry" name="industry" className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" placeholder="Public Sector" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website" className="text-slate-700">Website</Label>
            <Input id="website" name="website" type="url" className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" placeholder="https://" />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="hover:bg-slate-100 text-slate-700">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-brand-navy hover:bg-brand-cyan text-white">
              {loading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              Save Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
