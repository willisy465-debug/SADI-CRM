import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateMobileRequest } from "@/lib/mobile-auth";

function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
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

export async function POST(req: Request) {
  try {
    const { user, error } = await authenticateMobileRequest(req);
    if (error) return error;

    const { latitude, longitude } = await req.json();

    if (!latitude || !longitude) {
      return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
    }

    const staff = await prisma.staffProfile.findUnique({
      where: { userId: user!.id }
    });

    if (!staff) {
      return NextResponse.json({ error: "Staff profile required" }, { status: 403 });
    }

    // Geofence Validation
    const offices = await prisma.officeLocation.findMany();
    let validOffice = null;

    for (const office of offices) {
      const distance = getDistanceInMeters(latitude, longitude, office.latitude, office.longitude);
      if (distance <= office.radiusMeters) {
        validOffice = office;
        break;
      }
    }

    if (!validOffice) {
      return NextResponse.json({ error: "Geofence Error: You must be within company premises." }, { status: 403 });
    }

    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const existingRecord = await prisma.attendanceRecord.findUnique({
      where: {
        staffId_date: {
          staffId: staff.id,
          date: date
        }
      }
    });

    if (!existingRecord) {
      return NextResponse.json({ error: "No check-in record found for today" }, { status: 400 });
    }

    if (existingRecord.checkOutTime) {
      return NextResponse.json({ error: "Already checked out today" }, { status: 400 });
    }

    const durationMs = now.getTime() - existingRecord.checkInTime.getTime();
    const hoursWorked = durationMs / (1000 * 60 * 60);
    const standardHours = 9.0;
    const overtimeHours = hoursWorked > standardHours ? (hoursWorked - standardHours) : 0;

    const record = await prisma.attendanceRecord.update({
      where: { id: existingRecord.id },
      data: {
        checkOutTime: now,
        checkOutLat: latitude,
        checkOutLng: longitude,
        overtimeHours: Math.max(0, overtimeHours)
      }
    });

    return NextResponse.json({ success: true, record });

  } catch (err) {
    console.error("Mobile Check-Out Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
