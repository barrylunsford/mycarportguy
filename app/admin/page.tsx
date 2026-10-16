import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/AdminDashboard";
import { canEditProducts, getProducts } from "@/lib/products";
import { hasAdminSession, isAdminConfigured } from "@/lib/adminAuth";
import { canManageQuotes, getQuoteLeads } from "@/lib/quotes";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAdminConfigured() && process.env.NODE_ENV === "production") {
    redirect("/admin/login");
  }
  if (isAdminConfigured() && !(await hasAdminSession())) redirect("/admin/login");
  const [products, quotes] = await Promise.all([
    getProducts({ includeHidden: true }),
    getQuoteLeads(),
  ]);
  return (
    <AdminDashboard
      initialProducts={products}
      initialQuotes={quotes}
      editable={canEditProducts() && canManageQuotes()}
      loginConfigured={isAdminConfigured()}
    />
  );
}
