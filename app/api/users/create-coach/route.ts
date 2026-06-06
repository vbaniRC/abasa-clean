import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { requireRole } from "@/lib/middleware/role";

import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, clubId } = body;

  // AUTH
  await requireAuth(req as any, NextResponse);

  // ROLE → admin, owner, superadmin
  await requireRole(req as any, NextResponse, [
    "admin",
    "owner",
    "superadmin",
  ]);

  // Kreiraj coach usera u Supabase
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
    role: "coach",
    club_id: clubId,
  });

  return NextResponse.json({
    message: "Coach user created successfully",
    user: user.user,
  });
}
