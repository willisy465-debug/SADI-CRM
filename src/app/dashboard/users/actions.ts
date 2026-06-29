"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function createUser(formData: FormData) {
  const session = await auth()
  
  // Ensure only ADMIN or SUPER_ADMIN can create users
  if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    throw new Error("Unauthorized")
  }

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const role = formData.get("role") as string
  
  // Create user
  await prisma.user.create({
    data: {
      name,
      email,
      role,
      password: "password123" // Default password
    }
  })

  revalidatePath("/dashboard/users")
}

export async function deleteUser(userId: string) {
  const session = await auth()
  
  if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    throw new Error("Unauthorized")
  }

  // Prevent self-deletion
  if (userId === session.user.id) {
    throw new Error("Cannot delete yourself")
  }

  await prisma.user.delete({
    where: { id: userId }
  })

  revalidatePath("/dashboard/users")
}
