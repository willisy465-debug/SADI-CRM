"use client"

import { useState } from "react"
import { updateLogistics } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save } from "lucide-react"

type Logistics = {
  venueName: string | null
  venueAddress: string | null
  cateringNotes: string | null
  equipmentReqs: string | null
}

export function LogisticsTab({ programmeId, logistics }: { programmeId: string, logistics: Logistics | null }) {
  const [loading, setLoading] = useState(false)

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    try {
      await updateLogistics(programmeId, formData)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 rounded-xl border border-slate-200 bg-white/50 max-w-2xl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Venue & Logistics Tracking</h3>
        <p className="text-sm text-slate-600">Manage the physical requirements for this programme.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="venueName" className="text-slate-700">Venue Name</Label>
            <Input 
              id="venueName" 
              name="venueName" 
              defaultValue={logistics?.venueName || ""} 
              className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan" 
              placeholder="e.g. Radisson Blu Sandton"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="venueAddress" className="text-slate-700">Venue Address</Label>
            <Textarea 
              id="venueAddress" 
              name="venueAddress" 
              defaultValue={logistics?.venueAddress || ""} 
              className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan min-h-[80px]" 
              placeholder="Full physical address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cateringNotes" className="text-slate-700">Catering Requirements</Label>
            <Textarea 
              id="cateringNotes" 
              name="cateringNotes" 
              defaultValue={logistics?.cateringNotes || ""} 
              className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan min-h-[80px]" 
              placeholder="e.g. 2x Halal, 1x Vegan. Morning tea and lunch."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipmentReqs" className="text-slate-700">Equipment Needed</Label>
            <Textarea 
              id="equipmentReqs" 
              name="equipmentReqs" 
              defaultValue={logistics?.equipmentReqs || ""} 
              className="bg-slate-100 border-slate-300 focus-visible:ring-brand-cyan min-h-[80px]" 
              placeholder="e.g. Projector, 2 whiteboards, flip charts"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200">
          <Button type="submit" disabled={loading} className="bg-brand-navy hover:bg-brand-cyan text-white">
            {loading ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <Save className="mr-2 w-4 h-4" />}
            Save Logistics
          </Button>
        </div>
      </form>
    </div>
  )
}
