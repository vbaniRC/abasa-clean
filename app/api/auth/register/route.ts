// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/auth/register/route.ts)

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, role, club_id } = body;

  if (!email || !password || !role) {
    return NextResponse.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Ako se kreira owner → samo superadmin smije
  if (role === "owner") {
    const authResult = await requireAuth(req as any, NextResponse);
    if (authResult instanceof NextResponse) return authResult;

    const roleResult = await requireRole(req as any, NextResponse, ["superadmin"]);
    if (roleResult instanceof NextResponse) return roleResult;

    if (!club_id) {
      return NextResponse.json(
        { success: false, error: "Missing club_id for owner creation" },
        { status: 400 }
      );
    }
  }

  // 1) Kreiraj usera u Supabase Auth
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authUser?.user) {
    return NextResponse.json(
      { success: false, error: authError?.message || "Failed to create user" },
      { status: 500 }
    );
  }

  const newUserId = authUser.user.id;

  // 2) Kreiraj profil
  const { error: profileError } = await supabase.from("profiles").insert({
    id: newUserId,
    email,
    role,
    is_owner: role === "owner",
    club_id: club_id || null,
  });

  if (profileError) {
    return NextResponse.json(
      { success: false, error: profileError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: {
        id: newUserId,
        email,
        role,
        club_id: club_id || null,
      },
    },
    { status: 200 }
  );
}
