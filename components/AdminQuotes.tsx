"use client";

import { useMemo, useState } from "react";
import { quoteStatuses, type QuoteLead, type QuoteStatus } from "@/lib/quote-types";

type Props = { initialQuotes: QuoteLead[]; editable: boolean };

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function emailDraft(email: string, subject: string, body: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function customerFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || "there";
}

function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isClosed(quote: QuoteLead) {
  return ["Closed", "Lost"].includes(quote.status);
}

function dueDate(quote: QuoteLead) {
  return isClosed(quote) ? "" : quote.nextFollowUp || (quote.status === "New" ? quote.createdAt.slice(0, 10) : "");
}

function nextContact(quote: QuoteLead): Partial<QuoteLead> {
  const steps: Partial<Record<QuoteStatus, [QuoteStatus, number]>> = {
    New: ["First follow-up", 2], Contacted: ["First follow-up", 2], Quoted: ["First follow-up", 2],
    "First follow-up": ["Second follow-up", 7], "Second follow-up": ["Long-term follow-up", 30],
    "Long-term follow-up": ["Long-term follow-up", 30], Purchased: ["Purchase follow-up", 7],
    Won: ["Purchase follow-up", 7], "Purchase follow-up": ["Closed", 0],
  };
  const [status, days] = steps[quote.status] || [quote.status, 0];
  const next = new Date();
  next.setDate(next.getDate() + days);
  return { status, lastContactedAt: new Date().toISOString(), nextFollowUp: days ? localDay(next) : "" };
}

export default function AdminQuotes({ initialQuotes, editable }: Props) {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [selectedId, setSelectedId] = useState(initialQuotes[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "All">("All");
  const [adding, setAdding] = useState(false);
  const [queue, setQueue] = useState("All");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceDueDate, setInvoiceDueDate] = useState(localDay());
  const [invoiceNotice, setInvoiceNotice] = useState("");
  const [sendingInvoice, setSendingInvoice] = useState(false);
  const today = localDay();
  const selected = quotes.find((quote) => quote.id === selectedId);

  const emailTemplates = selected ? (() => {
    const firstName = customerFirstName(selected.name);
    const structure = selected.structure || "building";
    const structureLower = structure.toLowerCase();
    const project = selected.product || structure;
    const dimensions = selected.dimensions || "Not provided yet";
    const colors = [
      selected.roofColor && `roof: ${selected.roofColor}`,
      selected.trimColor && `trim: ${selected.trimColor}`,
      selected.wallColor && `walls: ${selected.wallColor}`,
    ].filter(Boolean).join(", ") || "Not selected yet";
    const signature = "Thanks,\nMy Carport Guy\n(828) 839-1730\nsales@mycarportguy.com";

    return [
      {
        label: "First response",
        description: "Confirm the request and set expectations.",
        subject: `Your ${structureLower} request | My Carport Guy`,
        body: `Hi ${firstName},\n\nThank you for contacting My Carport Guy. I received your request for a ${project} in ZIP code ${selected.zip}.\n\nHere is what I have so far:\n• Building: ${project}\n• Size: ${dimensions}\n• Colors: ${colors}\n• Timeframe: ${selected.timeframe}\n\nI’ll review the details and follow up with the best options. If anything above needs to be changed, just reply and let me know.\n\n${signature}`,
      },
      {
        label: "Request details",
        description: "Ask for anything needed to finish pricing.",
        subject: `A few details for your ${structureLower} quote`,
        body: `Hi ${firstName},\n\nI’m working on your ${structureLower} quote and need a few details to make sure the building fits your needs. Please send anything that wasn’t included in your original request:\n\n• Exact width, length, and height\n• What the building will protect or be used for\n• Garage doors, walk-in doors, windows, or other openings\n• Roof, trim, and wall colors\n• Whether the installation site is level and accessible\n• Installation address or ZIP code\n• Your preferred timing\n\nOnce I have those details, I can help narrow down the right configuration.\n\n${signature}`,
      },
      {
        label: "Send quote",
        description: "A polished message with spots for price and link.",
        subject: `Your ${structureLower} quote | My Carport Guy`,
        body: `Hi ${firstName},\n\nI have your quote ready for the ${project}.\n\nQuoted price: [ENTER PRICE]\nDesign or order link: [PASTE LINK]\n\nProject details:\n• Size: ${dimensions}\n• Colors: ${colors}\n• Installation ZIP code: ${selected.zip}\n\nPlease review the design and details carefully. If you’d like to change the size, colors, doors, windows, or other features, reply to this email and I’ll help update it. Final specifications, pricing, payment terms, and customer responsibilities are listed on the order documents.\n\n${signature}`,
      },
      {
        label: "Follow up",
        description: "Check in after sending a quote.",
        subject: `Checking in on your ${structureLower} quote`,
        body: `Hi ${firstName},\n\nI wanted to check in about the quote for your ${project}. Do you have any questions, or would you like to change the size, colors, or features?\n\nThere’s no pressure—I’m happy to help when you’re ready.\n\n${signature}`,
      },
      {
        label: "Order confirmation",
        description: "Explain what happens after the order is placed.",
        subject: "Your My Carport Guy order is moving forward",
        body: `Hi ${firstName},\n\nThank you for your order. Your order for the ${project} has been received and is moving forward.\n\nPlease keep your order documents for reference. The manufacturer will review the order and contact you as the project moves toward scheduling. Before installation, please make sure the site is level, accessible, and ready, and confirm any permits or local requirements that apply.\n\nThe signed order documents contain the final specifications, pricing, payment terms, scheduling information, and customer responsibilities. If you have any questions along the way, reply here or call me.\n\n${signature}`,
      },
    ];
  })() : [];

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return quotes.filter((quote) => {
      const matchesStatus = statusFilter === "All" || quote.status === statusFilter;
      const haystack = `${quote.name} ${quote.email} ${quote.phone} ${quote.zip} ${quote.structure} ${quote.product}`.toLowerCase();
      const due = dueDate(quote);
      const matchesQueue = queue === "All" || (queue === "Due" && due && due <= today) || (queue === "Upcoming" && due > today) || (queue === "Unscheduled" && !isClosed(quote) && !due);
      return matchesStatus && matchesQueue && (!needle || haystack.includes(needle));
    }).sort((a, b) => {
      const aDue = dueDate(a), bDue = dueDate(b);
      return Number(isClosed(a)) - Number(isClosed(b)) || (aDue || "9999").localeCompare(bDue || "9999") || b.createdAt.localeCompare(a.createdAt);
    });
  }, [quotes, query, statusFilter, queue, today]);

  function updateSelected(patch: Partial<QuoteLead>) {
    setQuotes((current) => current.map((quote) => quote.id === selectedId ? { ...quote, ...patch } : quote));
    setNotice("Unsaved changes");
  }

  async function save(patch: Partial<QuoteLead> = {}) {
    if (!selected) return;
    const lead = { ...selected, ...patch };
    setSaving(true);
    setNotice("Saving…");
    try {
      const response = await fetch("/api/admin/quotes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id, status: lead.status, notes: lead.notes, nextFollowUp: lead.nextFollowUp || "", lastContactedAt: lead.lastContactedAt || "" }),
      });
      const result = (await response.json()) as { message?: string; quote?: QuoteLead };
      if (!response.ok || !result.quote) throw new Error(result.message || "Could not save quote.");
      setQuotes((current) => current.map((quote) => quote.id === result.quote?.id ? result.quote : quote));
      setNotice("Changes saved");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save quote.");
    } finally {
      setSaving(false);
    }
  }

  async function addLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.currentTarget));
    setSaving(true);
    try {
      const response = await fetch("/api/admin/quotes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok || !result.quotes) throw new Error(result.message || "Could not add lead.");
      setQuotes(result.quotes);
      setSelectedId(result.quotes[0]?.id || "");
      setAdding(false); setQuery(""); setQueue("All"); setStatusFilter("All");
      setNotice("Lead added");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not add lead."); }
    finally { setSaving(false); }
  }

  async function sendDepositInvoice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const amount = Number(invoiceAmount);
    if (!Number.isFinite(amount) || amount < 1) {
      setInvoiceNotice("Enter the required deposit amount.");
      return;
    }
    if (!window.confirm(`Square will email ${selected.email} a $${amount.toFixed(2)} deposit invoice due ${invoiceDueDate}. Send it now?`)) return;
    setSendingInvoice(true);
    setInvoiceNotice("Creating and sending the Square invoice…");
    try {
      const response = await fetch("/api/admin/square-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: selected.id,
          name: selected.name,
          email: selected.email,
          phone: selected.phone,
          project: selected.product || selected.structure,
          amount,
          dueDate: invoiceDueDate,
        }),
      });
      const result = (await response.json()) as { message?: string; invoiceId?: string; invoiceUrl?: string; quote?: QuoteLead };
      if (!response.ok || !result.invoiceId) throw new Error(result.message || "Square could not send the invoice.");
      if (result.quote) setQuotes((current) => current.map((quote) => quote.id === result.quote?.id ? result.quote : quote));
      setInvoiceNotice("Invoice sent by Square and recorded in this lead.");
      setInvoiceAmount("");
    } catch (error) {
      setInvoiceNotice(error instanceof Error ? error.message : "Square could not send the invoice.");
    } finally {
      setSendingInvoice(false);
    }
  }

  function exportCsv() {
    const headings = ["Date", "Status", "Name", "Phone", "Email", "ZIP", "Structure", "Product", "Preferred contact", "Timeframe", "Dimensions", "Site readiness", "Details", "Private notes", "Next follow-up", "Last contacted"];
    const rows = filtered.map((quote) => [quote.createdAt, quote.status, quote.name, quote.phone, quote.email, quote.zip, quote.structure, quote.product, quote.preferredContact, quote.timeframe, quote.dimensions, quote.siteReadiness, quote.details, quote.notes, quote.nextFollowUp || "", quote.lastContactedAt || ""]);
    const csv = [headings, ...rows].map((row) => row.map((value) => csvCell(String(value ?? ""))).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `my-carport-guy-quotes-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return <main className="admin-shell admin-quotes-shell">
    <aside className="admin-sidebar">
      <div className="admin-sidebar-heading"><div><span>Lead tracker</span><strong>{filtered.length} leads</strong></div><div className="admin-backup-actions"><button type="button" onClick={exportCsv} disabled={filtered.length === 0}>CSV</button><a href="/api/admin/quotes/backup">Backup</a></div></div>
      <div className="lead-add"><button type="button" onClick={() => { setAdding(!adding); setNotice(""); }} disabled={!editable || saving}>{adding ? "Cancel" : "+ Add lead"}</button>
      {adding && <form onSubmit={addLead}>
        <p>Add a lead from a call, referral, or social media.</p>
        {[["name", "Name", "text"], ["phone", "Phone", "tel"], ["email", "Email", "email"], ["zip", "ZIP code", "text"], ["structure", "Building interest", "text"]].map(([name, label, type]) => <label key={name}>{label}<input name={name} type={type} required maxLength={100} disabled={saving} /></label>)}
        <label>Details / source<textarea name="details" maxLength={2000} disabled={saving} /></label>
        <button type="submit" disabled={saving}>{saving ? "Adding…" : "Save new lead"}</button>
        <p role="status">{notice}</p>
      </form>}</div>
      <label className="admin-search"><span className="sr-only">Search quotes</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, ZIP, building…" /></label>
      <div className="lead-queue" aria-label="Follow-up queue">
        {[["All", "All leads"], ["Due", "Due / overdue"], ["Upcoming", "Upcoming"], ["Unscheduled", "Needs a date"]].map(([value, label]) => <button type="button" key={value} aria-pressed={queue === value} onClick={() => setQueue(value)}>{label}<strong>{quotes.filter((lead) => { const due = dueDate(lead); return value === "All" || (value === "Due" && due && due <= today) || (value === "Upcoming" && due > today) || (value === "Unscheduled" && !isClosed(lead) && !due); }).length}</strong></button>)}
      </div>
      <label className="admin-quote-filter"><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as QuoteStatus | "All")}><option>All</option>{quoteStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
      <div className="admin-product-list admin-quote-list">
        {filtered.map((quote) => <button type="button" key={quote.id} className={quote.id === selectedId ? "active" : ""} onClick={() => setSelectedId(quote.id)}>
          <span className={`admin-quote-status status-${quote.status.toLowerCase().replaceAll(" ", "-")}`}>{quote.status.slice(0, 1)}</span>
          <span><strong>{quote.name}</strong><small>{quote.status} · {quote.zip}</small><small className={dueDate(quote) && dueDate(quote) < today ? "lead-overdue" : ""}>{isClosed(quote) ? "Closed" : dueDate(quote) ? `${dueDate(quote) < today ? "Overdue" : "Follow up"}: ${dueDate(quote)}` : "Set a follow-up date"}</small></span>
        </button>)}
        {filtered.length === 0 && <p className="admin-list-empty">No matching quote requests.</p>}
      </div>
    </aside>

    <section className="admin-editor"><fieldset className="lead-editor-fields" disabled={saving}>
      {selected ? <>
        <div className="admin-editor-heading"><div><span>Quote request · {formatDate(selected.createdAt)}</span><h1>{selected.name}</h1></div><div className="admin-actions"><a href={`tel:${selected.phone}`}>Call</a><a href={`sms:${selected.phone}`}>Text</a><a href={`mailto:${selected.email}`}>Email</a></div></div>
        <section className="lead-schedule" aria-label="Follow-up schedule">
          <div><h2>Next action</h2><p>Complete a contact to move to the next stage and schedule a follow-up. First: 2 days, second: 7 days, long-term: 30 days. Purchase check-in: 7 days.</p></div>
          <label>Next follow-up<input type="date" value={selected.nextFollowUp || ""} onChange={(event) => updateSelected({ nextFollowUp: event.target.value })} disabled={!editable || saving} /></label>
          <p>Last contact: {selected.lastContactedAt ? formatDate(selected.lastContactedAt) : "Not recorded"}</p>
          <button type="button" className="admin-save" disabled={!editable || saving || isClosed(selected)} onClick={() => save(nextContact(selected))}>Contact completed → next stage</button>
          <p>Dates organize your queue; messages are sent only when you send them yourself.</p>
        </section>
        <section className="admin-email-templates" aria-labelledby="email-templates-heading">
          <div className="admin-email-templates-heading">
            <div><span>Sales email templates</span><h2 id="email-templates-heading">Open a personalized draft</h2></div>
            <p>Each button opens an email addressed to {selected.email}. Review the details and replace any bracketed text before sending.</p>
          </div>
          <div className="admin-email-template-grid">
            {emailTemplates.map((template) => <a key={template.label} href={emailDraft(selected.email, template.subject, template.body)}>
              <strong>{template.label}</strong>
              <span>{template.description}</span>
              <small>Open email draft →</small>
            </a>)}
          </div>
        </section>
        <section className="admin-square-invoice" aria-labelledby="square-invoice-heading">
          <div><span>Square deposit invoice</span><h2 id="square-invoice-heading">Collect the required deposit</h2><p>Square emails the customer a secure invoice and payment page. Enter only the deposit Eagle requires, not the building&apos;s full price.</p></div>
          <form onSubmit={sendDepositInvoice}>
            <label>Deposit amount ($)<input type="number" min="1" max="100000" step="0.01" inputMode="decimal" value={invoiceAmount} onChange={(event) => setInvoiceAmount(event.target.value)} placeholder="500.00" required /></label>
            <label>Due date<input type="date" min={today} value={invoiceDueDate} onChange={(event) => setInvoiceDueDate(event.target.value)} required /></label>
            <button type="submit" className="admin-save" disabled={!editable || sendingInvoice}>{sendingInvoice ? "Sending…" : "Send deposit invoice"}</button>
          </form>
          <p className="admin-square-notice" role="status" aria-live="polite">{invoiceNotice}</p>
          {selected.squareInvoiceId && <div className={`admin-square-status ${selected.squareInvoiceStatus === "PAID" ? "paid" : ""}`}>
            <strong>{selected.squareInvoiceStatus === "PAID" ? "Deposit paid" : `Invoice ${selected.squareInvoiceStatus?.toLowerCase() || "sent"}`}</strong>
            <span>{selected.squareInvoiceAmount ? `$${selected.squareInvoiceAmount.toFixed(2)}` : ""}{selected.squareInvoicePaidAt ? ` · Paid ${formatDate(selected.squareInvoicePaidAt)}` : ""}</span>
            {selected.squareInvoiceUrl && <a href={selected.squareInvoiceUrl} target="_blank" rel="noreferrer">View Square invoice ↗</a>}
          </div>}
        </section>
        <div className="admin-lead-summary">
          <div><span>Status</span><select value={selected.status} aria-label="Lead stage" onChange={(event) => {
            const status = event.target.value as QuoteStatus;
            const date = new Date(); date.setDate(date.getDate() + 7);
            updateSelected({ status, ...(["Closed", "Lost"].includes(status) ? { nextFollowUp: "" } : ["Purchased", "Won"].includes(status) ? { nextFollowUp: localDay(date) } : {}) });
          }} disabled={!editable}>{quoteStatuses.map((status) => <option key={status}>{status}</option>)}</select></div>
          <div><span>Phone</span><a href={`tel:${selected.phone}`}>{selected.phone}</a></div>
          <div><span>Email</span><a href={`mailto:${selected.email}`}>{selected.email}</a></div>
          <div><span>ZIP code</span><strong>{selected.zip}</strong></div>
        </div>
        <div className="admin-quote-details">
          <section><h2>Building request</h2><dl>
            <div><dt>Structure</dt><dd>{selected.structure}</dd></div><div><dt>Selected building</dt><dd>{selected.product || "Not selected"}</dd></div>
            <div><dt>Dimensions</dt><dd>{selected.dimensions || "Not provided"}</dd></div><div><dt>Intended use</dt><dd>{selected.intendedUse || "Not provided"}</dd></div>
            <div><dt>Roof color</dt><dd>{selected.roofColor || "Not selected"}</dd></div><div><dt>Trim color</dt><dd>{selected.trimColor || "Not selected"}</dd></div>
            <div><dt>Wall color</dt><dd>{selected.wallColor || "Not selected"}</dd></div><div><dt>Site readiness</dt><dd>{selected.siteReadiness || "Not sure yet"}</dd></div>
          </dl></section>
          <section><h2>Follow-up</h2><dl><div><dt>Preferred contact</dt><dd>{selected.preferredContact}</dd></div><div><dt>Best time</dt><dd>{selected.bestTime || "Any time"}</dd></div><div><dt>Timeframe</dt><dd>{selected.timeframe}</dd></div></dl></section>
          <section className="admin-quote-message"><h2>Customer’s message</h2><p>{selected.details || "No additional details provided."}</p></section>
          <label className="admin-quote-notes"><span>Private notes</span><textarea rows={7} value={selected.notes} onChange={(event) => updateSelected({ notes: event.target.value })} placeholder="Add follow-up notes, pricing details, or reminders…" disabled={!editable} /></label>
        </div>
        <div className="admin-footer-actions admin-quote-save"><span role="status" aria-live="polite">{notice}</span><button type="button" className="admin-save" onClick={() => save()} disabled={!editable || saving}>{saving ? "Saving…" : "Save lead"}</button></div>
      </> : <div className="admin-empty"><h1>No quote requests yet</h1><p>New website submissions will appear here automatically.</p></div>}
    </fieldset></section>
  </main>;
}
