"use client"

import { useState } from "react"
import { uploadDocument } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UploadCloud, FileUp } from "lucide-react"

export function UploadDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await uploadDocument(formData)
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
        <UploadCloud className="w-4 h-4 mr-2" /> Upload File
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-200 text-slate-900 font-sans">
        <DialogHeader>
          <DialogTitle className="flex items-center text-brand-cyan">
            <FileUp className="w-5 h-5 mr-2" />
            Upload Document
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700">Document Name</Label>
            <Input id="name" name="name" required className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" placeholder="e.g. SADI Blank Proposal Template" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-slate-700">Category</Label>
            <select 
              id="category" 
              name="category" 
              className="flex h-9 w-full items-center justify-between rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-cyan"
            >
              <option value="GENERAL">General</option>
              <option value="TEMPLATE">Template</option>
              <option value="CONTRACT">Contract</option>
              <option value="TRAINING_MATERIAL">Training Material</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file" className="text-slate-700">File</Label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-100/50">
              <UploadCloud className="w-8 h-8 text-slate-500 mb-2" />
              <p className="text-sm text-slate-600 text-center">Drag and drop or click to select</p>
              <input type="file" id="file" name="file" className="hidden" />
              <Button type="button" variant="outline" className="mt-4 border-zinc-600 text-slate-700" onClick={() => document.getElementById('file')?.click()}>
                Select File
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="hover:bg-slate-100 text-slate-700">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-brand-navy hover:bg-brand-cyan text-white">
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  )
}
