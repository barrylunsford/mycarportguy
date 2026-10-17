import { getAdminPasswordHash, createPasswordResetToken } from "@/lib/adminAuth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const attempts = new Map<string, number>();
const RECOVERY_EMAIL = "sales@mycarportguy.com";

export async function POST(request: Request) {
  const form = await request.formData();
  if (String(form.get("website") || "")) {
    return NextResponse.redirect(new URL("/admin/forgot-password?sent=1", request.url), 303);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const lastAttempt = attempts.get(ip) || 0;
  if (Date.now() - lastAttempt < 5 * 60 * 1_000) {
    return NextResponse.redirect(new URL("/admin/forgot-password?sent=1", request.url), 303);
  }
  attempts.set(ip, Date.now());

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.QUOTE_FROM_EMAIL;
  const passwordHash = await getAdminPasswordHash();
  if (!apiKey || !from || !passwordHash || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.redirect(new URL("/admin/forgot-password?error=1", request.url), 303);
  }

  const resetUrl = new URL("/admin/reset-password", request.url);
  resetUrl.protocol = "https:";
  resetUrl.host = "www.mycarportguy.com";
  resetUrl.searchParams.set("token", createPasswordResetToken(passwordHash));

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [RECOVERY_EMAIL],
      subject: "Reset your My Carport Guy admin password",
      html: `<div style="font-family:Arial,sans-serif;max-width:620px;color:#173044"><h1>Admin password reset</h1><p>A password reset was requested for the My Carport Guy dashboard.</p><p><a href="${resetUrl.toString()}" style="display:inline-block;padding:14px 20px;border-radius:6px;background:#0a2740;color:#fff;text-decoration:none;font-weight:bold">Choose a new password</a></p><p>This link expires in 30 minutes and can only be used once. If you did not request it, you can safely ignore this email.</p></div>`,
      text: `A password reset was requested for the My Carport Guy dashboard.\n\nChoose a new password: ${resetUrl.toString()}\n\nThis link expires in 30 minutes and can only be used once.`,
    }),
  });
  if (!response.ok) {
    attempts.delete(ip);
    return NextResponse.redirect(new URL("/admin/forgot-password?error=1", request.url), 303);
  }
  return NextResponse.redirect(new URL("/admin/forgot-password?sent=1", request.url), 303);
}
