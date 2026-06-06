import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { requireRole } from "@/lib/middleware/role";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, description } = body;

  // AUTH
  await requireAuth(req as any, NextResponse);

  // ROLE → samo superadmin
  await requireRole(req as any, NextResponse, ["superadmin"]);

  // Kreiraj klub
  const { data, error } = await supabase
    .from("clubs")
    .insert({
      name,
      description,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "Club created successfully",
    club: data,
  });
}
