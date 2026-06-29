"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function updateProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const name = formData.get("name") as string
  const email = formData.get("email") as string

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, email }
  })

  revalidatePath("/dashboard/settings")
  // Note: changing email might require re-login depending on NextAuth config
}
