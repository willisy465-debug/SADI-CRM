"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function createDeal(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const name = formData.get("name") as string
  const amountStr = formData.get("amount") as string
  const accountId = formData.get("accountId") as string
  const stage = formData.get("stage") as string

  const deal = await prisma.deal.create({
    data: {
      name,
      amount: amountStr ? parseFloat(amountStr) : null,
      stage: stage || "PROSPECTING",
      accountId: accountId || null,
      ownerId: session.user.id,
    }
  })

  revalidatePath("/dashboard/deals")
  return deal
}

export async function convertToProgramme(dealId: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
  })

  if (!deal) throw new Error("Deal not found")

  const programme = await prisma.programme.create({
    data: {
      title: deal.name,
      description: "Auto-generated from Deal",
      startDate: new Date(), // Default to today
      endDate: new Date(new Date().setDate(new Date().getDate() + 3)), // Default 3 days later
      type: "IN_PERSON",
      status: "DRAFT",
      dealId: deal.id,
    }
  })

  await prisma.deal.update({
    where: { id: deal.id },
    data: { stage: "WON" }
  })

  revalidatePath("/dashboard/deals")
  revalidatePath("/dashboard/programmes")

  revalidatePath("/dashboard/programmes")

  return programme.id
}

export async function createInvoice(dealId: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: { programme: true }
  })

  if (!deal) throw new Error("Deal not found")

  const invoiceNo = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 30) // Net 30

  await prisma.invoice.create({
    data: {
      invoiceNo,
      amount: deal.amount || 0,
      dueDate,
      dealId: deal.id,
      programmeId: deal.programme?.id,
      status: "DRAFT"
    }
  })

  revalidatePath("/dashboard/finance")
  revalidatePath("/dashboard/deals")
}

export async function generateDealProposal(dealId: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: { account: true, owner: true }
  })

  if (!deal) throw new Error("Deal not found")

  const { generateText } = await import("@/lib/ai")

  const systemInstruction = "You are a senior sales executive at the Southern Africa Development Institute (SADI). Your goal is to write a highly professional, persuasive, and structured training proposal. Use Markdown formatting. Include an Executive Summary, Proposed Modules, and Investment section."
  
  const prompt = `
Please generate a bespoke training proposal based on the following Deal context:
- Deal Name: ${deal.name}
- Client Account: ${deal.account?.name || 'Valued Client'}
- Deal Value: ZAR ${deal.amount || 'TBD'}
- Deal Stage: ${deal.stage}

The proposal should be addressed to the client, highlight SADI's expertise in capacity development, and outline a robust training approach.
  `.trim()

  const proposalContent = await generateText(prompt, systemInstruction)

  return proposalContent
}


