// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/users/create/route.ts)

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";

export async function POST(req: Request) {
  // AUTH
  const authResult = await requireAuth(req as any, NextResponse);
  if (authResult instanceof NextResponse) return authResult;

  // ROLE → owner, admin, superadmin
  const roleResult = await requireRole(req as any, NextResponse, [
    "owner",
    "admin",
    "superadmin",
  ]);
  if (roleResult instanceof NextResponse) return roleResult;

  const creator: any = (req as any).user;
  const body = await req.json();

  const { email, password, role, name, club_id } = body;

  if (!email || !password || !role || !name) {
    return NextResponse.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  // SUPERADMIN → može kreirati usera u bilo kojem klubu
  // OWNER/ADMIN → mogu kreirati usera samo u svom klubu
  let finalClubId = club_id;

  if (creator.role !== "superadmin") {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("club_id")
      .eq("id", creator.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    finalClubId = profile.club_id;
  }

  // 1) Kreiraj auth usera
  const { data: authUser, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError || !authUser?.user) {
    return NextResponse.json(
      { success: false, error: authError?.message || "Auth error" },
      { status: 500 }
    );
  }

  const newUserId = authUser.user.id;

  // 2) Kreiraj profil
  const { error: profileInsertError } = await supabase.from("profiles").insert({
    id: newUserId,
    email,
    role,
    name,
    club_id: finalClubId,
    is_owner: role === "owner",
  });

  if (profileInsertError) {
    // rollback auth user
    await supabase.auth.admin.deleteUser(newUserId);

    return NextResponse.json(
      { success: false, error: profileInsertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "User created successfully",
      user_id: newUserId,
    },
    { status: 200 }
  );
}
