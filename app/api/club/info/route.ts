// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/club/info/route.ts)

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/middleware/auth";

export async function GET(req: Request) {
  // AUTH → bilo koji logirani user može vidjeti info o svom klubu
  const authResult = await requireAuth(req as any, NextResponse);
  if (authResult instanceof NextResponse) return authResult;

  const user: any = (req as any).user;

  // DOHVATI PROFIL
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("club_id, role, is_owner")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      { success: false, error: "Profile not found" },
      { status: 404 }
    );
  }

  if (!profile.club_id) {
    return NextResponse.json(
      { success: false, error: "User is not assigned to any club" },
      { status: 400 }
    );
  }

  // DOHVATI KLUB
  const { data: club, error: clubError } = await supabase
    .from("clubs")
    .select("id, name, sport, currency, logo_url, created_at")
    .eq("id", profile.club_id)
    .single();

  if (clubError || !club) {
    return NextResponse.json(
      { success: false, error: "Club not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: {
        ...club,
        user_role: profile.role,
        is_owner: profile.is_owner,
      },
    },
    { status: 200 }
  );
}
