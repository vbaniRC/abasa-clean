import { NextResponse } from "next/server";

export async function requireRole(
  req: any,
  res: typeof NextResponse,
  allowedRoles?: string[]
) {
  // Placeholder role check – uvijek dopušta
  return true;
}
