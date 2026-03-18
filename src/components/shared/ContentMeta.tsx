interface ContentMetaProps {
  /** 類型或分類標籤 */
  type?: string;
  /** 日期字串（ISO 或 YYYY-MM-DD） */
  date?: string;
  /** 年份（備選） */
  year?: number;
  /** 額外資訊（如課程名稱） */
  extra?: string;
  className?: string;
}

function formatDate(str: string): string {
  return new Date(str).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ContentMeta({
  type,
  date,
  year,
  extra,
  className,
}: ContentMetaProps) {
  const dateText = date ? formatDate(date) : year ? `${year} 年` : null;

  return (
    <div
      className={`flex flex-wrap items-center gap-3 text-sm text-slate-600 ${className ?? ""}`}
    >
      {type && (
        <span className="inline-flex rounded-full bg-indigo-100 px-2.5 py-0.5 font-medium text-indigo-700">
          {type}
        </span>
      )}
      {dateText && <time>{dateText}</time>}
      {extra && <span className="text-slate-500">{extra}</span>}
    </div>
  );
}
