"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function createProgramme(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const title = formData.get("title") as string
  const type = formData.get("type") as string
  const startDateStr = formData.get("startDate") as string
  const endDateStr = formData.get("endDate") as string

  const programme = await prisma.programme.create({
    data: {
      title,
      type: type || "IN_PERSON",
      startDate: new Date(startDateStr),
      endDate: new Date(endDateStr),
      status: "DRAFT",
    }
  })

  revalidatePath("/dashboard/programmes")
  return programme
}
