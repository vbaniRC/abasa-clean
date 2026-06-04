import { NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const authResult = await requireAuth(req as any, NextResponse);
  if (authResult instanceof NextResponse) return authResult;

  const user: any = (req as any).user;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return NextResponse.json(
      { success: false, error: "Profile not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { success: true, data: profile },
    { status: 200 }
  );
}
