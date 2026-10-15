"use client";

import { track } from "@vercel/analytics";

type EventProperties = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      properties?: EventProperties,
    ) => void;
  }
}

export function trackEvent(
  vercelEventName: string,
  googleEventName: string,
  properties: EventProperties = {},
) {
  track(vercelEventName, properties);
  window.gtag?.("event", googleEventName, properties);
}
