"use client"

import { useState } from "react"
import { addExpense } from "./actions"
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
import { Plus, Loader2, Upload } from "lucide-react"

export function NewExpenseDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    
    try {
      await addExpense(formData)
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
        <Plus className="w-4 h-4 mr-2" /> Log Expense
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-200 text-slate-900">
        <DialogHeader>
          <DialogTitle>Log New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700">Description</Label>
            <Input id="description" name="description" required className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" placeholder="e.g. Flights to Cape Town" />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-slate-700">Amount (ZAR)</Label>
              <Input id="amount" name="amount" type="number" step="0.01" required className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" />
            </div>
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
            <Label htmlFor="category" className="text-slate-700">Category</Label>
            <Select name="category" defaultValue="TRAVEL">
              <SelectTrigger className="bg-slate-100 border-slate-300 text-slate-900 focus:ring-brand-cyan">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-100 border-slate-300 text-slate-900">
                <SelectItem value="TRAVEL">Travel & Transport</SelectItem>
                <SelectItem value="CATERING">Catering & Meals</SelectItem>
                <SelectItem value="SOFTWARE">Software & IT</SelectItem>
                <SelectItem value="OFFICE">Office Supplies</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700">Receipt Image</Label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-100/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-600">Click to upload receipt (Mockup)</p>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="hover:bg-slate-100 text-slate-700">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-brand-navy hover:bg-brand-cyan text-white">
              {loading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              Submit Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
