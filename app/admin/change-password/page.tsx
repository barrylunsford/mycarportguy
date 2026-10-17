import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/adminAuth";

export const metadata: Metadata = {
  title: "Change Admin Password",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ error?: string }> };

export default async function ChangeAdminPasswordPage({ searchParams }: Props) {
  if (!(await hasAdminSession())) redirect("/admin/login");
  const { error } = await searchParams;

  return (
    <main id="main-content" className="admin-login-page">
      <section className="admin-login-card">
        <Link href="/" className="admin-login-brand">My Carport Guy</Link>
        <p className="eyebrow"><span />Private dashboard</p>
        <h1>Choose a new password.</h1>
        <p>
          Use at least 12 characters. The password is converted to a protected
          one-way hash before it is saved. The plaintext password is never stored.
        </p>
        <form action="/api/admin/change-password" method="post">
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
            Save new password <span aria-hidden="true">→</span>
          </button>
        </form>
        <Link className="admin-login-back" href="/admin">← Back to dashboard</Link>
      </section>
    </main>
  );
}
