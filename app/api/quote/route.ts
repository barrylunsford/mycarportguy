const DESTINATION_EMAIL = "barry@mycarportguy.com";
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
    !structure
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
    details: escapeHtml(details || "Not provided"),
  };

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

  return Response.json({ ok: true });
}
