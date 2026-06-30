"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

// Haversine formula to calculate distance between two coordinates in meters
function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

async function validateLocation(lat: number, lng: number) {
  const offices = await prisma.officeLocation.findMany()
  
  for (const office of offices) {
    const distance = getDistanceInMeters(lat, lng, office.latitude, office.longitude)
    if (distance <= office.radiusMeters) {
      return office // Found a valid office within range
    }
  }
  
  return null // No office within range
}

export async function checkIn(lat: number, lng: number) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const staff = await prisma.staffProfile.findUnique({
    where: { userId: session.user.id }
  })
  
  if (!staff) {
    throw new Error("Staff profile not found. You must be registered as staff to check in.")
  }

  const office = await validateLocation(lat, lng)
  if (!office) {
    throw new Error("Geofence Error: You must be within company premises to check in.")
  }

  // Normalize date to midnight
  const now = new Date()
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const existingRecord = await prisma.attendanceRecord.findUnique({
    where: {
      staffId_date: {
        staffId: staff.id,
        date: date
      }
    }
  })

  if (existingRecord) {
    throw new Error("You have already checked in today.")
  }

  await prisma.attendanceRecord.create({
    data: {
      staffId: staff.id,
      date,
      checkInTime: now,
      checkInLat: lat,
      checkInLng: lng,
      locationId: office.id,
      status: "PRESENT" // Can be expanded to check if after 09:00 for "LATE"
    }
  })

  revalidatePath("/dashboard/hr")
}

export async function checkOut(lat: number, lng: number) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const staff = await prisma.staffProfile.findUnique({
    where: { userId: session.user.id }
  })
  
  if (!staff) throw new Error("Staff profile not found.")

  const office = await validateLocation(lat, lng)
  if (!office) {
    throw new Error("Geofence Error: You must be within company premises to check out.")
  }

  const now = new Date()
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const record = await prisma.attendanceRecord.findUnique({
    where: {
      staffId_date: {
        staffId: staff.id,
        date: date
      }
    }
  })

  if (!record) {
    throw new Error("No check-in record found for today.")
  }
  if (record.checkOutTime) {
    throw new Error("You have already checked out today.")
  }

  // Calculate overtime
  // Total milliseconds worked
  const durationMs = now.getTime() - record.checkInTime.getTime()
  const hoursWorked = durationMs / (1000 * 60 * 60)
  
  // Standard shift is 9 hours
  const standardHours = 9.0
  const overtimeHours = hoursWorked > standardHours ? (hoursWorked - standardHours) : 0

  await prisma.attendanceRecord.update({
    where: { id: record.id },
    data: {
      checkOutTime: now,
      checkOutLat: lat,
      checkOutLng: lng,
      overtimeHours: Math.max(0, overtimeHours)
    }
  })

  revalidatePath("/dashboard/hr")
}
