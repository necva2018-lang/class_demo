"use client";

import { useState, useMemo } from "react";
import type { News } from "@/lib/data/news";
import { NewsCard, FilterTabs, EmptyState } from "@/components/shared";

const NEWS_TYPE_OPTIONS = [
  { value: "announcement", label: "招生公告" },
  { value: "course", label: "課程消息" },
  { value: "event", label: "活動資訊" },
  { value: "other", label: "其他" },
];

interface NewsPageClientProps {
  news: News[];
}

export function NewsPageClient({ news }: NewsPageClientProps) {
  const [typeFilter, setTypeFilter] = useState("");

  const filteredNews = useMemo(() => {
    if (!typeFilter) return news;
    return news.filter((n) => n.type === typeFilter);
  }, [news, typeFilter]);

  return (
    <>
      <FilterTabs
        options={NEWS_TYPE_OPTIONS}
        value={typeFilter}
        onChange={setTypeFilter}
        allLabel="全部"
        className="mb-6"
      />

      <div className="mt-6">
        <p className="mb-4 text-sm text-slate-600">
          共 {filteredNews.length} 則消息
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNews.length > 0 ? (
            filteredNews.map((item) => <NewsCard key={item.id} news={item} />)
          ) : (
            <EmptyState
              title="尚無消息"
              description={
                typeFilter
                  ? "目前沒有此類型的消息"
                  : "目前沒有任何最新消息"
              }
              action={
                !typeFilter
                  ? undefined
                  : { href: "/news", label: "檢視全部" }
              }
              className="col-span-full"
            />
          )}
        </div>
      </div>
    </>
  );
}
