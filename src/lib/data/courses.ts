import type { Course } from "@/types";
import type { Category } from "@/types";
import type { CourseOutlineItem, CourseFaqItem } from "@/types/course";
import coursesData from "@/data/courses.json";
import categoriesData from "@/data/categories.json";
import { getAppConfig, resetAppConfig, setAppConfig } from "@/lib/config-store";

export const COURSES_FALLBACK = coursesData as Course[];
export const CATEGORIES_FALLBACK = categoriesData as Category[];
const COURSES_KEY = "courses";
const CATEGORIES_KEY = "categories";

/** 取得所有課程 */
export async function getCourses(): Promise<Course[]> {
  return await getAppConfig<Course[]>(COURSES_KEY, COURSES_FALLBACK);
}

/** 依 ID 取得單一課程 */
export async function getCourseById(id: string): Promise<Course | undefined> {
  return (await getCourses()).find((c) => c.id === id || c.slug === id);
}

/** 依子分類取得課程 */
export async function getCoursesByCategory(subCategorySlug: string): Promise<Course[]> {
  return (await getCourses()).filter((c) => c.subCategory === subCategorySlug);
}

/** 依主分類取得課程 */
export async function getCoursesByMainCategory(mainCategory: "government" | "paid"): Promise<Course[]> {
  return (await getCourses()).filter((c) => c.mainCategory === mainCategory);
}

/** 取得精選課程 */
export async function getFeaturedCourses(): Promise<Course[]> {
  return (await getCourses()).filter((c) => c.featured);
}

export async function setCourses(courses: Course[]): Promise<void> {
  await setAppConfig(COURSES_KEY, courses);
}

/** 還原為預設值 */
export async function resetCoursesDefault(): Promise<void> {
  await resetAppConfig(COURSES_KEY);
}

/** 取得所有分類 */
export async function getCategories(): Promise<Category[]> {
  return await getAppConfig<Category[]>(CATEGORIES_KEY, CATEGORIES_FALLBACK);
}

/** 依 slug 取得分類 */
export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return (await getCategories()).find((c) => c.slug === slug);
}

export async function setCategories(categories: Category[]): Promise<void> {
  await setAppConfig(CATEGORIES_KEY, categories);
}

/** 還原為預設值 */
export async function resetCategoriesDefault(): Promise<void> {
  await resetAppConfig(CATEGORIES_KEY);
}

/** 建立空白課程（新增用） */
export function getEmptyCourse(): Omit<Course, "id"> & { id?: string } {
  return {
    id: "",
    slug: "",
    title: "",
    mainCategory: "government",
    subCategory: "job-preparation",
    tags: [],
    summary: "",
    description: "",
    targetAudience: [],
    features: [],
    outline: [] as CourseOutlineItem[],
    location: "",
    hours: 0,
    quota: 0,
    status: "coming",
    startDate: "",
    endDate: "",
    image: "",
    applyUrl: "",
    faq: [] as CourseFaqItem[],
    featured: false,
  };
}
