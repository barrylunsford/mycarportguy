import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSession,
  isAdminConfigured,
  passwordMatches,
} from "@/lib/adminAuth";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.redirect(new URL("/admin?setup=required", request.url), 303);
  }

  const form = await request.formData();
  const password = typeof form.get("password") === "string" ? String(form.get("password")) : "";
  if (!(await passwordMatches(password))) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  response.cookies.set(ADMIN_COOKIE, createAdminSession(), adminCookieOptions);
  return response;
}
