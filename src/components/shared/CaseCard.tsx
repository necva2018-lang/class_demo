import Link from "next/link";
import type { CaseStudy } from "@/lib/data/cases";
import type { CaseCategory } from "@/lib/data/cases";

const CASE_CATEGORY_LABELS: Record<string, string> = {
  employment: "就業案例",
  entrepreneurship: "創業案例",
  testimonial: "學員心得",
  portfolio: "作品展示",
  other: "其他",
};

function formatYearOrDate(c: CaseStudy): string {
  if (c.publishedAt) {
    return new Date(c.publishedAt).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
    });
  }
  return c.year ? `${c.year} 年` : "—";
}

interface CaseCardProps {
  caseItem: CaseStudy;
}

export function CaseCard({ caseItem }: CaseCardProps) {
  const categoryLabel =
    CASE_CATEGORY_LABELS[caseItem.category as CaseCategory] ??
    (caseItem.category as string) ??
    "成果案例";

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md ${
        caseItem.featured
          ? "border-amber-200 bg-amber-50/30"
          : "border-slate-200 group-hover:border-indigo-200"
      }`}
    >
      <Link href={`/cases/${caseItem.slug}`} className="flex flex-1 flex-col">
        <div className="aspect-[16/10] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
          {caseItem.image ? (
            <img
              src={caseItem.image}
              alt={caseItem.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm text-slate-500">成果案例</span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
              {categoryLabel}
            </span>
            {caseItem.featured && (
              <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                精選
              </span>
            )}
          </div>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-indigo-600">
            {caseItem.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
            {caseItem.summary}
          </p>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span>{formatYearOrDate(caseItem)}</span>
            {caseItem.courseName && (
              <span className="truncate max-w-[140px]">{caseItem.courseName}</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
