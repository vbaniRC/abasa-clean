// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/club/update/route.ts)

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
    "owner",
    "superadmin",
  ]);
  if (roleResult instanceof NextResponse) return roleResult;

  const user: any = (req as any).user;
  const body = await req.json();

  const { club_id, name, sport, currency } = body;

  if (!club_id) {
    return NextResponse.json(
      { success: false, error: "Missing club_id" },
      { status: 400 }
    );
  }

  // SUPERADMIN → može uređivati bilo koji klub
  if (user.role !== "superadmin") {
    // ADMIN/OWNER → mogu uređivati samo svoj klub
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("club_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    if (profile.club_id !== club_id) {
      return NextResponse.json(
        { success: false, error: "You cannot modify another club" },
        { status: 403 }
      );
    }
  }

  // UPDATE DATA
  const updateData: any = {};
  if (name) updateData.name = name;
  if (sport) updateData.sport = sport;
  if (currency) updateData.currency = currency;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { success: false, error: "No fields provided for update" },
      { status: 400 }
    );
  }

  // UPDATE CLUB
  const { data, error } = await supabase
    .from("clubs")
    .update(updateData)
    .eq("id", club_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: 200 }
  );
}
