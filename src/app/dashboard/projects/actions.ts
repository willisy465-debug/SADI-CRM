"use server"



import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        lead: {
          select: { name: true, email: true }
        },
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return projects
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return []
  }
}

export async function createProject(data: { name: string; description?: string; leadId: string }) {
  try {
    const newProject = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        leadId: data.leadId,
        status: "ACTIVE"
      }
    })
    
    revalidatePath("/dashboard/projects")
    return { success: true, project: newProject }
  } catch (error) {
    console.error("Failed to create project:", error)
    return { success: false, error: "Failed to create project" }
  }
}

export async function updateProjectStatus(id: string, status: string) {
  try {
    await prisma.project.update({
      where: { id },
      data: { status }
    })
    revalidatePath("/dashboard/projects")
    return { success: true }
  } catch (error) {
    console.error("Failed to update project status:", error)
    return { success: false, error: "Failed to update project status" }
  }
}
