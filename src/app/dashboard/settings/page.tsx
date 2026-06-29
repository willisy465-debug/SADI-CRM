import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from "./actions"
import { updateSystemConfig } from "./admin-actions"
import { Sparkles, Key } from "lucide-react"

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { staffProfile: true }
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="p-8 font-sans max-w-4xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-600 mt-1 text-sm">Manage your profile and system preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium text-slate-900">Personal Information</h3>
          <p className="text-sm text-slate-500 mt-1">Update your basic profile details.</p>
        </div>
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <form action={updateProfile} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">Full Name</Label>
              <Input 
                id="name" 
                name="name" 
                defaultValue={user.name || ""} 
                required 
                className="bg-slate-50 border-slate-200 focus-visible:ring-brand-cyan max-w-md" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Email Address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email"
                defaultValue={user.email || ""} 
                required 
                className="bg-slate-50 border-slate-200 focus-visible:ring-brand-cyan max-w-md" 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700">System Role</Label>
              <Input 
                disabled 
                value={user.role} 
                className="bg-slate-100 border-slate-300 text-slate-600 max-w-md cursor-not-allowed" 
              />
              <p className="text-xs text-slate-500">Contact an administrator to change your role.</p>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" className="bg-brand-navy hover:bg-brand-cyan text-white">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>

      <hr className="my-10 border-slate-200" />

      {user.staffProfile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium text-slate-900">HR Profile</h3>
            <p className="text-sm text-slate-500 mt-1">Your internal staff details.</p>
          </div>
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-slate-600">Department</p>
                <p className="font-medium text-slate-900">{user.staffProfile.department || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-600">Job Title</p>
                <p className="font-medium text-slate-900">{user.staffProfile.jobTitle || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-600">Leave Balances</p>
                <p className="font-medium text-slate-900">{user.staffProfile.leaveBalances} Days</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
        <>
          <hr className="my-10 border-slate-200" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium text-slate-900 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-fuchsia-500" /> System Configuration
              </h3>
              <p className="text-sm text-slate-500 mt-1">Manage global API keys and integrations. Changes here affect all users.</p>
            </div>
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <form action={updateSystemConfig} className="space-y-6">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-3 mb-4">
                  <p className="text-xs text-amber-200">
                    <strong>Note:</strong> Saving a new API key writes to the local <code>.env</code> file. You may need to restart the development server (<code>npm run dev</code>) for changes to take effect.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="geminiKey" className="text-slate-700 flex items-center">
                    <Key className="w-4 h-4 mr-2 text-slate-500" /> Gemini API Key
                  </Label>
                  <Input 
                    id="geminiKey" 
                    name="geminiKey" 
                    type="password"
                    placeholder="AIzaSy..." 
                    className="bg-slate-50 border-slate-200 focus-visible:ring-fuchsia-500 max-w-md font-mono" 
                  />
                  <p className="text-xs text-slate-500">Leave blank to keep existing key. Used for AI Proposals and Emails.</p>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" className="bg-fuchsia-600 hover:bg-fuchsia-500 text-slate-900">
                    Update Configuration
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
