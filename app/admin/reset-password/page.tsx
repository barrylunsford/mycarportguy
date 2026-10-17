import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Choose New Admin Password",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ token?: string; error?: string }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token = "", error } = await searchParams;
  return (
    <main id="main-content" className="admin-login-page">
      <section className="admin-login-card">
        <Link href="/" className="admin-login-brand">My Carport Guy</Link>
        <p className="eyebrow"><span />Secure password reset</p>
        <h1>Choose a new password.</h1>
        <p>Use at least 12 characters. Saving it will immediately invalidate this reset link.</p>
        {!token ? (
          <div className="admin-login-error">This reset link is missing or invalid.</div>
        ) : (
          <form action="/api/admin/reset-password" method="post">
            <input type="hidden" name="token" value={token} />
            <label>New password<input type="password" name="password" autoComplete="new-password" minLength={12} required autoFocus /></label>
            <label>Confirm password<input type="password" name="confirmation" autoComplete="new-password" minLength={12} required /></label>
            {error && <p className="admin-login-error">The link expired, was already used, or the passwords did not match. Request a new reset link and try again.</p>}
            <button className="button button-dark" type="submit">Save new password <span aria-hidden="true">→</span></button>
          </form>
        )}
        <Link className="admin-login-back" href="/admin/forgot-password">← Request another link</Link>
      </section>
    </main>
  );
}
