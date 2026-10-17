import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reset Admin Password",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ sent?: string; error?: string }> };

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { sent, error } = await searchParams;
  return (
    <main id="main-content" className="admin-login-page">
      <section className="admin-login-card">
        <Link href="/" className="admin-login-brand">My Carport Guy</Link>
        <p className="eyebrow"><span />Private dashboard</p>
        <h1>Reset your password.</h1>
        <p>We&apos;ll email a secure, 30-minute reset link to the business inbox.</p>
        {sent ? (
          <div className="admin-login-success" role="status">
            Check sales@mycarportguy.com for the reset link. You can close this page after the email arrives.
          </div>
        ) : (
          <form action="/api/admin/forgot-password" method="post">
            <input className="admin-honeypot" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button className="button button-dark" type="submit">Email reset link <span aria-hidden="true">→</span></button>
            {error && <p className="admin-login-error">The reset email could not be sent. Please wait a few minutes and try again.</p>}
          </form>
        )}
        <Link className="admin-login-back" href="/admin/login">← Back to sign in</Link>
      </section>
    </main>
  );
}
