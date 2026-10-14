import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminConfigured } from "@/lib/adminAuth";

export const metadata: Metadata = {
  title: "Set Up Admin Password",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminSetupPage({ searchParams }: Props) {
  if (process.env.NODE_ENV === "production") redirect("/admin/login");
  if (isAdminConfigured()) redirect("/admin/login");
  const { error } = await searchParams;

  return (
    <main id="main-content" className="admin-login-page">
      <section className="admin-login-card">
        <Link href="/" className="admin-login-brand">My Carport Guy</Link>
        <p className="eyebrow"><span />Private setup</p>
        <h1>Create your admin password.</h1>
        <p>
          This stays on your computer and is saved as a protected one-way hash.
          It is never displayed or sent by email.
        </p>
        <form action="/api/admin/setup" method="post">
          <label>
            New password
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              minLength={12}
              required
              autoFocus
            />
          </label>
          <label>
            Confirm password
            <input
              type="password"
              name="confirmation"
              autoComplete="new-password"
              minLength={12}
              required
            />
          </label>
          {error && (
            <p className="admin-login-error">
              Use at least 12 characters and make sure both entries match.
            </p>
          )}
          <button className="button button-dark" type="submit">
            Save password <span aria-hidden="true">→</span>
          </button>
        </form>
        <Link className="admin-login-back" href="/admin">← Back to dashboard</Link>
      </section>
    </main>
  );
}
