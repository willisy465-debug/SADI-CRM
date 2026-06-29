"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createProgramme } from "./actions"
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

export function NewProgrammeDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    
    try {
      const programme = await createProgramme(formData)
      setOpen(false)
      router.push(`/dashboard/programmes/${programme.id}`)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-brand-navy hover:bg-brand-cyan text-white" />}>
        <Plus className="w-4 h-4 mr-2" /> New Programme
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-200 text-slate-900">
        <DialogHeader>
          <DialogTitle>Add New Programme</DialogTitle>
          <DialogDescription className="text-slate-600">
            Create a standalone training delivery schedule.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-700">Programme Title</Label>
            <Input id="title" name="title" required className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" placeholder="e.g. Advanced Public Finance" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type" className="text-slate-700">Delivery Type</Label>
            <Select name="type" defaultValue="IN_PERSON">
              <SelectTrigger className="bg-slate-100 border-slate-300 text-slate-900 focus:ring-brand-cyan">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-100 border-slate-300 text-slate-900">
                <SelectItem value="IN_PERSON">In Person</SelectItem>
                <SelectItem value="VIRTUAL">Virtual / Online</SelectItem>
                <SelectItem value="HYBRID">Hybrid</SelectItem>
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
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="hover:bg-slate-100 text-slate-700">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-brand-navy hover:bg-brand-cyan text-white">
              {loading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              Save & Open
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
