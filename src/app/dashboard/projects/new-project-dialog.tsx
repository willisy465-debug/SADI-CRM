"use client"

import { useState } from "react"
import { createProject } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Briefcase, Plus } from "lucide-react"

export function NewProjectDialog({ users, currentUser }: { users: any[], currentUser: any }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await createProject({
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        leadId: formData.get("leadId") as string
      })
      setOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-brand-navy hover:bg-brand-cyan text-white font-medium">
        <Plus className="w-4 h-4 mr-2" /> New Project
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-200 text-slate-900 font-sans">
        <DialogHeader>
          <DialogTitle className="flex items-center text-brand-cyan">
            <Briefcase className="w-5 h-5 mr-2" />
            Create New Project
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700">Project Name</Label>
            <Input id="name" name="name" required className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" placeholder="e.g. Q3 Marketing Campaign" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700">Description</Label>
            <Textarea id="description" name="description" className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan resize-none h-20" placeholder="Optional details about the project..." />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="leadId" className="text-slate-700">Project Lead</Label>
            <select 
              id="leadId" 
              name="leadId" 
              defaultValue={currentUser.id}
              className="flex h-9 w-full items-center justify-between rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-cyan"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} {u.id === currentUser.id ? "(You)" : ""}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="hover:bg-slate-100 text-slate-700">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-brand-navy hover:bg-brand-cyan text-white">
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  )
}
