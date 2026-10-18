export const quoteStatuses = ["New", "First follow-up", "Second follow-up", "Long-term follow-up", "Purchased", "Purchase follow-up", "Closed", "Contacted", "Quoted", "Won", "Lost"] as const;

export type QuoteStatus = (typeof quoteStatuses)[number];

export type QuoteLead = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: QuoteStatus;
  notes: string;
  nextFollowUp?: string;
  lastContactedAt?: string;
  squareInvoiceId?: string;
  squareInvoiceUrl?: string;
  squareInvoiceStatus?: string;
  squareInvoiceAmount?: number;
  squareInvoiceDueDate?: string;
  squareInvoicePaidAt?: string;
  name: string;
  phone: string;
  email: string;
  zip: string;
  structure: string;
  product: string;
  roofColor: string;
  trimColor: string;
  wallColor: string;
  preferredContact: string;
  timeframe: string;
  intendedUse: string;
  bestTime: string;
  dimensions: string;
  siteReadiness: string;
  details: string;
};

export type NewQuoteLead = Omit<
  QuoteLead,
  "id" | "createdAt" | "updatedAt" | "status" | "notes" | "nextFollowUp" | "lastContactedAt" |
  "squareInvoiceId" | "squareInvoiceUrl" | "squareInvoiceStatus" | "squareInvoiceAmount" |
  "squareInvoiceDueDate" | "squareInvoicePaidAt"
>;

export type QuotePatch = {
  status: QuoteStatus;
  notes: string;
  nextFollowUp?: string;
  lastContactedAt?: string;
  squareInvoiceId?: string;
  squareInvoiceUrl?: string;
  squareInvoiceStatus?: string;
  squareInvoiceAmount?: number;
  squareInvoiceDueDate?: string;
  squareInvoicePaidAt?: string;
};
