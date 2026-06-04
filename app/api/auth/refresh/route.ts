// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/auth/refresh/route.ts)

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { refresh_token } = body;

  if (!refresh_token) {
    return NextResponse.json(
      { success: false, error: "Missing refresh_token" },
      { status: 400 }
    );
  }

  // 1) REFRESH SESSION
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token,
  });

  if (error || !data?.session) {
    return NextResponse.json(
      { success: false, error: "Failed to refresh session" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      session: data.session,
    },
    { status: 200 }
  );
}
