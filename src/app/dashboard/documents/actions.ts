"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function uploadDocument(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const name = formData.get("name") as string
  const category = formData.get("category") as string
  
  // In a real app, you would upload the file to S3/Supabase here
  // For this local build, we'll mock the URL
  const mockUrl = `/documents/${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`

  await prisma.document.create({
    data: {
      name,
      category,
      url: mockUrl,
      uploadedBy: session.user.id
    }
  })

  revalidatePath("/dashboard/documents")
}
