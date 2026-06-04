import { NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  // AUTH
  await requireAuth(req as any, NextResponse);

  // ROLE → admin, owner, superadmin
  await requireRole(req as any, NextResponse, [
    "admin",
    "owner",
    "superadmin",
  ]);

  const body = await req.json();
  const { userId, newRole } = body;

  const { error } = await supabase
    .from("users")
    .update({ role: newRole })
    .eq("auth_id", userId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "User role updated successfully",
    userId,
    newRole,
  });
}
