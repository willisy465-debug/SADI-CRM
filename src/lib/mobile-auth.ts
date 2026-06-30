import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.AUTH_SECRET || "fallback_secret_for_development";

export interface MobileUser {
  id: string;
  email: string;
  role: string;
  name: string;
}

export async function authenticateMobileRequest(req: Request): Promise<{ user: MobileUser | null; error: NextResponse | null }> {
  const authHeader = req.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { user: null, error: NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 }) };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as MobileUser;
    
    // Optional: Verify user still exists in DB
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return { user: null, error: NextResponse.json({ error: "User no longer exists" }, { status: 401 }) };
    }

    return { user: decoded, error: null };
  } catch (error) {
    return { user: null, error: NextResponse.json({ error: "Invalid or expired token" }, { status: 401 }) };
  }
}
