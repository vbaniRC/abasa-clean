// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/club/my/route.ts)

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";

export async function GET(req: Request) {
  // AUTH
  const authResult = await requireAuth(req as any, NextResponse);
  if (authResult instanceof NextResponse) return authResult;

  // ROLE → bilo tko tko pripada klubu
  const roleResult = await requireRole(req as any, NextResponse, [
    "admin",
    "coach",
    "parent",
    "member",
  ]);
  if (roleResult instanceof NextResponse) return roleResult;

  const user: any = (req as any).user;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("club_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.club_id) {
    return NextResponse.json(
      { success: false, error: "User has no club assigned" },
      { status: 404 }
    );
  }

  const { data: club, error: clubError } = await supabase
    .from("clubs")
    .select("*")
    .eq("id", profile.club_id)
    .single();

  if (clubError || !club) {
    return NextResponse.json(
      { success: false, error: "Club not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: club }, { status: 200 });
}
