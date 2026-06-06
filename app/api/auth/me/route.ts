import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  // Placeholder auth – samo pozivamo funkciju, ne provjeravamo ništa
  await requireAuth(req as any, NextResponse);

  // Placeholder user – u pravom authu bi ovo dolazilo iz middleware-a
  const user = (req as any).user || null;

  return NextResponse.json({
    message: "Authenticated",
    user,
  });
}
