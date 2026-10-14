import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/AdminDashboard";
import { canEditProducts, getProducts } from "@/lib/products";
import { hasAdminSession, isAdminConfigured } from "@/lib/adminAuth";

export const metadata: Metadata = {
  title: "Product Manager",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAdminConfigured() && process.env.NODE_ENV === "production") {
    redirect("/admin/login");
  }
  if (isAdminConfigured() && !(await hasAdminSession())) redirect("/admin/login");
  const products = await getProducts({ includeHidden: true });
  return (
    <AdminDashboard
      initialProducts={products}
      editable={canEditProducts()}
      loginConfigured={isAdminConfigured()}
    />
  );
}
