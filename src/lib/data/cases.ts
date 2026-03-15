/**
 * 成果案例資料取得層
 * 供前台與後台共用，支援 localStorage 持久化
 */

import casesData from "@/data/cases.json";
import { createStorageStore } from "@/lib/admin-storage";

/** 成果案例分類 */
export type CaseCategory =
  | "employment"
  | "entrepreneurship"
  | "testimonial"
  | "portfolio"
  | "other";

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content?: string;
  courseName?: string;
  year?: number;
  metrics?: { label: string; value: string | number }[];
  publishedAt?: string;
  /** 分類：就業案例/創業案例/學員心得/作品展示 */
  category?: CaseCategory | string;
  /** 封面圖 URL */
  image?: string;
  /** 是否精選 */
  featured?: boolean;
  /** SEO 自訂標題 */
  seoTitle?: string;
  /** SEO 自訂描述 */
  seoDescription?: string;
}

function toSortDate(c: CaseStudy): string {
  if (c.publishedAt) return c.publishedAt;
  if (c.year) return `${c.year}-01-01`;
  return "1970-01-01";
}

const defaultCases = [...(casesData as CaseStudy[])].sort(
  (a, b) =>
    new Date(toSortDate(b)).getTime() - new Date(toSortDate(a)).getTime()
);

const store = createStorageStore<CaseStudy[]>("cases", defaultCases);

export function getCases(): CaseStudy[] {
  return store
    .get()
    .slice()
    .sort(
      (a, b) =>
        new Date(toSortDate(b)).getTime() - new Date(toSortDate(a)).getTime()
    );
}

export function getCaseById(id: string): CaseStudy | undefined {
  return (store.get() as CaseStudy[]).find(
    (c) => c.id === id || c.slug === id
  );
}

/** 依 slug 取得單筆案例（與 getCaseById 通用） */
export function getCaseBySlug(slug: string): CaseStudy | undefined {
  return getCaseById(slug);
}

/** 後台 mock 儲存用，同步寫入 localStorage */
export function setCasesLocal(items: CaseStudy[]): void {
  store.set(items);
}

/** 還原為預設值 */
export function resetCasesDefault(): void {
  store.reset();
}
