// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/club/logo-upload/route.ts)

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";

export async function POST(req: Request) {
  // AUTH
  const authResult = await requireAuth(req as any, NextResponse);
  if (authResult instanceof NextResponse) return authResult;

  // ROLE → admin, owner, superadmin
  const roleResult = await requireRole(req as any, NextResponse, [
    "admin",
    "owner",
    "superadmin",
  ]);
  if (roleResult instanceof NextResponse) return roleResult;

  const user: any = (req as any).user;

  // PARSE FORM DATA
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const club_id = formData.get("club_id") as string;

  if (!file || !club_id) {
    return NextResponse.json(
      { success: false, error: "Missing file or club_id" },
      { status: 400 }
    );
  }

  // ADMIN/OWNER → mogu uploadati samo za svoj klub
  if (user.role !== "superadmin") {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("club_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    if (profile.club_id !== club_id) {
      return NextResponse.json(
        { success: false, error: "You cannot upload logo for another club" },
        { status: 403 }
      );
    }
  }

  // GENERATE FILE PATH
  const fileExt = file.name.split(".").pop();
  const filePath = `${club_id}/logo.${fileExt}`;

  // UPLOAD TO STORAGE
  const { error: uploadError } = await supabase.storage
    .from("club-logos")
    .upload(filePath, file, {
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json(
      { success: false, error: uploadError.message },
      { status: 500 }
    );
  }

  // GET PUBLIC URL
  const { data: publicUrlData } = supabase.storage
    .from("club-logos")
    .getPublicUrl(filePath);

  const publicUrl = publicUrlData.publicUrl;

  // UPDATE CLUB RECORD
  const { error: updateError } = await supabase
    .from("clubs")
    .update({ logo_url: publicUrl })
    .eq("id", club_id);

  if (updateError) {
    return NextResponse.json(
      { success: false, error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      logo_url: publicUrl,
    },
    { status: 200 }
  );
}
