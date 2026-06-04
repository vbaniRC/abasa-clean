// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/users/update-role/route.ts)

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";

export async function POST(req: Request) {
  // AUTH
  const authResult = await requireAuth(req as any, NextResponse);
  if (authResult instanceof NextResponse) return authResult;

  // ROLE → admin, owner, superadmin
  const roleResult = await requireRole(req as any, NextResponse, [
    "admin",
    "superadmin",
  ]);
  if (roleResult instanceof NextResponse) return roleResult;

  const user: any = (req as any).user;
  const body = await req.json();

  const { user_id, new_role } = body;

  if (!user_id || !new_role) {
    return NextResponse.json(
      { success: false, error: "Missing user_id or new_role" },
      { status: 400 }
    );
  }

  // DOHVATI PROFIL KORISNIKA KOJI SE MIJENJA
  const { data: targetProfile, error: targetError } = await supabase
    .from("profiles")
    .select("id, role, club_id")
    .eq("id", user_id)
    .single();

  if (targetError || !targetProfile) {
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 }
    );
  }

  // SUPERADMIN → može sve
  if (user.role !== "superadmin") {
    // ADMIN/OWNER → mogu mijenjati samo korisnike iz svog kluba
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("club_id, role, is_owner")
      .eq("id", user.id)
      .single();

    if (adminProfile.club_id !== targetProfile.club_id) {
      return NextResponse.json(
        { success: false, error: "Cannot modify users from another club" },
        { status: 403 }
      );
    }

    // ADMIN → ne može mijenjati admine, ownere, superadmina
    if (user.role === "admin") {
      if (
        targetProfile.role === "admin" ||
        targetProfile.role === "owner" ||
        targetProfile.role === "superadmin"
      ) {
        return NextResponse.json(
          { success: false, error: "Admin cannot modify this user" },
          { status: 403 }
        );
      }
    }

    // OWNER → ne može mijenjati superadmina
    if (user.role === "owner" && targetProfile.role === "superadmin") {
      return NextResponse.json(
        { success: false, error: "Owner cannot modify superadmin" },
        { status: 403 }
      );
    }
  }

  // UPDATE ROLE
  const { data, error } = await supabase
    .from("profiles")
    .update({ role: new_role })
    .eq("id", user_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, data },
    { status: 200 }
  );
}
