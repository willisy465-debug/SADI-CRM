"use client"

import { useState } from "react"
import { generateContactEmail } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2, Copy, Check } from "lucide-react"

export function EmailDialog({ contactId, contactName }: { contactId: string, contactName: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [objective, setObjective] = useState("")
  const [emailContent, setEmailContent] = useState("")
  const [copied, setCopied] = useState(false)

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!objective.trim()) return

    setLoading(true)
    try {
      const content = await generateContactEmail(contactId, objective)
      setEmailContent(content)
      setCopied(false)
    } catch (error) {
      console.error(error)
      setEmailContent("Failed to generate email.")
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(emailContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="w-full text-left px-2 py-1.5 text-sm text-fuchsia-400 focus:bg-fuchsia-500/10 focus:text-fuchsia-400 cursor-pointer flex items-center hover:bg-fuchsia-500/10 rounded-sm"
      >
        <Sparkles className="w-4 h-4 mr-2" /> Draft Email
      </button>

      <Dialog open={open} onOpenChange={(val) => {
        setOpen(val)
        if (!val) {
          setEmailContent("")
          setObjective("")
        }
      }}>
        <DialogContent className="sm:max-w-[600px] bg-white border-slate-200 text-slate-900">
          <DialogHeader>
            <DialogTitle className="flex items-center text-fuchsia-400">
              <Sparkles className="w-5 h-5 mr-2" />
              AI Email Drafter
            </DialogTitle>
          </DialogHeader>
          
          {!emailContent ? (
            <form onSubmit={handleGenerate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-700">What is the objective of your email to {contactName}?</label>
                <Input 
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="e.g. Check in on their team's training needs for next quarter."
                  className="bg-slate-50 border-slate-200 focus-visible:ring-fuchsia-500"
                  autoFocus
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={loading || !objective.trim()} className="bg-fuchsia-600 hover:bg-fuchsia-500 text-slate-900">
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  Generate Draft
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col mt-4 space-y-4">
              <Textarea 
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="min-h-[300px] bg-slate-50 border-slate-200 font-sans text-sm p-4 focus-visible:ring-fuchsia-500"
              />
              <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={() => setEmailContent("")} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                  Start Over
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setOpen(false)} className="border-slate-300 bg-white text-slate-700 hover:bg-slate-100">
                    Cancel
                  </Button>
                  <Button onClick={handleCopy} className="bg-fuchsia-600 hover:bg-fuchsia-500 text-slate-900">
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy to Clipboard"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
