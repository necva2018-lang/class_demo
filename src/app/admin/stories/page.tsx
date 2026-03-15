import { getCases } from "@/lib/data/cases";
import { AdminStoriesList } from "@/components/admin/stories/AdminStoriesList";

export default function AdminStoriesPage() {
  const cases = getCases();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">成果案例管理</h2>
      <AdminStoriesList items={cases} />
    </div>
  );
}
