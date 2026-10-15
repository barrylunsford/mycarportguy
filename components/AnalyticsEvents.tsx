"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function AnalyticsEvents() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("a") : null;
      const href = target?.getAttribute("href") || "";
      if (!target || !href) return;

      if (href.startsWith("tel:")) {
        trackEvent("Phone Link Clicked", "phone_click", {
          page: window.location.pathname,
        });
        return;
      } else if (href.startsWith("sms:")) {
        trackEvent("Text Message Clicked", "sms_click", {
          page: window.location.pathname,
        });
        return;
      } else if (href.startsWith("mailto:")) {
        trackEvent("Email Link Clicked", "email_click", {
          page: window.location.pathname,
        });
        return;
      }

      const destination = new URL(href, window.location.origin);
      const product = destination.searchParams.get("product");

      if (product && destination.hash === "#quote") {
        trackEvent("Product Design Clicked", "select_product", {
          page: window.location.pathname,
          product,
        });
        return;
      }

      if (destination.pathname === "/financing") {
        trackEvent("Financing Interest", "financing_interest", {
          page: window.location.pathname,
          action: "Viewed financing",
        });
        return;
      }

      if (
        window.location.pathname === "/financing" &&
        destination.hash === "#payment-estimator"
      ) {
        trackEvent("Financing Interest", "financing_interest", {
          page: window.location.pathname,
          action: "Opened payment estimator",
        });
        return;
      }

      if (
        window.location.pathname === "/financing" &&
        destination.hash === "#quote"
      ) {
        trackEvent("Financing Interest", "financing_interest", {
          page: window.location.pathname,
          action: "Requested quote",
        });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
