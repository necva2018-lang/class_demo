import type { Metadata } from "next";
import { getNews } from "@/lib/data/news";
import { NewsPageClient } from "./NewsPageClient";
import { PageHero } from "@/components/shared/PageHero";
import { createMetadataWithConfig, getEffectiveSeoConfigAsync } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getEffectiveSeoConfigAsync();
  return createMetadataWithConfig(config, {
    title: "最新消息",
    description: "職訓課程公告與活動資訊",
    path: "/news",
  });
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <PageHero
        title="最新消息"
        description="職訓課程公告、活動資訊與招生消息"
      />
      <NewsPageClient news={news} />
    </div>
  );
}
