"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function createStaffProfile(userId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized")

  const department = formData.get("department") as string
  const jobTitle = formData.get("jobTitle") as string
  const baseSalaryStr = formData.get("baseSalary") as string
  const baseSalary = baseSalaryStr ? parseFloat(baseSalaryStr) : null

  await prisma.staffProfile.create({
    data: {
      userId,
      department,
      jobTitle,
      baseSalary,
      joinDate: new Date()
    }
  })

  revalidatePath("/dashboard/hr")
}

export async function applyForLeave(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const staffProfile = await prisma.staffProfile.findUnique({
    where: { userId: session.user.id }
  })

  if (!staffProfile) throw new Error("Staff profile not found")

  const type = formData.get("type") as string
  const reason = formData.get("reason") as string
  const startDateStr = formData.get("startDate") as string
  const endDateStr = formData.get("endDate") as string

  await prisma.leaveApplication.create({
    data: {
      staffId: staffProfile.id,
      type,
      reason,
      startDate: new Date(startDateStr),
      endDate: new Date(endDateStr),
    }
  })

  revalidatePath("/dashboard/hr")
}

export async function updateLeaveStatus(leaveId: string, status: "APPROVED" | "REJECTED") {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized")

  const leave = await prisma.leaveApplication.findUnique({
    where: { id: leaveId },
    include: { staff: true }
  })

  if (!leave) throw new Error("Leave not found")

  // If approving, calculate days and deduct from balance
  if (status === "APPROVED" && leave.status !== "APPROVED") {
    // Simple duration calc (doesn't exclude weekends for this MVP)
    const diffTime = Math.abs(leave.endDate.getTime() - leave.startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    await prisma.staffProfile.update({
      where: { id: leave.staff.id },
      data: { leaveBalances: Math.max(0, leave.staff.leaveBalances - diffDays) }
    })
  }

  await prisma.leaveApplication.update({
    where: { id: leaveId },
    data: { status }
  })

  revalidatePath("/dashboard/hr")
}
