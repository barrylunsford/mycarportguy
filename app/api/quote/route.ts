import { createQuoteLead } from "@/lib/quotes";

const DESTINATION_EMAIL = "sales@mycarportguy.com";
const MAX_BODY_BYTES = 12_000;

type QuoteRequest = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  zip?: unknown;
  structure?: unknown;
  product?: unknown;
  roofColor?: unknown;
  trimColor?: unknown;
  wallColor?: unknown;
  preferredContact?: unknown;
  timeframe?: unknown;
  intendedUse?: unknown;
  bestTime?: unknown;
  dimensions?: unknown;
  siteReadiness?: unknown;
  details?: unknown;
  website?: unknown;
  startedAt?: unknown;
};

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json({ message: "Request is too large." }, { status: 413 });
  }

  let payload: QuoteRequest;
  try {
    payload = (await request.json()) as QuoteRequest;
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }

  const name = clean(payload.name, 100);
  const phone = clean(payload.phone, 40);
  const email = clean(payload.email, 160).toLowerCase();
  const zip = clean(payload.zip, 10);
  const structure = clean(payload.structure, 80);
  const product = clean(payload.product, 160);
  const roofColor = clean(payload.roofColor, 60);
  const trimColor = clean(payload.trimColor, 60);
  const wallColor = clean(payload.wallColor, 60);
  const preferredContact = clean(payload.preferredContact, 40);
  const timeframe = clean(payload.timeframe, 60);
  const intendedUse = clean(payload.intendedUse, 100);
  const bestTime = clean(payload.bestTime, 40);
  const dimensions = clean(payload.dimensions, 80);
  const siteReadiness = clean(payload.siteReadiness, 100);
  const details = clean(payload.details, 2_000);
  const website = clean(payload.website, 200);
  const startedAt = Number(payload.startedAt);

  // Silently accept obvious bot submissions so they do not keep retrying.
  if (website) {
    return Response.json({ ok: true });
  }

  const submittedTooQuickly =
    !Number.isFinite(startedAt) || Date.now() - startedAt < 2_000;
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validZip = /^\d{5}$/.test(zip);

  if (
    submittedTooQuickly ||
    !name ||
    !phone ||
    !validEmail ||
    !validZip ||
    !structure ||
    !preferredContact ||
    !timeframe
  ) {
    return Response.json(
      { message: "Please check the required fields and try again." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.QUOTE_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("Quote email service is not configured.");
    return Response.json(
      { message: "Email delivery is temporarily unavailable. Please call or text us." },
      { status: 503 },
    );
  }

  const safe = {
    name: escapeHtml(name),
    phone: escapeHtml(phone),
    email: escapeHtml(email),
    zip: escapeHtml(zip),
    structure: escapeHtml(structure),
    product: escapeHtml(product || "Not selected"),
    roofColor: escapeHtml(roofColor || "Not selected"),
    trimColor: escapeHtml(trimColor || "Not selected"),
    wallColor: escapeHtml(wallColor || "Not selected"),
    preferredContact: escapeHtml(preferredContact),
    timeframe: escapeHtml(timeframe),
    intendedUse: escapeHtml(intendedUse || "Not provided"),
    bestTime: escapeHtml(bestTime || "Any time"),
    dimensions: escapeHtml(dimensions || "Not provided"),
    siteReadiness: escapeHtml(siteReadiness || "Not sure yet"),
    details: escapeHtml(details || "Not provided"),
  };

  try {
    await createQuoteLead({
      name,
      phone,
      email,
      zip,
      structure,
      product,
      roofColor,
      trimColor,
      wallColor,
      preferredContact,
      timeframe,
      intendedUse,
      bestTime,
      dimensions,
      siteReadiness,
      details,
    });
  } catch (error) {
    // Email remains a dependable fallback if hosted storage is unavailable.
    console.error("Quote database storage failed.", error);
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [DESTINATION_EMAIL],
      reply_to: email,
      subject: `New quote request: ${structure} in ${zip}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;color:#173044">
          <h1 style="color:#0a2740">New website quote request</h1>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;font-weight:bold">Name</td><td>${safe.name}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold">Phone</td><td>${safe.phone}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold">Email</td><td>${safe.email}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold">ZIP code</td><td>${safe.zip}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold">Structure</td><td>${safe.structure}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold">Building</td><td>${safe.product}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold">Roof color</td><td>${safe.roofColor}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold">Trim color</td><td>${safe.trimColor}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold">Wall color</td><td>${safe.wallColor}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold">Preferred contact</td><td>${safe.preferredContact}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold">Project timeframe</td><td>${safe.timeframe}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold">Intended use</td><td>${safe.intendedUse}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold">Best contact time</td><td>${safe.bestTime}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold">Approximate dimensions</td><td>${safe.dimensions}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold">Site readiness</td><td>${safe.siteReadiness}</td></tr>
          </table>
          <h2 style="margin-top:24px;color:#0a2740">Project details</h2>
          <p style="white-space:pre-wrap;line-height:1.6">${safe.details}</p>
        </div>
      `,
      text: [
        "New website quote request",
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        `ZIP code: ${zip}`,
        `Structure: ${structure}`,
        `Building: ${product || "Not selected"}`,
        `Roof color: ${roofColor || "Not selected"}`,
        `Trim color: ${trimColor || "Not selected"}`,
        `Wall color: ${wallColor || "Not selected"}`,
        `Preferred contact: ${preferredContact}`,
        `Project timeframe: ${timeframe}`,
        `Intended use: ${intendedUse || "Not provided"}`,
        `Best contact time: ${bestTime || "Any time"}`,
        `Approximate dimensions: ${dimensions || "Not provided"}`,
        `Site readiness: ${siteReadiness || "Not sure yet"}`,
        `Project details: ${details || "Not provided"}`,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    console.error("Quote email provider rejected the request.", response.status);
    return Response.json(
      { message: "We could not send your request. Please call or text us instead." },
      { status: 502 },
    );
  }

  const confirmationResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      reply_to: DESTINATION_EMAIL,
      subject: "We received your quote request | My Carport Guy",
      html: `
        <div style="margin:0;padding:32px 16px;background:#f4f1eb;font-family:Arial,sans-serif;color:#173044">
          <div style="max-width:620px;margin:0 auto;overflow:hidden;border-radius:12px;background:#ffffff;box-shadow:0 12px 35px rgba(10,39,64,.10)">
            <div style="padding:26px 32px;background:#0a2740;color:#ffffff">
              <div style="font-size:12px;font-weight:bold;letter-spacing:2px;color:#f58b60">MY CARPORT GUY</div>
              <h1 style="margin:12px 0 0;font-size:28px;line-height:1.2">Thanks, ${safe.name}. We received your request.</h1>
            </div>
            <div style="padding:32px">
              <p style="margin:0;font-size:16px;line-height:1.7">Your quote request is safely in our inbox. We&apos;ll review the details and contact you using your preferred method.</p>
              <div style="margin:26px 0;padding:22px;border-left:4px solid #ed713e;background:#f8f5f0">
                <h2 style="margin:0 0 14px;font-size:18px;color:#0a2740">What happens next</h2>
                <ol style="margin:0;padding-left:20px;line-height:1.75">
                  <li>We review your building ideas and installation ZIP code.</li>
                  <li>We confirm available options and any details still needed.</li>
                  <li>We contact you with guidance and current pricing.</li>
                </ol>
              </div>
              <h2 style="margin:0 0 12px;font-size:18px;color:#0a2740">Your request</h2>
              <table style="width:100%;border-collapse:collapse;font-size:14px">
                <tr><td style="padding:9px 0;border-bottom:1px solid #e4e8e8;font-weight:bold">Structure</td><td style="padding:9px 0;border-bottom:1px solid #e4e8e8;text-align:right">${safe.structure}</td></tr>
                <tr><td style="padding:9px 0;border-bottom:1px solid #e4e8e8;font-weight:bold">ZIP code</td><td style="padding:9px 0;border-bottom:1px solid #e4e8e8;text-align:right">${safe.zip}</td></tr>
                <tr><td style="padding:9px 0;border-bottom:1px solid #e4e8e8;font-weight:bold">Preferred contact</td><td style="padding:9px 0;border-bottom:1px solid #e4e8e8;text-align:right">${safe.preferredContact}</td></tr>
                <tr><td style="padding:9px 0;font-weight:bold">Timeframe</td><td style="padding:9px 0;text-align:right">${safe.timeframe}</td></tr>
              </table>
              <p style="margin:28px 0 0;line-height:1.65">Need to add something? Reply to this email, call, or text <a href="tel:+18288391730" style="color:#c95226;font-weight:bold">(828) 839-1730</a>.</p>
            </div>
            <div style="padding:20px 32px;background:#eef3f3;color:#526774;font-size:12px;line-height:1.6">My Carport Guy is an online metal-building dealer. There is no public showroom or customer pickup location.</div>
          </div>
        </div>
      `,
      text: [
        `Thanks, ${name}. We received your quote request.`,
        "",
        "What happens next:",
        "1. We review your building ideas and installation ZIP code.",
        "2. We confirm available options and any details still needed.",
        "3. We contact you with guidance and current pricing.",
        "",
        `Structure: ${structure}`,
        `ZIP code: ${zip}`,
        `Preferred contact: ${preferredContact}`,
        `Timeframe: ${timeframe}`,
        "",
        "Need to add something? Reply to this email, call, or text (828) 839-1730.",
      ].join("\n"),
    }),
  });

  // The customer already sees an on-page success message once the business
  // notification is delivered, so a confirmation-email failure should not
  // make the form appear unsuccessful or encourage a duplicate submission.
  if (!confirmationResponse.ok) {
    console.error(
      "Customer quote confirmation was not delivered.",
      confirmationResponse.status,
    );
  }

  return Response.json({ ok: true });
}
