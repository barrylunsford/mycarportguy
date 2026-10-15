"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

export default function AnalyticsEvents() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("a") : null;
      const href = target?.getAttribute("href") || "";

      if (href.startsWith("tel:")) {
        track("Phone Link Clicked", { page: window.location.pathname });
      } else if (href.startsWith("mailto:")) {
        track("Email Link Clicked", { page: window.location.pathname });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
