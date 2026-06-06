import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { requireRole } from "@/lib/middleware/role";


export async function GET(req: Request) {
  // AUTH → bilo koji logirani user može vidjeti role
  await requireAuth(req as any, NextResponse);

  const roles = [
    "superadmin",
    "owner",
    "admin",
    "coach",
    "parent",
    "member",
  ];

  return NextResponse.json({
    message: "Roles fetched successfully",
    roles,
  });
}
