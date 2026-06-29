"use client"

import { useState } from "react"
import { createContact } from "./actions"
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

export function NewContactDialog({ accounts }: { accounts: { id: string, name: string }[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    
    try {
      await createContact(formData)
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
        <Plus className="w-4 h-4 mr-2" /> New Contact
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-200 text-slate-900">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogDescription className="text-slate-600">
            Add a contact person for a client account.
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
            <Input id="email" name="email" type="email" className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-700">Phone</Label>
            <Input id="phone" name="phone" type="tel" className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountId" className="text-slate-700">Associated Account</Label>
            <Select name="accountId">
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
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="hover:bg-slate-100 text-slate-700">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-brand-navy hover:bg-brand-cyan text-white">
              {loading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              Save Contact
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
