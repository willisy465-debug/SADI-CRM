import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateMobileRequest } from "@/lib/mobile-auth";

export async function GET(req: Request) {
  try {
    const { user, error } = await authenticateMobileRequest(req);
    if (error) return error;

    const staff = await prisma.staffProfile.findUnique({
      where: { userId: user!.id }
    });

    if (!staff) {
      return NextResponse.json({ error: "Staff profile not found" }, { status: 404 });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const record = await prisma.attendanceRecord.findUnique({
      where: {
        staffId_date: {
          staffId: staff.id,
          date: today
        }
      },
      include: {
        location: true
      }
    });

    if (!record) {
      return NextResponse.json({ 
        status: "NOT_CHECKED_IN",
        record: null 
      });
    }

    if (!record.checkOutTime) {
      return NextResponse.json({ 
        status: "CHECKED_IN",
        record 
      });
    }

    return NextResponse.json({ 
      status: "COMPLETED",
      record 
    });

  } catch (error) {
    console.error("Mobile Attendance Status Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
