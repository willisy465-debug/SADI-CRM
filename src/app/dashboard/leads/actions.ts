"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function createLead(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const company = formData.get("company") as string
  const source = formData.get("source") as string

  const lead = await prisma.lead.create({
    data: {
      firstName,
      lastName,
      email,
      phone: phone || null,
      company: company || null,
      source: source || null,
      ownerId: session.user.id,
      status: "NEW",
    }
  })

  revalidatePath("/dashboard/leads")
  return lead
}

export async function updateLeadStatus(leadId: string, status: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.lead.update({
    where: { id: leadId },
    data: { status }
  })

  revalidatePath("/dashboard/leads")
}

export async function convertLead(leadId: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const lead = await prisma.lead.findUnique({ where: { id: leadId } })
  if (!lead) throw new Error("Lead not found")

  // Create Account
  const accountName = lead.company || `${lead.firstName} ${lead.lastName}`
  const account = await prisma.account.create({
    data: {
      name: accountName,
      ownerId: session.user.id,
    }
  })

  // Create Contact
  await prisma.contact.create({
    data: {
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      accountId: account.id,
    }
  })

  // Mark Lead as QUALIFIED
  await prisma.lead.update({
    where: { id: leadId },
    data: { status: "QUALIFIED" }
  })

  revalidatePath("/dashboard/leads")
  revalidatePath("/dashboard/accounts")
  revalidatePath("/dashboard/contacts")
}

export async function generateLeadEmail(leadId: string, objective: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const lead = await prisma.lead.findUnique({ where: { id: leadId } })
  if (!lead) throw new Error("Lead not found")

  const { generateText } = await import("@/lib/ai")

  const systemInstruction = "You are a professional sales representative at SADI (Southern Africa Development Institute). Your goal is to draft a concise, persuasive, and professional email to a lead based on a specific objective."
  
  const prompt = `
Please draft an email based on the following context:
- Lead Name: ${lead.firstName} ${lead.lastName}
- Lead Company: ${lead.company || 'Unknown'}
- Source: ${lead.source || 'Organic'}
- Objective: ${objective}

Keep the tone professional, welcoming, and focused on capacity development and training solutions. Don't include subject line formatting like "Subject:", just output the subject followed by the body.
  `.trim()

  const emailContent = await generateText(prompt, systemInstruction)

  return emailContent
}
