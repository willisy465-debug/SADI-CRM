"use client"

import { useState, useTransition } from "react"
import { addDelegate, toggleAttendance, removeDelegate } from "./actions"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Check, X, Trash2, Loader2, FileCheck } from "lucide-react"

type Delegate = {
  id: string
  firstName: string
  lastName: string
  email: string
  jobTitle: string | null
  dietaryReqs: string | null
  attendance: boolean
  certificateUrl: string | null
}

export function DelegatesTab({ programmeId, delegates }: { programmeId: string, delegates: Delegate[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    try {
      await addDelegate(programmeId, formData)
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
        <h3 className="text-lg font-semibold text-slate-900">Delegate Management</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button size="sm" className="bg-brand-navy hover:bg-brand-cyan text-white" />}>
            <Plus className="w-4 h-4 mr-2" /> Add Delegate
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white border-slate-200 text-slate-900">
            <DialogHeader>
              <DialogTitle>Add New Delegate</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 pt-4">
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
                <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                <Input id="email" name="email" type="email" required className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-slate-700">Job Title</Label>
                <Input id="jobTitle" name="jobTitle" className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dietaryReqs" className="text-slate-700">Dietary Requirements</Label>
                <Input id="dietaryReqs" name="dietaryReqs" placeholder="e.g. Vegetarian, Halal" className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="hover:bg-slate-100 text-slate-700">Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-brand-navy hover:bg-brand-cyan text-white">
                  {loading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />} Save Delegate
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
              <TableHead className="text-slate-600">Name</TableHead>
              <TableHead className="text-slate-600">Job Title</TableHead>
              <TableHead className="text-slate-600">Dietary</TableHead>
              <TableHead className="text-slate-600 text-center">Attendance</TableHead>
              <TableHead className="text-slate-600 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {delegates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  No delegates enrolled yet.
                </TableCell>
              </TableRow>
            ) : (
              delegates.map((delegate) => (
                <TableRow key={delegate.id} className="border-b border-slate-200/50 hover:bg-slate-100/30">
                  <TableCell>
                    <p className="font-medium text-slate-900">{delegate.firstName} {delegate.lastName}</p>
                    <p className="text-xs text-slate-500">{delegate.email}</p>
                  </TableCell>
                  <TableCell className="text-slate-700">{delegate.jobTitle || "-"}</TableCell>
                  <TableCell className="text-slate-600 text-sm">
                    {delegate.dietaryReqs ? <Badge variant="outline" className="text-amber-400 border-amber-400/20">{delegate.dietaryReqs}</Badge> : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      disabled={isPending}
                      onClick={() => startTransition(() => toggleAttendance(delegate.id, programmeId, delegate.attendance))}
                      className={`h-8 w-8 p-0 rounded-full ${delegate.attendance ? 'text-brand-cyan bg-brand-cyan/10 hover:bg-brand-cyan/20 hover:text-brand-cyan' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                    >
                      {delegate.attendance ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a 
                        href={`/api/certificates/${delegate.id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => !delegate.attendance && e.preventDefault()}
                      >
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={!delegate.attendance} 
                          className="h-8 text-xs border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <FileCheck className="w-3 h-3 mr-1" /> Cert
                        </Button>
                      </a>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        disabled={isPending}
                        onClick={() => startTransition(() => removeDelegate(delegate.id, programmeId))}
                        className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
