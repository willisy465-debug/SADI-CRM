"use client"

import { useState, useTransition } from "react"
import { addFacilitatorAssignment, removeFacilitatorAssignment } from "./actions"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Loader2, Star } from "lucide-react"

type FacilitatorAssignment = {
  id: string
  role: string
  agreedRate: number | null
  facilitator: {
    id: string
    name: string
    email: string
  }
}

export function FacilitatorsTab({ programmeId, assignments }: { programmeId: string, assignments: FacilitatorAssignment[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    try {
      await addFacilitatorAssignment(programmeId, formData)
      setOpen(false)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 rounded-xl border border-slate-200 bg-white/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Facilitator Allocation</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button size="sm" className="bg-brand-navy hover:bg-brand-cyan text-white" />}>
            <Plus className="w-4 h-4 mr-2" /> Assign Facilitator
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white border-slate-200 text-slate-900">
            <DialogHeader>
              <DialogTitle>Assign Facilitator</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                <Input id="name" name="name" required className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                <Input id="email" name="email" type="email" required className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-slate-700">Role</Label>
                  <Select name="role" defaultValue="LEAD">
                    <SelectTrigger className="bg-slate-100 border-slate-300 text-slate-900 focus:ring-brand-cyan">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-100 border-slate-300 text-slate-900">
                      <SelectItem value="LEAD">Lead Facilitator</SelectItem>
                      <SelectItem value="CO_FACILITATOR">Co-Facilitator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agreedRate" className="text-slate-700">Agreed Rate (Optional)</Label>
                  <Input id="agreedRate" name="agreedRate" type="number" step="0.01" className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="hover:bg-slate-100 text-slate-700">Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-brand-navy hover:bg-brand-cyan text-white">
                  {loading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />} Assign
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
        <Table>
          <TableHeader className="bg-white border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-slate-600">Facilitator</TableHead>
              <TableHead className="text-slate-600">Role</TableHead>
              <TableHead className="text-slate-600 text-right">Agreed Rate</TableHead>
              <TableHead className="text-slate-600 w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  No facilitators assigned.
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((assignment) => (
                <TableRow key={assignment.id} className="border-b border-slate-200/50 hover:bg-slate-100/30">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                        {assignment.facilitator.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{assignment.facilitator.name}</p>
                        <p className="text-xs text-slate-500">{assignment.facilitator.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {assignment.role === "LEAD" ? (
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        <Star className="w-3 h-3 mr-1" /> Lead
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-slate-600 border-slate-300">Co-Facilitator</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-slate-700">
                    {assignment.agreedRate ? `$${assignment.agreedRate.toFixed(2)}` : "-"}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      disabled={isPending}
                      onClick={() => startTransition(() => removeFacilitatorAssignment(assignment.id, programmeId))}
                      className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
