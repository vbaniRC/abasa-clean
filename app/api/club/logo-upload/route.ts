import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { requireRole } from "@/lib/middleware/role";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const formData = await req.formData();
  const clubId = formData.get("clubId") as string;
  const file = formData.get("file") as File;

  // AUTH
  await requireAuth(req as any, NextResponse);

  // ROLE → admin, owner, superadmin
  await requireRole(req as any, NextResponse, [
    "admin",
    "owner",
    "superadmin",
  ]);

  if (!file) {
    return NextResponse.json(
      { error: "No file provided" },
      { status: 400 }
    );
  }

  // Upload u Supabase storage
  const filePath = `club-logos/${clubId}-${Date.now()}.png`;

  const { error: uploadError } = await supabase.storage
    .from("logos")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: uploadError.message },
      { status: 400 }
    );
  }

  const { data: publicUrlData } = supabase.storage
    .from("logos")
    .getPublicUrl(filePath);

  // Spremi URL u bazu
  const { error: updateError } = await supabase
    .from("clubs")
    .update({ logo_url: publicUrlData.publicUrl })
    .eq("id", clubId);

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "Logo uploaded successfully",
    logoUrl: publicUrlData.publicUrl,
  });
}
