import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNewsBySlug } from "@/lib/data/news";
import { ContentMeta } from "@/components/shared/ContentMeta";
import { createMetadata } from "@/lib/seo";

const NEWS_TYPE_LABELS: Record<string, string> = {
  announcement: "招生公告",
  course: "課程消息",
  event: "活動資訊",
  other: "其他",
};

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const { getNews } = require("@/lib/data/news");
  return getNews().map((n: { slug: string }) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = getNewsBySlug(slug);
  if (!news) return { title: "消息不存在" };

  return createMetadata({
    title: news.seoTitle ?? news.title,
    description: news.seoDescription ?? news.summary,
    path: `/news/${slug}`,
    image: news.image,
    type: "article",
    publishedTime: news.publishedAt,
  });
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const news = getNewsBySlug(slug);

  if (!news) notFound();

  const typeLabel = NEWS_TYPE_LABELS[news.type] ?? news.type;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-700">首頁</Link>
        <span className="mx-2">/</span>
        <Link href="/news" className="hover:text-slate-700">最新消息</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{news.title}</span>
      </nav>

      <article>
        <header className="mb-8">
          <ContentMeta type={typeLabel} date={news.publishedAt} />
          <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            {news.title}
          </h1>
          <p className="mt-4 text-lg text-slate-600">{news.summary}</p>
        </header>

        {news.image && (
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={news.image}
              alt={news.title}
              className="w-full object-cover"
            />
          </div>
        )}

        {news.content && (
          <div className="prose prose-slate max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
              {news.content}
            </div>
          </div>
        )}

        {!news.content && (
          <p className="text-slate-600">{news.summary}</p>
        )}
      </article>
    </div>
  );
}
