import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSession,
  getAdminPasswordHash,
  hashPassword,
  saveAdminPasswordHash,
  verifyPasswordResetToken,
} from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData();
  const token = String(form.get("token") || "").slice(0, 2_000);
  const password = String(form.get("password") || "");
  const confirmation = String(form.get("confirmation") || "");
  const currentHash = await getAdminPasswordHash();
  const valid = password.length >= 12 && password.length <= 200 && password === confirmation &&
    Boolean(currentHash) && verifyPasswordResetToken(token, currentHash);
  if (!valid) {
    const url = new URL("/admin/reset-password", request.url);
    url.searchParams.set("token", token);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, 303);
  }

  await saveAdminPasswordHash(hashPassword(password));
  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  response.cookies.set(ADMIN_COOKIE, createAdminSession(), adminCookieOptions);
  return response;
}
