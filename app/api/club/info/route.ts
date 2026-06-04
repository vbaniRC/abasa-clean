import { NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  // AUTH → bilo koji logirani user može vidjeti info o svom klubu
  await requireAuth(req as any, NextResponse);

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
    message: "Club info fetched successfully",
    club,
  });
}
