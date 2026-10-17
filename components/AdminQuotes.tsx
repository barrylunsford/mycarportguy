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

export default function AdminQuotes({ initialQuotes, editable }: Props) {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [selectedId, setSelectedId] = useState(initialQuotes[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "All">("All");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const selected = quotes.find((quote) => quote.id === selectedId);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return quotes.filter((quote) => {
      const matchesStatus = statusFilter === "All" || quote.status === statusFilter;
      const haystack = `${quote.name} ${quote.email} ${quote.phone} ${quote.zip} ${quote.structure} ${quote.product}`.toLowerCase();
      return matchesStatus && (!needle || haystack.includes(needle));
    });
  }, [quotes, query, statusFilter]);

  function updateSelected(patch: Partial<QuoteLead>) {
    setQuotes((current) => current.map((quote) => quote.id === selectedId ? { ...quote, ...patch } : quote));
    setNotice("Unsaved changes");
  }

  async function save() {
    if (!selected) return;
    setSaving(true);
    setNotice("Saving…");
    try {
      const response = await fetch("/api/admin/quotes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, status: selected.status, notes: selected.notes }),
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

  function exportCsv() {
    const headings = ["Date", "Status", "Name", "Phone", "Email", "ZIP", "Structure", "Product", "Preferred contact", "Timeframe", "Dimensions", "Site readiness", "Details", "Private notes"];
    const rows = filtered.map((quote) => [quote.createdAt, quote.status, quote.name, quote.phone, quote.email, quote.zip, quote.structure, quote.product, quote.preferredContact, quote.timeframe, quote.dimensions, quote.siteReadiness, quote.details, quote.notes]);
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
      <div className="admin-sidebar-heading"><div><span>Quotes</span><strong>{filtered.length} leads</strong></div><div className="admin-backup-actions"><button type="button" onClick={exportCsv} disabled={filtered.length === 0}>CSV</button><a href="/api/admin/quotes/backup">Backup</a></div></div>
      <label className="admin-search"><span className="sr-only">Search quotes</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, ZIP, building…" /></label>
      <label className="admin-quote-filter"><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as QuoteStatus | "All")}><option>All</option>{quoteStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
      <div className="admin-product-list admin-quote-list">
        {filtered.map((quote) => <button type="button" key={quote.id} className={quote.id === selectedId ? "active" : ""} onClick={() => setSelectedId(quote.id)}>
          <span className={`admin-quote-status status-${quote.status.toLowerCase()}`}>{quote.status.slice(0, 1)}</span>
          <span><strong>{quote.name}</strong><small>{quote.structure} · {quote.zip} · {formatDate(quote.createdAt)}</small></span>
        </button>)}
        {filtered.length === 0 && <p className="admin-list-empty">No matching quote requests.</p>}
      </div>
    </aside>

    <section className="admin-editor">
      {selected ? <>
        <div className="admin-editor-heading"><div><span>Quote request · {formatDate(selected.createdAt)}</span><h1>{selected.name}</h1></div><div className="admin-actions"><a href={`tel:${selected.phone}`}>Call</a><a href={`sms:${selected.phone}`}>Text</a><a href={`mailto:${selected.email}`}>Email</a></div></div>
        <details className="admin-follow-up-guide">
          <summary>Follow-up playbook</summary>
          <div className="admin-follow-up-steps">
            <div><strong>New</strong><span>Reply as soon as practical. Confirm the ZIP code, building use, approximate size, and preferred timeline.</span></div>
            <div><strong>Contacted</strong><span>Confirm site readiness, colors, and any doors, windows, or other must-have features.</span></div>
            <div><strong>Quoted</strong><span>Save the configuration and price in private notes, then follow up in one to two business days.</span></div>
            <div><strong>Won</strong><span>Confirm the signed order, payment requirements, and that the order was submitted for scheduling.</span></div>
            <div><strong>Lost</strong><span>Record the reason in private notes. Avoid repeated outreach unless the customer asks you to reconnect.</span></div>
          </div>
          <p><strong>Notes tip:</strong> Record the next action, follow-up date, quoted price, and the customer&apos;s preferred contact method.</p>
        </details>
        <div className="admin-lead-summary">
          <div><span>Status</span><select value={selected.status} onChange={(event) => updateSelected({ status: event.target.value as QuoteStatus })} disabled={!editable}>{quoteStatuses.map((status) => <option key={status}>{status}</option>)}</select></div>
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
        <div className="admin-footer-actions admin-quote-save"><span role="status" aria-live="polite">{notice}</span><button type="button" className="admin-save" onClick={save} disabled={!editable || saving}>{saving ? "Saving…" : "Save quote"}</button></div>
      </> : <div className="admin-empty"><h1>No quote requests yet</h1><p>New website submissions will appear here automatically.</p></div>}
    </section>
  </main>;
}
