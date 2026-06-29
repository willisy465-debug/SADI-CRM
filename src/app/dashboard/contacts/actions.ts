"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function createContact(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const accountId = formData.get("accountId") as string

  const contact = await prisma.contact.create({
    data: {
      firstName,
      lastName,
      email: email || null,
      phone: phone || null,
      accountId: accountId || null,
    }
  })

  revalidatePath("/dashboard/contacts")
  return contact
}

export async function generateContactEmail(contactId: string, objective: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    include: { account: true }
  })
  if (!contact) throw new Error("Contact not found")

  const { generateText } = await import("@/lib/ai")

  const systemInstruction = "You are an Account Manager at SADI (Southern Africa Development Institute). Your goal is to draft a concise, persuasive, and professional email to an existing contact or client based on a specific objective."
  
  const prompt = `
Please draft an email based on the following context:
- Contact Name: ${contact.firstName} ${contact.lastName}
- Account (Company): ${contact.account?.name || 'Unknown'}
- Objective: ${objective}

Keep the tone professional, relationship-oriented, and focused on providing value through SADI's capacity development and training solutions. Don't include "Subject:" explicitly, just the subject on the first line followed by the body.
  `.trim()

  const emailContent = await generateText(prompt, systemInstruction)

  return emailContent
}
