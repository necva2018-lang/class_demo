import casesData from "@/data/cases.json";
import { getAppConfig, resetAppConfig, setAppConfig } from "@/lib/config-store";

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

export const CASES_FALLBACK: CaseStudy[] = [...(casesData as CaseStudy[])].sort(
  (a, b) =>
    new Date(toSortDate(b)).getTime() - new Date(toSortDate(a)).getTime()
);
const KEY = "cases";

export async function getCases(): Promise<CaseStudy[]> {
  const items = await getAppConfig<CaseStudy[]>(KEY, CASES_FALLBACK);
  return items
    .slice()
    .sort(
      (a, b) =>
        new Date(toSortDate(b)).getTime() - new Date(toSortDate(a)).getTime()
    );
}

export async function getCaseById(id: string): Promise<CaseStudy | undefined> {
  return (await getCases()).find((c) => c.id === id || c.slug === id);
}

/** 依 slug 取得單筆案例（與 getCaseById 通用） */
export async function getCaseBySlug(slug: string): Promise<CaseStudy | undefined> {
  return await getCaseById(slug);
}

export async function setCases(items: CaseStudy[]): Promise<void> {
  await setAppConfig(KEY, items);
}

export async function resetCasesDefault(): Promise<void> {
  await resetAppConfig(KEY);
}
