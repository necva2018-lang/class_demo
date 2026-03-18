import type { Metadata } from "next";
import { Suspense } from "react";
import { getCourses, getCategories } from "@/lib/data/courses";
import { CoursesPageClient } from "./CoursesPageClient";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "課程總覽",
  description:
    "瀏覽所有職訓課程，包含政府補助與自費課程。依職前訓練、在職訓練、證照課程、推廣課程分類篩選，找到最適合您的培訓方案。",
  path: "/courses",
});

export default function CoursesPage() {
  const courses = getCourses();
  const categories = getCategories();

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

      <Suspense fallback={<div className="mt-6 text-slate-500">載入中...</div>}>
        <CoursesPageClient courses={courses} categories={categories} />
      </Suspense>
    </div>
  );
}
