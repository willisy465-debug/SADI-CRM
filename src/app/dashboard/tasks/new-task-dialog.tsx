"use client"

import { useState } from "react"
import { createTask } from "./actions"
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
import { CheckSquare, Plus } from "lucide-react"

export function NewTaskDialog({ users, currentUser, projects }: { users: any[], currentUser: any, projects: any[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await createTask(formData)
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
        <Plus className="w-4 h-4 mr-2" /> New Task
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-200 text-slate-900 font-sans">
        <DialogHeader>
          <DialogTitle className="flex items-center text-brand-cyan">
            <CheckSquare className="w-5 h-5 mr-2" />
            Add New Task
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-700">Task Title</Label>
            <Input id="title" name="title" required className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" placeholder="e.g. Call John about Q3 Training" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700">Description</Label>
            <Textarea id="description" name="description" className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan resize-none h-20" placeholder="Optional details..." />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-slate-700">Priority</Label>
              <select 
                id="priority" 
                name="priority" 
                className="flex h-9 w-full items-center justify-between rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-cyan"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo" className="text-slate-700">Assign To</Label>
              <select 
                id="assignedTo" 
                name="assignedTo" 
                defaultValue={currentUser.id}
                className="flex h-9 w-full items-center justify-between rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-cyan"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} {u.id === currentUser.id ? "(You)" : ""}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="projectId" className="text-slate-700">Project (Optional)</Label>
              <select 
                id="projectId" 
                name="projectId" 
                className="flex h-9 w-full items-center justify-between rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-cyan"
              >
                <option value="">No Project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-slate-700">Due Date</Label>
              <Input id="dueDate" name="dueDate" type="date" className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan [color-scheme:dark]" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="hover:bg-slate-100 text-slate-700">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-brand-navy hover:bg-brand-cyan text-white">
              {loading ? "Saving..." : "Save Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  )
}
