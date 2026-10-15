"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { buildingColors } from "@/lib/building-colors";

export default function QuoteForm() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [selection, setSelection] = useState({
    structure: "",
    product: "",
    roofColor: "",
    trimColor: "",
    wallColor: "",
  });
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
    const params = new URLSearchParams(window.location.search);
    // The quote builder passes selections through the URL after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelection({
      structure: params.get("structure") || "",
      product: params.get("product") || "",
      roofColor: params.get("roofColor") || "",
      trimColor: params.get("trimColor") || "",
      wallColor: params.get("wallColor") || "",
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const formElement = event.currentTarget;

    setStatus("sending");
    setMessage("Sending your request…");

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone"),
          email: form.get("email"),
          zip: form.get("zip"),
          structure: form.get("structure"),
          product: form.get("product"),
          roofColor: form.get("roofColor"),
          trimColor: form.get("trimColor"),
          wallColor: form.get("wallColor"),
          preferredContact: form.get("preferredContact"),
          timeframe: form.get("timeframe"),
          intendedUse: form.get("intendedUse"),
          bestTime: form.get("bestTime"),
          dimensions: form.get("dimensions"),
          siteReadiness: form.get("siteReadiness"),
          details: form.get("details"),
          website: form.get("website"),
          startedAt: startedAt.current,
        }),
      });

      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(result.message || "We could not send your request.");
      }

      formElement.reset();
      setSelection({ structure: "", product: "", roofColor: "", trimColor: "", wallColor: "" });
      startedAt.current = Date.now();
      track("Quote Request Sent", {
        structure: String(form.get("structure") || "Not specified"),
        hasProduct: Boolean(form.get("product")),
        hasColors: Boolean(form.get("roofColor") || form.get("trimColor") || form.get("wallColor")),
        preferredContact: String(form.get("preferredContact") || "Not specified"),
        timeframe: String(form.get("timeframe") || "Not specified"),
      });
      setStatus("success");
      setMessage("Thanks! Your quote request was sent. We’ll be in touch soon.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not send your request. Please call or text us instead.",
      );
    }
  }

  return (
    <form
      className="quote-form"
      onSubmit={handleSubmit}
      aria-busy={status === "sending"}
    >
      <div className="form-heading">
        <p>Tell us about your project</p>
        <span>Fields marked * are required</span>
      </div>

      <div className="form-grid">
        <label className="form-honeypot" aria-hidden="true">
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <input type="hidden" name="product" value={selection.product} readOnly />
        {(selection.product || selection.roofColor || selection.trimColor || selection.wallColor) && (
          <div className="quote-prefill form-full">
            <strong>Your saved selections</strong>
            {selection.product && <span>Building: {selection.product}</span>}
            {selection.roofColor && <span>Roof: {selection.roofColor}</span>}
            {selection.trimColor && <span>Trim: {selection.trimColor}</span>}
            {selection.wallColor && <span>Walls: {selection.wallColor}</span>}
          </div>
        )}
        <label>
          Your name *
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="First and last name"
            required
          />
        </label>
        <label>
          Phone number *
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="(828) 555-0123"
            required
          />
        </label>
        <label>
          Email address *
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </label>
        <label>
          ZIP code *
          <input
            type="text"
            name="zip"
            autoComplete="postal-code"
            inputMode="numeric"
            pattern="[0-9]{5}"
            maxLength={5}
            placeholder="Your 5-digit ZIP"
            required
          />
          <small className="field-hint">We&apos;ll confirm availability for your location.</small>
        </label>
        <label>
          What are you building? *
          <select
            name="structure"
            value={selection.structure}
            onChange={(event) => setSelection((current) => ({ ...current, structure: event.target.value }))}
            required
          >
            <option value="" disabled>
              Choose a structure
            </option>
            <option>Carport</option>
            <option>Garage</option>
            <option>RV cover</option>
            <option>Barn</option>
            <option>Commercial building</option>
            <option>Not sure yet</option>
          </select>
        </label>
        <div className="form-section-heading form-full">
          <strong>Choose your colors</strong>
          <span>Select each color now, or leave it as “Not sure yet.”</span>
        </div>
        <div className="form-color-grid form-full">
          {(["roofColor", "trimColor", "wallColor"] as const).map((field) => (
            <label key={field}>
              {field === "roofColor" ? "Roof color" : field === "trimColor" ? "Trim color" : "Wall color"}
              <select
                name={field}
                value={selection[field]}
                onChange={(event) => setSelection((current) => ({ ...current, [field]: event.target.value }))}
              >
                <option value="">Not sure yet</option>
                {buildingColors.map((color) => (
                  <option key={color.name} value={color.name}>{color.name}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <div className="form-section-heading form-full">
          <strong>A few quick project details</strong>
          <span>These help us respond with the most useful information.</span>
        </div>
        <label>
          How should we contact you? *
          <select name="preferredContact" defaultValue="" required>
            <option value="" disabled>Choose a contact method</option>
            <option>Call</option>
            <option>Text</option>
            <option>Email</option>
            <option>No preference</option>
          </select>
        </label>
        <label>
          Project timeframe *
          <select name="timeframe" defaultValue="" required>
            <option value="" disabled>Choose a timeframe</option>
            <option>As soon as possible</option>
            <option>Within 1–3 months</option>
            <option>Within 3–6 months</option>
            <option>More than 6 months</option>
            <option>Just researching</option>
          </select>
        </label>
        <label>
          What will you use it for?
          <select name="intendedUse" defaultValue="">
            <option value="">Choose an intended use</option>
            <option>Cars or trucks</option>
            <option>RV or camper</option>
            <option>Boat or recreational equipment</option>
            <option>Workshop</option>
            <option>Farm equipment or livestock</option>
            <option>Storage</option>
            <option>Commercial use</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          Best time to contact you
          <select name="bestTime" defaultValue="">
            <option value="">Any time</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>
        </label>
        <label>
          Approximate dimensions
          <input
            type="text"
            name="dimensions"
            placeholder="Example: 24 × 30 × 10"
            maxLength={80}
          />
        </label>
        <label>
          Is the installation site ready?
          <select name="siteReadiness" defaultValue="">
            <option value="">Not sure yet</option>
            <option>Yes—level and accessible</option>
            <option>In progress</option>
            <option>No—site work is still needed</option>
          </select>
        </label>
        <label className="form-full">
          Anything else we should know?
          <textarea
            name="details"
            rows={4}
            placeholder="Approximate size, colors, site details, or how you plan to use the building..."
          />
        </label>
      </div>

      <div className="form-submit">
        <button
          type="submit"
          className="button button-dark"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : "Send my quote request"}{" "}
          <span aria-hidden="true">→</span>
        </button>
        <p>
          Your details are sent securely to My Carport Guy. No email app is
          required.
        </p>
      </div>
      <p className="form-privacy">
        By submitting, you agree that we may contact you about your project.
        See our <Link href="/privacy">Privacy Policy</Link>.
      </p>
      <a className="form-text-option" href="sms:+18288391730">
        Prefer text? Message (828) 839-1730
      </a>
      {status === "success" && (
        <div className="form-confirmation form-confirmation-success" role="status" aria-live="polite">
          <span aria-hidden="true">✓</span>
          <div>
            <strong>Quote request sent</strong>
            <p>Thank you! We received your project details and will be in touch soon.</p>
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="form-confirmation form-confirmation-error" role="alert" aria-live="assertive">
          <span aria-hidden="true">!</span>
          <div>
            <strong>We couldn&apos;t send your request</strong>
            <p>{message}</p>
          </div>
        </div>
      )}
    </form>
  );
}
