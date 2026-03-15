import type { Course } from "@/types";
import type { Category } from "@/types";
import type { CourseOutlineItem, CourseFaqItem } from "@/types/course";
import coursesData from "@/data/courses.json";
import categoriesData from "@/data/categories.json";
import { createStorageStore } from "@/lib/admin-storage";

const defaultCourses = coursesData as Course[];
const defaultCategories = categoriesData as Category[];
const coursesStore = createStorageStore<Course[]>("courses", defaultCourses);
const categoriesStore = createStorageStore<Category[]>("categories", defaultCategories);

/** 取得所有課程 */
export function getCourses(): Course[] {
  return coursesStore.get();
}

/** 依 ID 取得單一課程 */
export function getCourseById(id: string): Course | undefined {
  return coursesStore.get().find((c) => c.id === id || c.slug === id);
}

/** 依子分類取得課程 */
export function getCoursesByCategory(subCategorySlug: string): Course[] {
  return coursesStore.get().filter((c) => c.subCategory === subCategorySlug);
}

/** 依主分類取得課程 */
export function getCoursesByMainCategory(mainCategory: "government" | "paid"): Course[] {
  return coursesStore.get().filter((c) => c.mainCategory === mainCategory);
}

/** 取得精選課程 */
export function getFeaturedCourses(): Course[] {
  return coursesStore.get().filter((c) => c.featured);
}

/** 後台 mock 儲存用，同步寫入 localStorage */
export function setCoursesLocal(courses: Course[]): void {
  coursesStore.set(courses);
}

/** 還原為預設值 */
export function resetCoursesDefault(): void {
  coursesStore.reset();
}

/** 取得所有分類 */
export function getCategories(): Category[] {
  return categoriesStore.get();
}

/** 依 slug 取得分類 */
export function getCategoryBySlug(slug: string): Category | undefined {
  return categoriesStore.get().find((c) => c.slug === slug);
}

/** 後台 mock 儲存用，同步寫入 localStorage */
export function setCategoriesLocal(categories: Category[]): void {
  categoriesStore.set(categories);
}

/** 還原為預設值 */
export function resetCategoriesDefault(): void {
  categoriesStore.reset();
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
