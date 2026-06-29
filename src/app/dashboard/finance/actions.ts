"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function addExpense(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const description = formData.get("description") as string
  const amountStr = formData.get("amount") as string
  const amount = parseFloat(amountStr)
  const category = formData.get("category") as string
  const startDateStr = formData.get("startDate") as string
  const endDateStr = formData.get("endDate") as string

  // Mock receipt URL for dev purposes
  const receiptUrl = `/receipts/mock-${Date.now()}.png`

  await prisma.expense.create({
    data: {
      description,
      amount,
      category,
      startDate: new Date(startDateStr),
      endDate: new Date(endDateStr),
      receiptUrl,
      submittedBy: session.user.id
    }
  })

  revalidatePath("/dashboard/finance")
}

export async function updateExpenseStatus(expenseId: string, status: "APPROVED" | "REJECTED") {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  await prisma.expense.update({
    where: { id: expenseId },
    data: { status }
  })

  revalidatePath("/dashboard/finance")
}
