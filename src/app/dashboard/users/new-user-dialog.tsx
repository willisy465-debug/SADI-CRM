"use client"

import { useState } from "react"
import { createUser } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ShieldAlert, UserPlus } from "lucide-react"

export function NewUserDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await createUser(formData)
      setOpen(false)
    } catch (error) {
      console.error(error)
      alert("Failed to create user.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-brand-navy hover:bg-brand-cyan text-white font-medium">
        <UserPlus className="w-4 h-4 mr-2" /> Add Staff User
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white border-slate-200 text-slate-900 font-sans">
          <DialogHeader>
            <DialogTitle className="flex items-center text-brand-cyan">
              <UserPlus className="w-5 h-5 mr-2" />
              Create New User
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4 mt-4">
            <div className="bg-brand-cyan/10 border border-brand-cyan/20 rounded-md p-3 mb-4 flex items-start">
              <ShieldAlert className="w-4 h-4 text-brand-cyan mr-2 mt-0.5 shrink-0" />
              <p className="text-xs text-emerald-200">
                New users are created with the default password: <strong>password123</strong>. They should change it upon their first login.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">Full Name</Label>
              <Input id="name" name="name" required className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" placeholder="e.g. Jane Doe" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Email Address</Label>
              <Input id="email" name="email" type="email" required className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" placeholder="jane@sadi.co.za" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-slate-700">System Role</Label>
              <select 
                id="role" 
                name="role" 
                className="flex h-9 w-full items-center justify-between rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-cyan"
              >
                <option value="USER">User (Standard Access)</option>
                <option value="SALES">Sales (Deals & Leads)</option>
                <option value="MANAGER">Manager (Oversight)</option>
                <option value="ADMIN">Administrator (Full Access)</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="hover:bg-slate-100 text-slate-700">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-brand-navy hover:bg-brand-cyan text-white">
                {loading ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
