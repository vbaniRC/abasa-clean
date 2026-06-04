import { NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, role, clubId } = body;

  // AUTH
  await requireAuth(req as any, NextResponse);

  // ROLE → owner, admin, superadmin
  await requireRole(req as any, NextResponse, [
    "owner",
    "admin",
    "superadmin",
  ]);

  // Kreiraj usera u Supabase
  const { data: user, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  // Spremi u users tablicu
  await supabase.from("users").insert({
    auth_id: user.user?.id,
    email,
    role,
    club_id: clubId,
  });

  return NextResponse.json({
    message: "User created successfully",
    user: user.user,
  });
}
