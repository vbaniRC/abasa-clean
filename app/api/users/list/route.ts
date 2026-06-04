import { NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  // AUTH
  await requireAuth(req as any, NextResponse);

  // ROLE → owner, admin, superadmin
  await requireRole(req as any, NextResponse, [
    "owner",
    "admin",
    "superadmin",
  ]);

  const { data: users, error } = await supabase
    .from("users")
    .select("*");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "Users fetched successfully",
    users,
  });
}
