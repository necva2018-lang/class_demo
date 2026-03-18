import { getNews } from "@/lib/data/news";
import { AdminNewsList } from "@/components/admin/news/AdminNewsList";

export default async function AdminNewsPage() {
  const news = await getNews();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">最新消息管理</h2>
      <AdminNewsList items={news} />
    </div>
  );
}
