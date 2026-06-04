import { NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId } = body;

  // AUTH
  await requireAuth(req as any, NextResponse);

  // ROLE → owner, admin, superadmin
  await requireRole(req as any, NextResponse, [
    "owner",
    "admin",
    "superadmin",
  ]);

  // Obriši usera iz Supabase Auth
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);

  if (authError) {
    return NextResponse.json(
      { error: authError.message },
      { status: 400 }
    );
  }

  // Obriši usera iz users tablice
  const { error: dbError } = await supabase
    .from("users")
    .delete()
    .eq("auth_id", userId);

  if (dbError) {
    return NextResponse.json(
      { error: dbError.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "User deleted successfully",
    userId,
  });
}
