import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCaseBySlug } from "@/lib/data/cases";
import { ContentMeta } from "@/components/shared/ContentMeta";
import { createMetadata } from "@/lib/seo";
import type { CaseCategory } from "@/lib/data/cases";

const CASE_CATEGORY_LABELS: Record<string, string> = {
  employment: "就業案例",
  entrepreneurship: "創業案例",
  testimonial: "學員心得",
  portfolio: "作品展示",
  other: "其他",
};

interface CaseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const { getCases } = require("@/lib/data/cases");
  return getCases().map((c: { slug: string }) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: CaseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseItem = getCaseBySlug(slug);
  if (!caseItem) return { title: "案例不存在" };
  return createMetadata({
    title: caseItem.seoTitle ?? caseItem.title,
    description: caseItem.seoDescription ?? caseItem.summary,
    path: `/cases/${slug}`,
    image: caseItem.image,
    type: "article",
  });
}

export default async function CaseDetailPage({
  params,
}: CaseDetailPageProps) {
  const { slug } = await params;
  const caseItem = getCaseBySlug(slug);
  if (!caseItem) notFound();

  const categoryLabel =
    CASE_CATEGORY_LABELS[caseItem.category as CaseCategory] ??
    (caseItem.category as string) ??
    "成果案例";

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-700">
          首頁
        </Link>
        <span className="mx-2">/</span>
        <Link href="/cases" className="hover:text-slate-700">
          成果案例
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{caseItem.title}</span>
      </nav>

      <article>
        <header className="mb-8">
          <ContentMeta
            type={categoryLabel}
            date={caseItem.publishedAt}
            year={caseItem.year}
            extra={caseItem.courseName}
            className="mb-3"
          />
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {caseItem.title}
          </h1>
          <p className="mt-4 text-lg text-slate-600">{caseItem.summary}</p>
        </header>

        {caseItem.image && (
          <div className="mb-8 aspect-video overflow-hidden rounded-xl bg-slate-200">
            <img
              src={caseItem.image}
              alt={caseItem.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {caseItem.content && (
          <div className="prose prose-slate max-w-none rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
              {caseItem.content}
            </div>
          </div>
        )}

        {caseItem.metrics && caseItem.metrics.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-slate-900">關鍵數據</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {caseItem.metrics.map((m, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-sm font-medium text-slate-500">{m.label}</p>
                  <p className="mt-1 text-xl font-bold text-indigo-600">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
