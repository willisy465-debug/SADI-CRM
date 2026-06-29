"use client"

import { useState } from "react"
import { applyForLeave } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from "lucide-react"

export function NewLeaveDialog({ hasProfile }: { hasProfile: boolean }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    
    try {
      await applyForLeave(formData)
      setOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!hasProfile) {
    return (
      <Button disabled className="bg-slate-100 text-slate-500 cursor-not-allowed">
        Staff Profile Required
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-brand-navy hover:bg-brand-cyan text-white" />}>
        <Plus className="w-4 h-4 mr-2" /> Apply for Leave
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-200 text-slate-900">
        <DialogHeader>
          <DialogTitle>Leave Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-slate-700">Leave Type</Label>
            <Select name="type" defaultValue="ANNUAL">
              <SelectTrigger className="bg-slate-100 border-slate-300 text-slate-900 focus:ring-brand-cyan">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-100 border-slate-300 text-slate-900">
                <SelectItem value="ANNUAL">Annual Leave</SelectItem>
                <SelectItem value="SICK">Sick Leave</SelectItem>
                <SelectItem value="MATERNITY">Maternity/Paternity</SelectItem>
                <SelectItem value="UNPAID">Unpaid Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-slate-700">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" required className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan [color-scheme:dark]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-slate-700">End Date</Label>
              <Input id="endDate" name="endDate" type="date" required className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan [color-scheme:dark]" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-slate-700">Reason / Notes</Label>
            <Textarea 
              id="reason" 
              name="reason" 
              className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan min-h-[80px]" 
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="hover:bg-slate-100 text-slate-700">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-brand-navy hover:bg-brand-cyan text-white">
              {loading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              Submit Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
