import { AdminSettingsForm } from "@/components/admin/settings/AdminSettingsForm";

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">網站設定</h2>
      <AdminSettingsForm />
    </div>
  );
}
