import Link from "next/link";
import type { CategoryCardProps } from "@/components/types";

export function CategoryCard({
  title,
  description,
  href,
  tags = [],
  className = "",
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className={`group block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md ${className}`}
    >
      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <span className="mt-3 inline-block text-sm font-medium text-indigo-600">
        查看課程 →
      </span>
    </Link>
  );
}
