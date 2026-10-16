export const quoteStatuses = ["New", "Contacted", "Quoted", "Won", "Lost"] as const;

export type QuoteStatus = (typeof quoteStatuses)[number];

export type QuoteLead = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: QuoteStatus;
  notes: string;
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
  "id" | "createdAt" | "updatedAt" | "status" | "notes"
>;
