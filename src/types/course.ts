/**
 * 課程資料模型 v2 - 可擴充結構
 * 用於 mock、API、CMS 統一對接
 */

/** 主分類：政府補助課程 / 自費課程 */
export type CourseMainCategory = "government" | "paid";

/** 子分類：職前訓練 / 在職訓練 / 專班課程 / 證照課程 / 推廣課程 */
export type CourseSubCategory =
  | "job-preparation"
  | "in-service"
  | "special-class"
  | "certification"
  | "promotion";

/** 課程狀態 */
export type CourseStatus = "open" | "full" | "closed" | "coming";

/** 課程大綱單元 */
export interface CourseOutlineItem {
  unit: number;
  title: string;
  content: string;
}

/** 常見問題項目 */
export interface CourseFaqItem {
  question: string;
  answer: string;
}

/** 主分類與子分類對應（供轉換用） */
export const MAIN_CATEGORY_LABELS: Record<CourseMainCategory, string> = {
  government: "政府補助課程",
  paid: "自費課程",
};

export const SUB_CATEGORY_LABELS: Record<CourseSubCategory, string> = {
  "job-preparation": "職前訓練",
  "in-service": "在職訓練",
  "special-class": "專班課程",
  certification: "證照課程",
  promotion: "推廣課程",
};

/**
 * 課程資料模型
 * 欄位設計便於未來對接 CMS / REST API / GraphQL
 */
export interface Course {
  id: string;
  slug: string;
  title: string;
  mainCategory: CourseMainCategory;
  subCategory: CourseSubCategory;
  tags: string[];
  summary: string;
  description: string;
  targetAudience: string[];
  features: string[];
  outline: CourseOutlineItem[];
  location: string;
  hours: number;
  quota: number;
  status: CourseStatus;
  startDate: string;
  endDate: string;
  image: string;
  applyUrl: string;
  faq: CourseFaqItem[];
  featured: boolean;

  /** 以下為可選擴充欄位，接 API 時依後端 schema 新增 */
  enrolled?: number;
  fee?: number;
  subsidy?: number;
  subsidyNote?: string;
  schedule?: string;
  instructors?: { id: string; name: string; title: string; bio: string }[];
  createdAt?: string;
  updatedAt?: string;
}

/** 課程篩選參數（供 API 查詢用） */
export interface CourseFilterParams {
  mainCategory?: CourseMainCategory;
  subCategory?: CourseSubCategory;
  status?: CourseStatus;
  featured?: boolean;
  keyword?: string;
}
