/**
 * 後台 Dashboard 統計資料
 * 從既有 data 彙總
 */

import { getCourses } from "./courses";
import { getNews } from "./news";
import { getCases } from "./cases";
import faqData from "@/data/faq.json";

export interface AdminStats {
  totalCourses: number;
  openCourses: number;
  featuredCourses: number;
  totalNews: number;
  totalFaq: number;
  totalCases: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const courses = await getCourses();
  const news = await getNews();
  const cases = await getCases();
  const faqCount = Array.isArray(faqData) ? faqData.length : 0;

  return {
    totalCourses: courses.length,
    openCourses: courses.filter((c) => c.status === "open").length,
    featuredCourses: courses.filter((c) => c.featured).length,
    totalNews: news.length,
    totalFaq: faqCount,
    totalCases: cases.length,
  };
}

export interface RecentUpdate {
  id: string;
  type: "course" | "news" | "case";
  title: string;
  updatedAt: string;
  href: string;
  /** 前台預覽用，課程用 slug */
  previewHref?: string;
}

export async function getRecentUpdates(limit = 5): Promise<RecentUpdate[]> {
  const courses = await getCourses();
  const news = await getNews();
  const cases = await getCases();

  const items: RecentUpdate[] = [
    ...courses.slice(0, 3).map((c) => ({
      id: c.id,
      type: "course" as const,
      title: c.title,
      updatedAt: (c as { updatedAt?: string }).updatedAt ?? c.startDate,
      href: `/admin/courses/${c.id}`,
      previewHref: `/courses/${c.slug}`,
    })),
    ...news.slice(0, 3).map((n) => ({
      id: n.id,
      type: "news" as const,
      title: n.title,
      updatedAt: n.publishedAt,
      href: `/admin/news/${n.id}`,
    })),
    ...cases.slice(0, 3).map((c) => ({
      id: c.id,
      type: "case" as const,
      title: c.title,
      updatedAt: c.publishedAt ?? `${c.year ?? new Date().getFullYear()}-01-01`,
      href: `/admin/stories/${c.id}`,
    })),
  ];

  return items
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}
