/**
 * 最新消息資料取得層
 * 供前台與後台共用，支援 localStorage 持久化
 */

import newsData from "@/data/news.json";
import { createStorageStore } from "@/lib/admin-storage";

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

const defaultNews = (newsData as News[]).sort(
  (a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
);

const store = createStorageStore<News[]>("news", defaultNews);

export function getNews(): News[] {
  return store
    .get()
    .slice()
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getNewsById(id: string): News | undefined {
  return (store.get() as News[]).find((n) => n.id === id || n.slug === id);
}

/** 依 slug 取得單則消息（與 getNewsById 通用） */
export function getNewsBySlug(slug: string): News | undefined {
  return getNewsById(slug);
}

export function getLatestNews(limit = 5): News[] {
  return getNews().slice(0, limit);
}

/** 後台 mock 儲存用，同步寫入 localStorage */
export function setNewsLocal(items: News[]): void {
  store.set(items);
}

/** 還原為預設值 */
export function resetNewsDefault(): void {
  store.reset();
}
