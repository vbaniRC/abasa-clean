import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { requireRole } from "@/lib/middleware/role";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  // AUTH
  await requireAuth(req as any, NextResponse);

  // ROLE → samo superadmin
  await requireRole(req as any, NextResponse, ["superadmin"]);

  // Dohvati sve klubove
  const { data: clubs, error } = await supabase
    .from("clubs")
    .select("*");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "Clubs fetched successfully",
    clubs,
  });
}
