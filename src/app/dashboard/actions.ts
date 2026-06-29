"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import bcrypt from "bcryptjs"

export async function changePassword(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!newPassword || newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters long")
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match")
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      password: hashedPassword,
      forcePasswordChange: false
    }
  })

  return { success: true }
}
