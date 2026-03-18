# 課程資料模型 — CMS / API 銜接指南

> 版本：v1.0 | 依據：`src/types/course.ts`

---

## 1. 資料模型總覽

### 1.1 必要欄位

| 欄位 | 型別 | 說明 |
|------|------|------|
| `id` | string | 唯一識別碼 |
| `slug` | string | URL 友善識別，如 `web-development-bootcamp` |
| `title` | string | 課程名稱 |
| `mainCategory` | `"government"` \| `"paid"` | 主分類 |
| `subCategory` | slug | 子分類，見下方對照表 |
| `tags` | string[] | 標籤 |
| `summary` | string | 摘要（列表顯示用） |
| `description` | string | 完整介紹 |
| `targetAudience` | string[] | 適合對象 |
| `features` | string[] | 課程特色 |
| `outline` | CourseOutlineItem[] | 課程大綱 |
| `location` | string | 上課地點 |
| `hours` | number | 總時數 |
| `quota` | number | 招生名額 |
| `status` | `"open"` \| `"full"` \| `"closed"` \| `"coming"` | 報名狀態 |
| `startDate` | string | 開課日期（建議 ISO 8601） |
| `endDate` | string | 結訓日期 |
| `image` | string | 封面圖 URL |
| `applyUrl` | string | 報名連結 |
| `faq` | CourseFaqItem[] | 常見問題 |
| `featured` | boolean | 是否精選 |

### 1.2 子分類對照（subCategory）

| slug | 顯示名稱 |
|------|----------|
| `job-preparation` | 職前訓練 |
| `in-service` | 在職訓練 |
| `special-class` | 專班課程 |
| `certification` | 證照課程 |
| `promotion` | 推廣課程 |

### 1.3 擴充欄位（可選）

| 欄位 | 型別 | 說明 |
|------|------|------|
| `enrolled` | number | 已報名人數 |
| `fee` | number | 原價 |
| `subsidy` | number | 補助金額 |
| `subsidyNote` | string | 補助說明 |
| `schedule` | string | 上課時段 |
| `instructors` | Instructor[] | 師資 |
| `createdAt` | string | 建立時間 |
| `updatedAt` | string | 更新時間 |

---

## 2. 改接 CMS 的方式

### 2.1 Headless CMS（Strapi、Sanity、Contentful）

**Content Type 建議：**

- **course**：對應 `Course`，每個欄位建立對應欄位型別
- 關聯：`instructors` 可為另一 Content Type
- 單選：`mainCategory`、`subCategory`、`status` 用 Enum

**取數流程：**

```
CMS API → 轉換層 (lib/api/cms-adapter.ts) → Course[]
```

**範例轉換函式：**

```typescript
// lib/api/cms-adapter.ts
import type { Course } from "@/types";

interface CmsCourseResponse {
  id: string;
  slug: string;
  title: string;
  main_category: string;  // 依 CMS 命名
  sub_category: string;
  // ... 其他欄位
}

export function cmsToCourse(raw: CmsCourseResponse): Course {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    mainCategory: raw.main_category as Course["mainCategory"],
    subCategory: raw.sub_category as Course["subCategory"],
    // ... 逐一對應
  };
}
```

### 2.2 REST API

**建議端點：**

| 方法 | 路徑 | 用途 |
|------|------|------|
| GET | `/api/courses` | 列表，支援 query：`mainCategory`, `subCategory`, `status`, `featured`, `keyword` |
| GET | `/api/courses/:id` | 單一課程（id 或 slug） |

**銜接步驟：**

1. 在 `lib/api/courses.ts` 實作 `fetchCourses()`、`fetchCourseById()`
2. 在 `lib/data/courses.ts` 依環境變數切換：`USE_MOCK ? 讀 JSON : 呼叫 API`
3. 若 API 回傳格式不同，加一層 `apiResponseToCourse()` 轉換

```typescript
// lib/data/courses.ts
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export async function getCourses(params?: CourseFilterParams): Promise<Course[]> {
  if (USE_MOCK) return getMockCourses(params);
  const res = await fetchCoursesFromApi(params);
  return res.map(apiResponseToCourse);
}
```

### 2.3 GraphQL

**Schema 建議：**

```graphql
type Course {
  id: ID!
  slug: String!
  title: String!
  mainCategory: CourseMainCategory!
  subCategory: CourseSubCategory!
  tags: [String!]!
  summary: String!
  description: String!
  # ... 其餘欄位
}

enum CourseMainCategory {
  government
  paid
}
```

**銜接：** 使用 Apollo Client / urql 查詢，在 `lib/api/graphql.ts` 定義 queries，回傳的 data 用 `graphqlToCourse()` 轉成 `Course`。

---

## 3. 轉換層設計原則

1. **單一出口**：頁面與元件只使用 `Course` 型別，不直接依賴 API 格式
2. **轉換集中**：所有轉換邏輯放在 `lib/api/` 或 `lib/data/`
3. **型別一致**：`types/course.ts` 為唯一來源，API 回應先轉成 `Course` 再使用
4. **環境切換**：用 `NEXT_PUBLIC_USE_MOCK` 控制 mock / API 切換

---

## 4. 環境變數建議

```env
# .env.local
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
# 若 CMS
NEXT_PUBLIC_CMS_URL=https://cms.example.com
NEXT_PUBLIC_CMS_TOKEN=xxx
```

---

*文件結束。實作時可依實際 CMS / API 調整轉換邏輯。*
