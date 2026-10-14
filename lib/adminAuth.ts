import "server-only";

import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "mycarportguy_admin";
const SESSION_SECONDS = 7 * 24 * 60 * 60;

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function isAdminConfigured() {
  return Boolean(
    (process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD) && sessionSecret(),
  );
}

export function passwordMatches(password: string) {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (passwordHash) {
    const [salt, storedKey] = passwordHash.split(":");
    if (!salt || !storedKey) return false;
    const expected = Buffer.from(storedKey, "hex");
    const supplied = scryptSync(password, salt, expected.length);
    return expected.length === supplied.length && timingSafeEqual(expected, supplied);
  }

  const expected = Buffer.from(process.env.ADMIN_PASSWORD || "");
  const supplied = Buffer.from(password);
  return (
    expected.length > 0 &&
    expected.length === supplied.length &&
    timingSafeEqual(expected, supplied)
  );
}

export function createAdminSession() {
  const payload = Buffer.from(
    JSON.stringify({ expiresAt: Date.now() + SESSION_SECONDS * 1_000 }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export async function hasAdminSession() {
  if (!isAdminConfigured()) return process.env.NODE_ENV !== "production";
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  if (expected.length !== signature.length) return false;
  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return false;

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return Number(decoded.expiresAt) > Date.now();
  } catch {
    return false;
  }
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_SECONDS,
};
