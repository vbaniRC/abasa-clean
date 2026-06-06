import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { requireRole } from "@/lib/middleware/role";

import { supabase } from "@/lib/supabase";

export async function POST() {
  await supabase.auth.signOut();

  return NextResponse.json(
    { success: true, message: "Logged out" },
    { status: 200 }
  );
}
