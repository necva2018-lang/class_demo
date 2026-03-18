import Link from "next/link";
import { getAdminStats, getRecentUpdates } from "@/lib/data/admin";
import {
  AdminCard,
  AdminTable,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
} from "@/components/admin";

const TYPE_LABELS = {
  course: "課程",
  news: "消息",
  case: "案例",
} as const;

function formatDate(str: string) {
  const d = new Date(str);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) return "今天";
  if (diff < 172800000) return "昨天";
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`;
  return d.toLocaleDateString("zh-TW");
}

export default function AdminDashboardPage() {
  const stats = getAdminStats();
  const recent = getRecentUpdates(5);

  const statCards = [
    { label: "課程總數", value: stats.totalCourses, href: "/admin/courses" },
    { label: "招生中", value: stats.openCourses, href: "/admin/courses" },
    { label: "精選課程", value: stats.featuredCourses, href: "/admin/courses" },
    { label: "最新消息", value: stats.totalNews, href: "/admin/news" },
    { label: "FAQ", value: stats.totalFaq, href: "/admin/faqs" },
    { label: "成果案例", value: stats.totalCases, href: "/admin/stories" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">歡迎回來</h2>
        <p className="mt-1 text-slate-500">
          以下是網站內容的總覽與最近更新
        </p>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <AdminCard className="cursor-pointer transition-shadow hover:shadow-md">
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {card.value}
              </p>
            </AdminCard>
          </Link>
        ))}
      </div>

      {/* 快速操作 */}
      <AdminCard title="快速操作">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            新增課程
          </Link>
          <Link
            href="/admin/news/new"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            新增消息
          </Link>
          <Link
            href="/admin/stories/new"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            新增案例
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            前往設定
          </Link>
        </div>
      </AdminCard>

      {/* 最近更新 */}
      <AdminCard title="最近更新">
        {recent.length > 0 ? (
          <AdminTable>
            <AdminTableHead>
              <AdminTableHeaderCell>類型</AdminTableHeaderCell>
              <AdminTableHeaderCell>標題</AdminTableHeaderCell>
              <AdminTableHeaderCell>更新時間</AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-right">操作</AdminTableHeaderCell>
            </AdminTableHead>
            <AdminTableBody>
              {recent.map((item) => (
                <AdminTableRow key={`${item.type}-${item.id}`}>
                  <AdminTableCell>{TYPE_LABELS[item.type]}</AdminTableCell>
                  <AdminTableCell>{item.title}</AdminTableCell>
                  <AdminTableCell>{formatDate(item.updatedAt)}</AdminTableCell>
                  <AdminTableCell className="text-right">
                    <Link
                      href={item.href}
                      className="text-primary-600 hover:underline"
                    >
                      編輯
                    </Link>
                    <span className="mx-2 text-slate-300">|</span>
                    {item.previewHref ? (
                      <a
                        href={item.previewHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        預覽
                      </a>
                    ) : (
                      <span className="text-slate-400">預覽</span>
                    )}
                  </AdminTableCell>
                </AdminTableRow>
              ))}
            </AdminTableBody>
          </AdminTable>
        ) : (
          <p className="py-8 text-center text-slate-500">尚無更新</p>
        )}
      </AdminCard>
    </div>
  );
}
