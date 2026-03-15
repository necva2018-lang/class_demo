import type { Course } from '@/types';
import type { Category } from '@/types';
import coursesData from '@/data/courses.json';
import categoriesData from '@/data/categories.json';

/** 取得所有課程 */
export function getCourses(): Course[] {
  return coursesData as Course[];
}

/** 依 ID 取得單一課程 */
export function getCourseById(id: string): Course | undefined {
  return (coursesData as Course[]).find((c) => c.id === id || c.slug === id);
}

/** 依子分類取得課程 */
export function getCoursesByCategory(subCategorySlug: string): Course[] {
  return (coursesData as Course[]).filter((c) => c.subCategory === subCategorySlug);
}

/** 依主分類取得課程 */
export function getCoursesByMainCategory(mainCategory: "government" | "paid"): Course[] {
  return (coursesData as Course[]).filter((c) => c.mainCategory === mainCategory);
}

/** 取得精選課程 */
export function getFeaturedCourses(): Course[] {
  return (coursesData as Course[]).filter((c) => c.featured);
}

/** 取得所有分類 */
export function getCategories(): Category[] {
  return categoriesData as Category[];
}

/** 依 slug 取得分類 */
export function getCategoryBySlug(slug: string): Category | undefined {
  return (categoriesData as Category[]).find((c) => c.slug === slug);
}
