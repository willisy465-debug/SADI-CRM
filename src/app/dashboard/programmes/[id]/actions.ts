"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function addDelegate(programmeId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const jobTitle = formData.get("jobTitle") as string
  const dietaryReqs = formData.get("dietaryReqs") as string

  await prisma.delegate.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      jobTitle,
      dietaryReqs,
      programmeId
    }
  })

  revalidatePath(`/dashboard/programmes/${programmeId}`)
}

export async function toggleAttendance(delegateId: string, programmeId: string, currentStatus: boolean) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.delegate.update({
    where: { id: delegateId },
    data: { attendance: !currentStatus }
  })

  revalidatePath(`/dashboard/programmes/${programmeId}`)
}

export async function removeDelegate(delegateId: string, programmeId: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.delegate.delete({
    where: { id: delegateId }
  })

  revalidatePath(`/dashboard/programmes/${programmeId}`)
}

export async function addFacilitatorAssignment(programmeId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const email = formData.get("email") as string
  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const rateStr = formData.get("agreedRate") as string
  const agreedRate = rateStr ? parseFloat(rateStr) : null

  const facilitator = await prisma.facilitator.upsert({
    where: { email },
    update: { name },
    create: { email, name }
  })

  await prisma.facilitatorAssignment.create({
    data: {
      programmeId,
      facilitatorId: facilitator.id,
      role,
      agreedRate
    }
  })

  revalidatePath(`/dashboard/programmes/${programmeId}`)
}

export async function removeFacilitatorAssignment(assignmentId: string, programmeId: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.facilitatorAssignment.delete({
    where: { id: assignmentId }
  })

  revalidatePath(`/dashboard/programmes/${programmeId}`)
}

export async function updateLogistics(programmeId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const venueName = formData.get("venueName") as string
  const venueAddress = formData.get("venueAddress") as string
  const cateringNotes = formData.get("cateringNotes") as string
  const equipmentReqs = formData.get("equipmentReqs") as string

  await prisma.logistics.upsert({
    where: { programmeId },
    update: { venueName, venueAddress, cateringNotes, equipmentReqs },
    create: { programmeId, venueName, venueAddress, cateringNotes, equipmentReqs }
  })

  revalidatePath(`/dashboard/programmes/${programmeId}`)
}
