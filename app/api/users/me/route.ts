import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { requireRole } from "@/lib/middleware/role";


export async function GET(req: Request) {
  // AUTH
  await requireAuth(req as any, NextResponse);

  const user: any = (req as any).user;

  if (!user) {
    return NextResponse.json(
      { error: "User not found in request context" },
      { status: 400 }
    );
  }

  // Dohvati usera iz baze
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", user.auth_id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "User fetched successfully",
    user: data,
  });
}
