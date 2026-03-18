import newsData from "@/data/news.json";
import { getAppConfig, resetAppConfig, setAppConfig } from "@/lib/config-store";

export interface News {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content?: string;
  type: string;
  publishedAt: string;
  /** 封面圖 URL */
  image?: string;
  /** 是否精選 */
  featured?: boolean;
  /** SEO 自訂標題 */
  seoTitle?: string;
  /** SEO 自訂描述 */
  seoDescription?: string;
}

export const NEWS_FALLBACK: News[] = (newsData as News[]).sort(
  (a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
);
const KEY = "news";

export async function getNews(): Promise<News[]> {
  const items = await getAppConfig<News[]>(KEY, NEWS_FALLBACK);
  return items
    .slice()
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export async function getNewsById(id: string): Promise<News | undefined> {
  return (await getNews()).find((n) => n.id === id || n.slug === id);
}

/** 依 slug 取得單則消息（與 getNewsById 通用） */
export async function getNewsBySlug(slug: string): Promise<News | undefined> {
  return await getNewsById(slug);
}

export async function getLatestNews(limit = 5): Promise<News[]> {
  return (await getNews()).slice(0, limit);
}

export async function setNews(items: News[]): Promise<void> {
  await setAppConfig(KEY, items);
}

export async function resetNewsDefault(): Promise<void> {
  await resetAppConfig(KEY);
}
