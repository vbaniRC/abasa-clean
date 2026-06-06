import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { requireRole } from "@/lib/middleware/role";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  // AUTH
  await requireAuth(req as any, NextResponse);

  // ROLE → bilo tko tko pripada klubu
  await requireRole(req as any, NextResponse, [
    "admin",
    "owner",
    "coach",
    "parent",
    "member",
    "superadmin",
  ]);

  const user: any = (req as any).user;

  // Dohvati klub kojem user pripada
  const { data: club, error } = await supabase
    .from("clubs")
    .select("*")
    .eq("id", user?.club_id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "My club fetched successfully",
    club,
  });
}
