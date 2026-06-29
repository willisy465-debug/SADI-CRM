"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (response?.error) {
        setError("Invalid credentials. Please try again.")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-zinc-700">Email Address</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          placeholder="name@sadi.co.za" 
          required 
          className="bg-white border-zinc-200 text-zinc-900 placeholder:text-slate-600 focus-visible:ring-brand-cyan"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-zinc-700">Password</Label>
          <a href="#" className="text-xs text-brand-navy hover:text-brand-cyan font-medium transition-colors">
            Forgot password?
          </a>
        </div>
        <Input 
          id="password" 
          name="password" 
          type="password" 
          required 
          className="bg-white border-zinc-200 text-zinc-900 placeholder:text-slate-600 focus-visible:ring-brand-cyan"
        />
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-brand-navy hover:bg-brand-cyan text-white font-medium transition-all duration-200"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  )
}
