import { getFaqItems, getFaqCategories } from "@/lib/data/faq";
import { AdminFaqList } from "@/components/admin/faqs/AdminFaqList";

export default function AdminFaqsPage() {
  const items = getFaqItems();
  const categories = getFaqCategories();

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
