import type { Metadata } from "next";
import {
  getCourses,
  getCoursesByCategory,
  getCategories,
} from "@/lib/data/courses";
import { CoursesPageClient } from "./CoursesPageClient";
import { createMetadata } from "@/lib/seo";

interface CoursesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export const metadata: Metadata = createMetadata({
  title: "課程總覽",
  description:
    "瀏覽所有職訓課程，包含政府補助與自費課程。依職前訓練、在職訓練、證照課程、推廣課程分類篩選，找到最適合您的培訓方案。",
  path: "/courses",
});

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;
  const category = params.category;
  const categories = getCategories();

  const courses = category
    ? getCoursesByCategory(category)
    : getCourses();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Page Header */}
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          課程總覽
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          依課程類型、地區、時數篩選，或輸入關鍵字快速找到符合您需求的職訓課程
        </p>
      </header>

      {/* Filter + Course List (Client) */}
      <CoursesPageClient
        courses={courses}
        categories={categories}
        currentCategory={category}
      />
    </div>
  );
}
