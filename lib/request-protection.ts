import "server-only";

import { createHash } from "node:crypto";

type Attempt = { count: number; resetAt: number };

const globalStore = globalThis as typeof globalThis & {
  myCarportGuyAttempts?: Map<string, Attempt>;
  myCarportGuyDuplicates?: Map<string, number>;
};

const attempts = globalStore.myCarportGuyAttempts ?? new Map<string, Attempt>();
const duplicates = globalStore.myCarportGuyDuplicates ?? new Map<string, number>();
globalStore.myCarportGuyAttempts = attempts;
globalStore.myCarportGuyDuplicates = duplicates;

export function requestFingerprint(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || request.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(address).digest("hex").slice(0, 24);
}

export function isRateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  current.count += 1;
  return current.count > limit;
}

export function isDuplicateSubmission(key: string, windowMs: number) {
  const now = Date.now();
  const previous = duplicates.get(key) || 0;
  duplicates.set(key, now);
  return now - previous < windowMs;
}

export function submissionFingerprint(values: string[]) {
  return createHash("sha256").update(values.join("\u001f")).digest("hex");
}
