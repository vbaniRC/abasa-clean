import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { requireRole } from "@/lib/middleware/role";

import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  // AUTH
  await requireAuth(req as any, NextResponse);

  // ROLE → owner, admin, superadmin
  await requireRole(req as any, NextResponse, [
    "owner",
    "admin",
    "superadmin",
  ]);

  const body = await req.json();
  const { userId, name, email, phone, address } = body;

  const { error } = await supabase
    .from("users")
    .update({
      name,
      email,
      phone,
      address,
    })
    .eq("auth_id", userId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "User updated successfully",
    userId,
  });
}
