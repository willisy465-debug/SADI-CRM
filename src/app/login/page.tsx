import { LoginForm } from "./login-form"
import { Shield } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col justify-center items-center relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-navy/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md px-8 py-10 bg-white/80 backdrop-blur-xl border border-zinc-200 rounded-2xl shadow-2xl z-10">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="SADI Logo" className="h-16 mb-6 object-contain" />
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">SADI CRM</h1>
          <p className="text-slate-500 text-sm mt-1 text-center">
            Sign in to access the Capacity Development Management System
          </p>
        </div>

        <LoginForm />
        
        <div className="mt-8 text-center text-xs text-slate-600">
          <p>Southern Africa Development Institute</p>
          <p className="mt-1">Secure Internal Portal</p>
        </div>
      </div>
    </div>
  )
}
