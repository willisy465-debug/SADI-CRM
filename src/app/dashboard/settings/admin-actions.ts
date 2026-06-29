"use server"

import fs from "fs"
import path from "path"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function updateSystemConfig(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    throw new Error("Unauthorized")
  }

  const geminiKey = formData.get("geminiKey") as string
  if (!geminiKey) return

  const envPath = path.join(process.cwd(), ".env")
  let envContent = ""
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf-8")
  }

  // Remove existing GEMINI_API_KEY if present
  const lines = envContent.split("\n").filter(line => !line.startsWith("GEMINI_API_KEY="))
  
  // Add new key
  lines.push(`GEMINI_API_KEY="${geminiKey}"`)
  
  fs.writeFileSync(envPath, lines.join("\n"), "utf-8")

  revalidatePath("/dashboard/settings")
}
