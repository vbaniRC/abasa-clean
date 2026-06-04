import { NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { clubId, name, description } = body;

  // AUTH
  await requireAuth(req as any, NextResponse);

  // ROLE → admin, owner, superadmin
  await requireRole(req as any, NextResponse, [
    "admin",
    "owner",
    "superadmin",
  ]);

  // Update kluba
  const { error } = await supabase
    .from("clubs")
    .update({
      name,
      description,
    })
    .eq("id", clubId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "Club updated successfully",
    clubId,
  });
}
