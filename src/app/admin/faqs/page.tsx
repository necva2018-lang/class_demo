import { getFaqItems, getFaqCategories } from "@/lib/data/faq";
import { AdminFaqList } from "@/components/admin/faqs/AdminFaqList";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  const items = await getFaqItems();
  const categories = await getFaqCategories();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">FAQ 管理</h2>
      <AdminFaqList
        items={items}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
