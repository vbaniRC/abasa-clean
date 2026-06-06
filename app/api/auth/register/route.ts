import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { requireRole } from "@/lib/middleware/role";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, role } = body;

  // Ako je role = owner → treba auth + role check
  if (role === "owner") {
    await requireAuth(req as any, NextResponse);
    await requireRole(req as any, NextResponse, ["superadmin"]);
  }

  // Kreiraj usera u Supabase
  const { data: user, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  // Spremi u users tablicu
  await supabase.from("users").insert({
    auth_id: user.user?.id,
    email,
    role,
  });

  return NextResponse.json({
    message: "User registered successfully",
    user: user.user,
  });
}
