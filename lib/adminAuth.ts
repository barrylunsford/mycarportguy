import "server-only";

import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "mycarportguy_admin";
const SESSION_SECONDS = 7 * 24 * 60 * 60;

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function remoteAuthConfig() {
  const url = process.env.CATALOG_API_URL?.replace(/\/$/, "");
  const token = process.env.CATALOG_API_TOKEN;
  return url && token ? { url, token } : null;
}

function matchesHash(password: string, passwordHash: string) {
  const [salt, storedKey] = passwordHash.split(":");
  if (!salt || !storedKey) return false;
  const expected = Buffer.from(storedKey, "hex");
  const supplied = scryptSync(password, salt, expected.length);
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export async function getAdminPasswordHash() {
  const remote = remoteAuthConfig();
  if (remote) {
    try {
      const response = await fetch(`${remote.url}/admin-auth`, {
        headers: { Authorization: `Bearer ${remote.token}` },
        cache: "no-store",
      });
      if (response.ok) {
        const result = (await response.json()) as { passwordHash?: string };
        if (result.passwordHash) return result.passwordHash;
      }
    } catch (error) {
      console.error("Admin authentication storage is unavailable.", error);
    }
    // Fail closed when hosted authentication is configured. Falling back to an
    // older deployment secret could make a previous password valid again.
    return "";
  }
  return process.env.ADMIN_PASSWORD_HASH || "";
}

export async function saveAdminPasswordHash(passwordHash: string) {
  const remote = remoteAuthConfig();
  if (!remote) throw new Error("Hosted admin authentication storage is not configured.");
  const response = await fetch(`${remote.url}/admin-auth`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${remote.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ passwordHash }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("The new admin password could not be saved.");
}

export function isAdminConfigured() {
  return Boolean(
    (process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD) && sessionSecret(),
  );
}

export async function passwordMatches(password: string) {
  const passwordHash = await getAdminPasswordHash();
  if (passwordHash) {
    return matchesHash(password, passwordHash);
  }

  const expected = Buffer.from(process.env.ADMIN_PASSWORD || "");
  const supplied = Buffer.from(password);
  return (
    expected.length > 0 &&
    expected.length === supplied.length &&
    timingSafeEqual(expected, supplied)
  );
}

function hashFingerprint(passwordHash: string) {
  return createHash("sha256").update(passwordHash).digest("base64url");
}

export function createPasswordResetToken(passwordHash: string) {
  const payload = Buffer.from(JSON.stringify({
    purpose: "admin-password-reset",
    expiresAt: Date.now() + 30 * 60 * 1_000,
    passwordVersion: hashFingerprint(passwordHash),
    nonce: randomBytes(16).toString("base64url"),
  })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyPasswordResetToken(token: string, passwordHash: string) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !sessionSecret()) return false;
  const expected = sign(payload);
  if (expected.length !== signature.length) return false;
  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return false;
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return decoded.purpose === "admin-password-reset" &&
      Number(decoded.expiresAt) > Date.now() &&
      decoded.passwordVersion === hashFingerprint(passwordHash);
  } catch {
    return false;
  }
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
