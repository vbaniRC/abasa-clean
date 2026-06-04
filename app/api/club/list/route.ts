// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/club/list/route.ts)

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";

export async function GET(req: Request) {
  // AUTH
  const authResult = await requireAuth(req as any, NextResponse);
  if (authResult instanceof NextResponse) return authResult;

  // ROLE → samo superadmin
  const roleResult = await requireRole(req as any, NextResponse, ["superadmin"]);
  if (roleResult instanceof NextResponse) return roleResult;

  // DOHVATI SVE KLUBOVE
  const { data: clubs, error } = await supabase
    .from("clubs")
    .select("id, name, sport, currency, logo_url, created_at");

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: clubs,
    },
    { status: 200 }
  );
}
