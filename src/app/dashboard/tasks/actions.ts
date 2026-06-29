"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function createTask(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const priority = formData.get("priority") as string
  const dueDateStr = formData.get("dueDate") as string

  let dueDate = null
  if (dueDateStr) {
    dueDate = new Date(dueDateStr)
  }

  const assignedTo = (formData.get("assignedTo") as string) || session.user.id

  const projectId = formData.get("projectId") as string || null

  await prisma.task.create({
    data: {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      projectId,
      status: "TODO"
    }
  })

  revalidatePath("/dashboard/tasks")
}

export async function updateTaskStatus(taskId: string, status: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.task.update({
    where: { id: taskId },
    data: { status }
  })

  revalidatePath("/dashboard/tasks")
}
