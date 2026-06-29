"use client"

import { useState } from "react"
import { Shield, KeyRound, ArrowRight } from "lucide-react"
import { changePassword } from "./actions"
import { signOut } from "next-auth/react"

export function ForcePasswordChange() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError("")
    setLoading(true)
    
    try {
      await changePassword(formData)
      // Since NextAuth session doesn't auto-refresh Server components without a hard reload,
      // the safest way to unlock the dashboard is to force a sign-in refresh by reloading.
      // Wait, we can just reload the page and let layout.tsx re-fetch the session from DB!
      window.location.reload()
    } catch (err: any) {
      setError(err.message || "An error occurred")
      setLoading(false)
    }
  }

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-brand-navy rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-brand-cyan" />
          </div>
          <h2 className="text-center text-xl font-bold text-slate-900">
            Secure Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            You must change your system-generated password to continue.
          </p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700">New Password</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-4 w-4 text-slate-400" />
              </div>
              <input
                name="newPassword"
                type="password"
                required
                minLength={8}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan sm:text-sm text-slate-900 bg-white"
                placeholder="At least 8 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-4 w-4 text-slate-400" />
              </div>
              <input
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan sm:text-sm text-slate-900 bg-white"
                placeholder="Must match new password"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-1/3 flex justify-center py-2 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-cyan"
            >
              Sign Out
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-navy hover:bg-brand-navy/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-cyan disabled:opacity-50"
            >
              {loading ? "Updating..." : (
                <>Update & Continue <ArrowRight className="ml-2 w-4 h-4" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
