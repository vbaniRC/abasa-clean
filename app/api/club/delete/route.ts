import { NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { clubId } = body;

  // AUTH
  await requireAuth(req as any, NextResponse);

  // ROLE → samo superadmin
  await requireRole(req as any, NextResponse, ["superadmin"]);

  // Obriši klub
  const { error } = await supabase
    .from("clubs")
    .delete()
    .eq("id", clubId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "Club deleted successfully",
    clubId,
  });
}
