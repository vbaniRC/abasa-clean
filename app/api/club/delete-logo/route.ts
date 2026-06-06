import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { requireRole } from "@/lib/middleware/role";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { clubId } = body;

  // AUTH
  await requireAuth(req as any, NextResponse);

  // ROLE → admin, owner, superadmin
  await requireRole(req as any, NextResponse, [
    "admin",
    "owner",
    "superadmin",
  ]);

  // Obriši logo
  const { error } = await supabase
    .from("clubs")
    .update({ logo_url: null })
    .eq("id", clubId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "Logo deleted successfully",
    clubId,
  });
}
