// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/users/update/route.ts)

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

  const editor: any = (req as any).user;
  const body = await req.json();

  const { user_id, name, email, role, club_id, is_owner } = body;

  if (!user_id) {
    return NextResponse.json(
      { success: false, error: "Missing user_id" },
      { status: 400 }
    );
  }

  // DOHVATI PROFIL USERA KOJI SE AŽURIRA
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
  if (editor.role !== "superadmin") {
    // OWNER/ADMIN → mogu uređivati samo svoj klub
    const { data: editorProfile } = await supabase
      .from("profiles")
      .select("club_id, role")
      .eq("id", editor.id)
      .single();

    if (editorProfile.club_id !== targetProfile.club_id) {
      return NextResponse.json(
        { success: false, error: "You cannot modify users from another club" },
        { status: 403 }
      );
    }

    // ADMIN ne može uređivati ownera ili admina
    if (editor.role === "admin") {
      if (targetProfile.role === "owner" || targetProfile.role === "admin") {
        return NextResponse.json(
          { success: false, error: "Admins cannot modify owners or admins" },
          { status: 403 }
        );
      }
    }
  }

  // PRIPREMI UPDATE DATA
  const updateData: any = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (role) updateData.role = role;

  // SUPERADMIN može mijenjati club_id i is_owner
  if (editor.role === "superadmin") {
    if (club_id) updateData.club_id = club_id;
    if (typeof is_owner === "boolean") updateData.is_owner = is_owner;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { success: false, error: "No fields provided for update" },
      { status: 400 }
    );
  }

  // UPDATE PROFILA
  const { error: updateError } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user_id);

  if (updateError) {
    return NextResponse.json(
      { success: false, error: updateError.message },
      { status: 500 }
    );
  }

  // UPDATE AUTH EMAIL (ako je promijenjen)
  if (email) {
    await supabase.auth.admin.updateUserById(user_id, {
      email,
    });
  }

  return NextResponse.json(
    {
      success: true,
      message: "User updated successfully",
    },
    { status: 200 }
  );
}
