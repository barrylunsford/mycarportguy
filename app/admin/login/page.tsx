import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { hasAdminSession, isAdminConfigured } from "@/lib/adminAuth";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  if (await hasAdminSession()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <main id="main-content" className="admin-login-page">
      <section className="admin-login-card">
        <Link href="/" className="admin-login-brand">My Carport Guy</Link>
        <p className="eyebrow"><span />Private dashboard</p>
        <h1>Welcome back.</h1>
        <p>Sign in to manage products, design links, and quote requests.</p>
        {!isAdminConfigured() ? (
          <div className="admin-login-error">
            Admin login is not configured yet.
            {process.env.NODE_ENV !== "production" && (
              <><br /><Link href="/admin/setup">Create your private password</Link></>
            )}
          </div>
        ) : (
          <form action="/api/admin/login" method="post">
            <label>
              Admin password
              <input type="password" name="password" autoComplete="current-password" required autoFocus />
            </label>
            {error && <p className="admin-login-error">That password was not correct.</p>}
            <button className="button button-dark" type="submit">Sign in <span aria-hidden="true">→</span></button>
          </form>
        )}
        <Link className="admin-login-back" href="/">← Back to website</Link>
      </section>
    </main>
  );
}
