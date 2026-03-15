import Link from "next/link";
import type { News } from "@/lib/data/news";

const NEWS_TYPE_LABELS: Record<string, string> = {
  announcement: "招生公告",
  course: "課程消息",
  event: "活動資訊",
  other: "其他",
};

function formatDate(str: string): string {
  return new Date(str).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface NewsCardProps {
  news: News;
}

export function NewsCard({ news }: NewsCardProps) {
  const typeLabel = NEWS_TYPE_LABELS[news.type] ?? news.type;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md group-hover:border-indigo-200">
      <Link href={`/news/${news.slug}`} className="flex flex-1 flex-col">
        <div className="aspect-[16/10] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
          {news.image ? (
            <img
              src={news.image}
              alt={news.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm text-slate-500">最新消息</span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <span className="mb-2 inline-flex w-fit rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
            {typeLabel}
          </span>
          {news.featured && (
            <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              精選
            </span>
          )}
          <h3 className="mt-2 text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-indigo-600">
            {news.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
            {news.summary}
          </p>
          <p className="mt-4 text-sm text-slate-500">
            {formatDate(news.publishedAt)}
          </p>
        </div>
      </Link>
    </article>
  );
}
