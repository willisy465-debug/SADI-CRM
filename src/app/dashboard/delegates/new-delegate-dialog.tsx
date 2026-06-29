"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createDelegate } from "./actions";

interface Programme {
  id: string;
  title: string;
}

interface NewDelegateDialogProps {
  programmes: Programme[];
}

export function NewDelegateDialog({ programmes }: NewDelegateDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await createDelegate(formData);
    
    setLoading(false);
    if (result.success) {
      setOpen(false);
    } else {
      alert("Failed to create delegate");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-brand-navy hover:opacity-90 text-white shadow-lg shadow-brand-navy/10" />}>
        <Plus className="w-4 h-4 mr-2" />
        Add Delegate
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white border-slate-200 text-slate-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">New Delegate</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" required className="bg-slate-100/50 border-slate-300" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" required className="bg-slate-100/50 border-slate-300" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required className="bg-slate-100/50 border-slate-300" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" className="bg-slate-100/50 border-slate-300" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" name="company" className="bg-slate-100/50 border-slate-300" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input id="jobTitle" name="jobTitle" className="bg-slate-100/50 border-slate-300" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" name="dateOfBirth" type="date" className="bg-slate-100/50 border-slate-300 [color-scheme:dark]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input id="emergencyContact" name="emergencyContact" className="bg-slate-100/50 border-slate-300" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="programmeId">Assign to Programme</Label>
            <select
              id="programmeId"
              name="programmeId"
              required
              className="w-full h-10 rounded-md border border-slate-300 bg-slate-100/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
            >
              <option value="">Select a programme</option>
              {programmes.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietaryReqs">Dietary Requirements</Label>
            <Input id="dietaryReqs" name="dietaryReqs" placeholder="e.g. Vegetarian, Halal" className="bg-slate-100/50 border-slate-300" />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="mr-2 hover:bg-slate-100 hover:text-slate-900">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-brand-navy hover:opacity-90 text-white">
              {loading ? "Creating..." : "Create Delegate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
