import { AdminSeoForm } from "@/components/admin/seo/AdminSeoForm";

export default function AdminSeoPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">SEO 設定</h2>
      <AdminSeoForm />
    </div>
  );
}
