const base = new URL(process.argv[2] || "https://www.mycarportguy.com");
const seen = new Set([new URL("/", base).toString()]);
const queue = [...seen];
const pages = [];
const failures = [];

function attributeValues(html, tag, attribute) {
  const values = [];
  const pattern = new RegExp(
    `<${tag}\\b[^>]*\\b${attribute}=["']([^"']+)["']`,
    "gi",
  );
  let match;
  while ((match = pattern.exec(html))) values.push(match[1]);
  return values;
}

function metadataValue(html, name) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if (!new RegExp(`\\bname=["']${name}["']`, "i").test(tag)) continue;
    return tag.match(/\bcontent=["']([^"']*)["']/i)?.[1] || "";
  }
  return "";
}

function canonicalValue(html) {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if (!/\brel=["']canonical["']/i.test(tag)) continue;
    return tag.match(/\bhref=["']([^"']*)["']/i)?.[1] || "";
  }
  return "";
}

while (queue.length) {
  const url = queue.shift();
  let response;
  try {
    response = await fetch(url, { redirect: "follow" });
  } catch (error) {
    failures.push({ url, problem: `Fetch failed: ${error.message}` });
    continue;
  }

  const contentType = response.headers.get("content-type") || "";
  if (!response.ok) failures.push({ url, problem: `HTTP ${response.status}` });
  if (!contentType.includes("text/html")) {
    pages.push({ url, status: response.status, contentType });
    continue;
  }

  const html = await response.text();
  const record = {
    url,
    status: response.status,
    title: html.match(/<title>([^<]*)<\/title>/i)?.[1] || "",
    description: metadataValue(html, "description"),
    canonical: canonicalValue(html),
    h1Count: (html.match(/<h1\b/gi) || []).length,
    jsonLdCount: (html.match(/application\/ld\+json/gi) || []).length,
    imageCount: attributeValues(html, "img", "src").length,
  };
  pages.push(record);

  for (const href of attributeValues(html, "a", "href")) {
    if (/^(mailto:|tel:|sms:|#)/i.test(href)) continue;
    let destination;
    try {
      destination = new URL(href, url);
    } catch {
      failures.push({ url, problem: `Invalid link: ${href}` });
      continue;
    }
    if (destination.origin !== base.origin) continue;
    destination.hash = "";
    if (
      destination.pathname.startsWith("/_next/") ||
      destination.pathname.startsWith("/api/")
    ) continue;
    const normalized = destination.toString();
    if (!seen.has(normalized)) {
      seen.add(normalized);
      queue.push(normalized);
    }
  }
}

const issues = [];
for (const page of pages) {
  if (!("title" in page)) continue;
  if (!page.title) issues.push({ url: page.url, problem: "Missing title" });
  if (!page.description) issues.push({ url: page.url, problem: "Missing description" });
  if (!page.canonical) issues.push({ url: page.url, problem: "Missing canonical URL" });
  if (page.h1Count !== 1) {
    issues.push({ url: page.url, problem: `Expected 1 H1; found ${page.h1Count}` });
  }
}

console.log(JSON.stringify({
  checkedAt: new Date().toISOString(),
  base: base.toString(),
  pageCount: pages.length,
  failures,
  issues,
  pages,
}, null, 2));

if (failures.length) process.exitCode = 1;
