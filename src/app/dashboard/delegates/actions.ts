"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createDelegateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  dietaryReqs: z.string().optional(),
  dateOfBirth: z.string().optional(),
  emergencyContact: z.string().optional(),
  programmeId: z.string().min(1, "Programme selection is required"),
});

export async function createDelegate(formData: FormData) {
  try {
    const rawData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      jobTitle: formData.get("jobTitle") as string,
      dietaryReqs: formData.get("dietaryReqs") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      emergencyContact: formData.get("emergencyContact") as string,
      programmeId: formData.get("programmeId") as string,
    };

    const validatedData = createDelegateSchema.parse(rawData);

    await prisma.delegate.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone || null,
        company: validatedData.company || null,
        jobTitle: validatedData.jobTitle || null,
        dietaryReqs: validatedData.dietaryReqs || null,
        dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
        emergencyContact: validatedData.emergencyContact || null,
        programmeId: validatedData.programmeId,
      },
    });

    revalidatePath("/dashboard/delegates");
    revalidatePath(`/dashboard/programmes/${validatedData.programmeId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to create delegate:", error);
    return { success: false, error: "Failed to create delegate" };
  }
}
