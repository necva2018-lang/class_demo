"use client";

import { useState, useMemo } from "react";
import type { Course, Category } from "@/types";
import { SUB_CATEGORY_LABELS, MAIN_CATEGORY_LABELS } from "@/types/course";
import { CourseCard, CourseFilter } from "@/components/course";
import { EmptyState } from "@/components/shared";

interface CoursesPageClientProps {
  courses: Course[];
  categories: Category[];
  currentCategory?: string;
}

function filterCoursesByKeyword(courses: Course[], keyword: string): Course[] {
  if (!keyword.trim()) return courses;
  const lower = keyword.toLowerCase().trim();
  return courses.filter(
    (c) =>
      c.title.toLowerCase().includes(lower) ||
      c.summary.toLowerCase().includes(lower) ||
      c.description?.toLowerCase().includes(lower) ||
      SUB_CATEGORY_LABELS[c.subCategory]?.toLowerCase().includes(lower) ||
      MAIN_CATEGORY_LABELS[c.mainCategory]?.toLowerCase().includes(lower) ||
      c.targetAudience?.some((a) => a.toLowerCase().includes(lower)) ||
      c.location?.toLowerCase().includes(lower) ||
      c.tags?.some((t) => t.toLowerCase().includes(lower)) ||
      c.features?.some((f) => f.toLowerCase().includes(lower))
  );
}

export function CoursesPageClient({
  courses,
  categories,
  currentCategory,
}: CoursesPageClientProps) {
  const [keyword, setKeyword] = useState("");

  const filteredCourses = useMemo(
    () => filterCoursesByKeyword(courses, keyword),
    [courses, keyword]
  );

  return (
    <>
      <CourseFilter
        categories={categories}
        currentCategory={currentCategory}
        keyword={keyword}
        onKeywordChange={setKeyword}
      />

      <div className="mt-6">
        <p className="mb-4 text-sm text-slate-600">
          共 {filteredCourses.length} 門課程
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <EmptyState
              description={
                keyword
                  ? `找不到符合「${keyword}」的課程，請試試其他關鍵字或分類`
                  : "目前沒有符合條件的課程"
              }
              action={!keyword ? { href: "/courses", label: "瀏覽全部課程" } : undefined}
              className="col-span-full"
            />
          )}
        </div>
      </div>
    </>
  );
}
