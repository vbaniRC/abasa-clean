import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { requireRole } from "@/lib/middleware/role";

import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  // AUTH
  await requireAuth(req as any, NextResponse);

  const user: any = (req as any).user;
  const body = await req.json();

  const { name, phone, address } = body;

  const { error } = await supabase
    .from("users")
    .update({
      name,
      phone,
      address,
    })
    .eq("auth_id", user.auth_id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "Profile updated successfully",
  });
}
