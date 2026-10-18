import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

export const squareWebhookUrl = process.env.SQUARE_WEBHOOK_URL || "https://www.mycarportguy.com/api/webhooks/square";

export function validSquareSignature(rawBody: string, signature: string, signatureKey: string) {
  const expected = createHmac("sha256", signatureKey)
    .update(`${squareWebhookUrl}${rawBody}`)
    .digest();
  let received: Buffer;
  try {
    received = Buffer.from(signature, "base64");
  } catch {
    return false;
  }
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export type SquareInvoiceEvent = {
  type?: string;
  created_at?: string;
  data?: {
    id?: string;
    object?: {
      invoice?: {
        id?: string;
        status?: string;
        payment_requests?: Array<{
          total_completed_amount_money?: { amount?: number };
        }>;
      };
    };
  };
};
