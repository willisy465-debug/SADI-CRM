"use client"

import { useState } from "react"
import { generateDealProposal } from "./actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2, Download } from "lucide-react"

export function ProposalDialog({ dealId }: { dealId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [proposal, setProposal] = useState("")

  async function handleGenerate() {
    setOpen(true)
    setLoading(true)
    try {
      const content = await generateDealProposal(dealId)
      setProposal(content)
    } catch (error) {
      console.error(error)
      setProposal("Failed to generate proposal.")
    } finally {
      setLoading(false)
    }
  }

  // Very basic function to download the markdown as a text file for now
  function handleDownload() {
    const blob = new Blob([proposal], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Proposal-${dealId}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <button 
        onClick={handleGenerate}
        className="w-full text-left px-2 py-1.5 text-sm text-fuchsia-400 focus:bg-fuchsia-500/10 focus:text-fuchsia-400 cursor-pointer flex items-center hover:bg-fuchsia-500/10 rounded-sm"
      >
        <Sparkles className="w-4 h-4 mr-2" /> AI Proposal
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px] bg-white border-slate-200 text-slate-900 flex flex-col h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-fuchsia-400">
              <Sparkles className="w-5 h-5 mr-2" />
              AI Generated Proposal
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col mt-4">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>Generating proposal with Gemini AI...</p>
              </div>
            ) : (
              <>
                <Textarea 
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  className="flex-1 bg-slate-50 border-slate-200 font-mono text-sm p-4 resize-none focus-visible:ring-fuchsia-500"
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="ghost" onClick={() => setOpen(false)} className="hover:bg-slate-100">
                    Close
                  </Button>
                  <Button onClick={handleDownload} className="bg-fuchsia-600 hover:bg-fuchsia-500 text-slate-900">
                    <Download className="w-4 h-4 mr-2" /> Download Markdown
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
