import { AdminAboutForm } from "@/components/admin/about/AdminAboutForm";

export const dynamic = "force-dynamic";

export default function AdminAboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">關於我們管理</h2>
      <AdminAboutForm />
    </div>
  );
}
