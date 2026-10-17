import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSession,
  hashPassword,
  hasAdminSession,
  saveAdminPasswordHash,
} from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const form = await request.formData();
  const password = typeof form.get("password") === "string" ? String(form.get("password")) : "";
  const confirmation =
    typeof form.get("confirmation") === "string" ? String(form.get("confirmation")) : "";
  if (password.length < 12 || password.length > 200 || password !== confirmation) {
    return NextResponse.redirect(new URL("/admin/change-password?error=1", request.url), 303);
  }

  await saveAdminPasswordHash(hashPassword(password));

  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  response.cookies.set(ADMIN_COOKIE, createAdminSession(), adminCookieOptions);
  return response;
}
