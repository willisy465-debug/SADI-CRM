"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function createAccount(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const name = formData.get("name") as string
  const industry = formData.get("industry") as string
  const website = formData.get("website") as string

  const account = await prisma.account.create({
    data: {
      name,
      industry: industry || null,
      website: website || null,
      ownerId: session.user.id,
    }
  })

  revalidatePath("/dashboard/accounts")
  return account
}
