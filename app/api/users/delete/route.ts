// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/users/delete/route.ts)

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

  const requester: any = (req as any).user;
  const body = await req.json();

  const { user_id } = body;

  if (!user_id) {
    return NextResponse.json(
      { success: false, error: "Missing user_id" },
      { status: 400 }
    );
  }

  // DOHVATI PROFIL USERA KOJI SE BRIŠE
  const { data: targetProfile, error: targetError } = await supabase
    .from("profiles")
    .select("club_id, role")
    .eq("id", user_id)
    .single();

  if (targetError || !targetProfile) {
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 }
    );
  }

  // PERMISSION LOGIKA
  if (requester.role !== "superadmin") {
    // OWNER/ADMIN → mogu brisati samo svoj klub
    const { data: requesterProfile } = await supabase
      .from("profiles")
      .select("club_id, role")
      .eq("id", requester.id)
      .single();

    if (requesterProfile.club_id !== targetProfile.club_id) {
      return NextResponse.json(
        { success: false, error: "You cannot delete users from another club" },
        { status: 403 }
      );
    }

    // ADMIN ne može brisati ownera ili admina
    if (requester.role === "admin") {
      if (targetProfile.role === "owner" || targetProfile.role === "admin") {
        return NextResponse.json(
          { success: false, error: "Admins cannot delete owners or admins" },
          { status: 403 }
        );
      }
    }
  }

  // 1) OBRIŠI PROFIL
  const { error: profileDeleteError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", user_id);

  if (profileDeleteError) {
    return NextResponse.json(
      { success: false, error: profileDeleteError.message },
      { status: 500 }
    );
  }

  // 2) OBRIŠI AUTH USERA
  const { error: authDeleteError } = await supabase.auth.admin.deleteUser(
    user_id
  );

  if (authDeleteError) {
    return NextResponse.json(
      { success: false, error: authDeleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "User deleted successfully",
    },
    { status: 200 }
  );
}
