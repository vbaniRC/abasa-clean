import { NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  // AUTH
  await requireAuth(req as any, NextResponse);

  // ROLE → admin, owner, coach, parent, member, superadmin
  await requireRole(req as any, NextResponse, [
    "admin",
    "owner",
    "coach",
    "parent",
    "member",
    "superadmin",
  ]);

  const user: any = (req as any).user;

  // Dohvati sve članove kluba kojem user pripada
  const { data: members, error } = await supabase
    .from("users")
    .select("*")
    .eq("club_id", user?.club_id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "Members fetched successfully",
    members,
  });
}
