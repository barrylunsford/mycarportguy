import { randomBytes, scryptSync } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSession,
  hasAdminSession,
} from "@/lib/adminAuth";

export const runtime = "nodejs";

function isLocalRequest(request: Request) {
  const hostname = new URL(request.url).hostname;
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export async function POST(request: Request) {
  if (!isLocalRequest(request) || !(await hasAdminSession())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const form = await request.formData();
  const password = typeof form.get("password") === "string" ? String(form.get("password")) : "";
  const confirmation =
    typeof form.get("confirmation") === "string" ? String(form.get("confirmation")) : "";
  if (password.length < 12 || password.length > 200 || password !== confirmation) {
    return NextResponse.redirect(new URL("/admin/change-password?error=1", request.url), 303);
  }

  const salt = randomBytes(16).toString("hex");
  const passwordHash = salt + ":" + scryptSync(password, salt, 64).toString("hex");
  const envPath = path.join(process.cwd(), ".env.local");
  const current = await fs.readFile(envPath, "utf8").catch(() => "");
  const withoutOldPassword = current
    .split(/\r?\n/)
    .filter(
      (line) =>
        !line.startsWith("ADMIN_PASSWORD=") &&
        !line.startsWith("ADMIN_PASSWORD_HASH="),
    )
    .join("\n")
    .replace(/\n*$/, "\n");
  const next = withoutOldPassword + "ADMIN_PASSWORD_HASH=" + JSON.stringify(passwordHash) + "\n";
  const temporaryPath = envPath + ".tmp";
  await fs.writeFile(temporaryPath, next, { encoding: "utf8", mode: 0o600 });
  await fs.rename(temporaryPath, envPath);

  process.env.ADMIN_PASSWORD_HASH = passwordHash;
  delete process.env.ADMIN_PASSWORD;

  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  response.cookies.set(ADMIN_COOKIE, createAdminSession(), adminCookieOptions);
  return response;
}
