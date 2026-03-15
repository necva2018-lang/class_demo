# 職訓課程網站 — 前端技術架構規劃

> 版本：v1.0 | 建立日期：2025-03-15  
> 依據：PRODUCT_SPEC.md、Next.js App Router / TypeScript / Tailwind CSS / 手機版優先

---

## 1. 專案資料夾結構建議

```
class-demo/
├── public/                      # 靜態資源
│   ├── images/                  # 圖片
│   │   ├── courses/             # 課程圖片
│   │   ├── cases/               # 成果案例圖片
│   │   └── common/              # 共用圖片（logo、icons）
│   └── data/                    # 本地 mock 資料（可選，或放 src）
│
├── src/
│   ├── app/                     # App Router 根目錄
│   │   ├── layout.tsx           # 根 layout（全域 Provider、metadata）
│   │   ├── page.tsx             # 首頁
│   │   ├── globals.css          # 全域樣式
│   │   │
│   │   ├── (main)/              # 主要內容群組（可共用 layout）
│   │   │   ├── layout.tsx       # 主 layout（Header + Footer）
│   │   │   ├── courses/         # 課程相關
│   │   │   │   ├── page.tsx     # 課程總覽
│   │   │   │   ├── [category]/  # 課程分類（動態）
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/        # 課程詳細（動態）
│   │   │   │       └── page.tsx
│   │   │   ├── cases/           # 成果案例
│   │   │   │   └── page.tsx
│   │   │   ├── news/            # 最新消息
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── about/           # 關於我們
│   │   │   │   └── page.tsx
│   │   │   ├── faq/             # FAQ
│   │   │   │   └── page.tsx
│   │   │   └── apply/           # 報名頁
│   │   │       └── page.tsx
│   │   │
│   │   └── not-found.tsx        # 404
│   │
│   ├── components/              # 元件
│   │   ├── ui/                  # 基礎 UI 元件（可抽成設計系統）
│   │   ├── layout/              # 版面元件
│   │   ├── course/              # 課程相關元件
│   │   ├── form/                # 表單相關元件
│   │   └── shared/              # 其他共用元件
│   │
│   ├── lib/                     # 工具與邏輯
│   │   ├── api/                 # API 呼叫層（未來接後端）
│   │   ├── data/                # 資料取得邏輯（mock / fetch）
│   │   ├── utils/               # 工具函式
│   │   └── constants/           # 常數
│   │
│   ├── types/                   # TypeScript 型別定義
│   │   ├── course.ts
│   │   ├── news.ts
│   │   ├── case.ts
│   │   └── index.ts
│   │
│   ├── hooks/                   # 自訂 hooks
│   │
│   └── data/                    # Mock 資料來源（JSON 或 .ts）
│       ├── courses.json
│       ├── news.json
│       ├── cases.json
│       ├── faq.json
│       └── categories.json
│
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

**設計原則說明：**
- `(main)` 為 Route Group，不影響 URL，可共用 layout
- `components/` 依功能分類，`ui/` 為最底層、可複用的原子元件
- `lib/data/` 與 `data/` 分離：資料來源放 `data/`，取得邏輯放 `lib/data/`
- `lib/api/` 預留給未來後端 API 呼叫層

---

## 2. 路由規劃

| 路徑 | 頁面 | 備註 |
|------|------|------|
| `/` | 首頁 | App Router 根 `page.tsx` |
| `/courses` | 課程總覽 | 所有課程列表 |
| `/courses/[category]` | 課程分類頁 | category: 職前訓練、在職訓練、專班課程、證照課程、推廣課程 |
| `/courses/[category]/[id]` | 課程詳細頁 | 或採用扁平 `/courses/[id]`，依 URL 語意選擇 |
| `/cases` | 成果案例頁 | |
| `/news` | 最新消息列表 | |
| `/news/[id]` | 消息詳細頁 | 可選，第一階段可僅列表 |
| `/about` | 關於我們 | |
| `/faq` | FAQ | |
| `/apply` | 報名頁 | 可加 query: `/apply?courseId=xxx` |

**建議採用扁平課程詳情路由：**
```
/courses/[id]   # 課程詳細（id 為 slug 或 uuid）
```
- 分類由麵包屑或標籤呈現，避免過深巢狀
- 分類列表維持 `/courses/[category]` 即可

**路由對照表：**

| URL | 對應檔案 |
|-----|----------|
| `/` | `app/page.tsx` 或 `app/(main)/page.tsx` |
| `/courses` | `app/(main)/courses/page.tsx` |
| `/courses/職前訓練` | `app/(main)/courses/[category]/page.tsx` |
| `/courses/abc123` | `app/(main)/courses/[id]/page.tsx`（或 `[id]` 資料夾） |
| `/cases` | `app/(main)/cases/page.tsx` |
| `/news` | `app/(main)/news/page.tsx` |
| `/news/1` | `app/(main)/news/[id]/page.tsx` |
| `/about` | `app/(main)/about/page.tsx` |
| `/faq` | `app/(main)/faq/page.tsx` |
| `/apply` | `app/(main)/apply/page.tsx` |

---

## 3. 資料模型建議

### 3.1 課程 (Course)

```typescript
// types/course.ts

/** 課程分類類型 */
type CourseCategoryType = 
  | 'government-job-preparation'   // 職前訓練
  | 'government-in-service'        // 在職訓練
  | 'government-special'           // 專班課程
  | 'paid-certification'           // 證照課程
  | 'paid-promotion';              // 推廣課程

/** 課程大綱單元 */
interface CourseOutlineItem {
  unit: number;
  title: string;
  content: string;
}

/** 師資 */
interface Instructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar?: string;
}

interface Course {
  id: string;
  slug: string;                    // URL 友善識別
  title: string;
  summary: string;
  description: string;
  category: CourseCategoryType;
  categoryLabel: string;           // 顯示用，如「職前訓練」
  
  // 課程資訊
  startDate: string;               // ISO 8601
  endDate?: string;
  duration: number;               // 總時數
  schedule: string;               // 例：「週一至週五 09:00-17:00」
  location: string;
  capacity: number;
  enrolled?: number;
  
  // 費用
  fee: number;
  subsidy?: number;                // 補助金額
  subsidyNote?: string;            // 補助說明
  
  // 內容
  outline: CourseOutlineItem[];
  instructors: Instructor[];
  targetAudience: string[];
  prerequisites?: string[];
  
  // 顯示
  coverImage: string;
  images?: string[];
  tags?: string[];
  isFeatured?: boolean;
  
  createdAt: string;
  updatedAt: string;
}
```

### 3.2 課程分類 (Category)

```typescript
// types/category.ts

interface Category {
  id: string;
  slug: string;
  name: string;
  parent?: 'government' | 'paid';   // 政府補助 | 自費
  description?: string;
  order: number;
}
```

### 3.3 最新消息 (News)

```typescript
// types/news.ts

type NewsType = 'announcement' | 'course' | 'event' | 'other';

interface News {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  type: NewsType;
  coverImage?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
```

### 3.4 成果案例 (Case)

```typescript
// types/case.ts

interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  courseId?: string;               // 關聯課程
  courseName?: string;
  year?: number;
  metrics?: {                     // 數據指標
    label: string;
    value: string | number;
  }[];
  images?: string[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
```

### 3.5 FAQ

```typescript
// types/faq.ts

interface FaqCategory {
  id: string;
  name: string;
  order: number;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  order: number;
}
```

### 3.6 報名 (Application)

```typescript
// types/application.ts

interface ApplicationFormData {
  courseId: string;
  name: string;
  email: string;
  phone: string;
  idNumber?: string;
  education?: string;
  experience?: string;
  motivation?: string;
  // 可依實際表單擴充
}
```

**資料來源對應：**
- Mock 階段：`data/*.json` 或 `data/*.ts` 匯出
- 未來 CMS/API：同型別，由 `lib/api/` 或 `lib/data/` 透過 fetch 取得

---

## 4. 共用元件規劃

### 4.1 元件分層架構

```
components/
├── ui/                    # 第一層：純 UI，無業務邏輯
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Accordion.tsx
│   ├── Breadcrumb.tsx
│   ├── Skeleton.tsx       # 載入骨架
│   └── ...
│
├── layout/                # 第二層：版面結構
│   ├── Header/
│   │   ├── Header.tsx
│   │   ├── NavDesktop.tsx
│   │   ├── NavMobile.tsx
│   │   └── index.ts
│   ├── Footer/
│   │   ├── Footer.tsx
│   │   ├── FooterLinks.tsx
│   │   └── index.ts
│   ├── MainLayout.tsx     # Header + children + Footer
│   └── PageContainer.tsx  # 頁面寬度、padding
│
├── course/                # 第三層：業務元件（課程相關）
│   ├── CourseCard.tsx
│   ├── CourseFilter.tsx
│   ├── CourseList.tsx
│   ├── CourseDetail/
│   │   ├── CourseInfo.tsx
│   │   ├── CourseOutline.tsx
│   ├── CourseCategoriesNav.tsx
│   └── index.ts
│
├── form/                  # 第三層：表單相關
│   ├── ApplyForm.tsx
│   ├── FormField.tsx
│   └── index.ts
│
└── shared/                # 第三層：跨頁面共用
    ├── CTAButton.tsx
    ├── ContactBlock.tsx
    ├── NewsCard.tsx
    ├── CaseCard.tsx
    ├── FaqAccordion.tsx
    └── index.ts
```

### 4.2 元件設計原則

| 原則 | 說明 |
|------|------|
| **單一職責** | 每元件專注單一功能 |
| **Props 驅動** | 資料由父層傳入，元件不直接依賴 API |
| **可組合** | 小元件組合成大元件 |
| **index 匯出** | 各子資料夾以 `index.ts` 統一匯出，簡化 import |
| **型別** | 所有 props 定義 interface，export 供他處使用 |

### 4.3 共用元件清單

| 元件 | 所屬 | 用途 |
|------|------|------|
| Button | ui | 主/次/文字按鈕 |
| Input, Select, Textarea | ui | 表單欄位 |
| Card | ui | 通用卡片容器 |
| Badge | ui | 標籤（分類、狀態） |
| Accordion | ui | FAQ、收合區塊 |
| Breadcrumb | ui | 導覽路徑 |
| Skeleton | ui | 載入狀態 |
| Header, Footer | layout | 全站導覽 |
| PageContainer | layout | 頁面寬度、padding |
| CourseCard | course | 課程卡片 |
| CourseFilter | course | 課程篩選器 |
| ApplyForm | form | 報名表單 |
| CTAButton | shared | 主 CTA 按鈕 |
| ContactBlock | shared | 聯絡資訊區塊 |
| NewsCard, CaseCard | shared | 消息／案例卡片 |

---

## 5. 頁面元件拆分方式

**原則：** Page 負責資料取得與 layout 組合，Section 負責區塊內容。

### 5.1 首頁結構

```
app/(main)/page.tsx
└── HomePage
    ├── HeroSection          # 主視覺
    ├── CourseCategoriesSection
    ├── FeaturedCoursesSection
    ├── StatsSection
    ├── NewsPreviewSection
    └── CTASection
```

- 各 Section 可放在 `app/(main)/_components/HomePage/` 或 `components/shared/`
- 首頁專用放 `app`，可複用放 `components`

### 5.2 課程總覽／分類頁

```
app/(main)/courses/page.tsx
└── CoursesPage
    ├── PageHeader
    ├── CourseFilter
    └── CourseList（多個 CourseCard）
```

```
app/(main)/courses/[category]/page.tsx
└── CategoryCoursesPage
    ├── PageHeader（含分類標題）
    ├── CategoryDescription
    ├── CourseFilter
    └── CourseList
```

### 5.3 課程詳細頁

```
app/(main)/courses/[id]/page.tsx
└── CourseDetailPage
    ├── Breadcrumb
    ├── CourseHeader（標題、標籤、主要資訊）
    ├── CourseDescription
    ├── CourseOutline
    ├── CourseInstructors
    ├── SubsidyInfo（若有補助）
    ├── StickyApplyButton
    ├── RelatedCourses
    └── CTASection
```

### 5.4 其他頁面

| 頁面 | 主要 Section |
|------|--------------|
| 成果案例 | CaseList、CaseCard、CaseFilter |
| 最新消息 | NewsList、NewsCard、分頁 |
| 關於我們 | AboutIntro、AboutTeam、ContactBlock、Map |
| FAQ | FaqCategories、FaqAccordion |
| 報名 | CourseSummary、ApplyForm、SuccessMessage |

**Section 放置建議：**
- 僅單頁使用：`app/(route)/_components/`
- 多頁共用：`components/shared/` 或 `components/{domain}/`

---

## 6. SEO 基本規劃

### 6.1 Metadata 策略

| 層級 | 使用方式 |
|------|----------|
| **根 layout** | 預設 `metadata`（site 名稱、description、OG 預設） |
| **各頁面** | `export const metadata` 或 `generateMetadata`（動態頁） |
| **動態頁** | `generateMetadata({ params })` 依 params 生成標題、描述 |

### 6.2 各頁面 Metadata 規劃

| 頁面 | title | description |
|------|-------|-------------|
| 首頁 | {siteName} \| 職訓課程招生 | 主站描述 |
| 課程總覽 | 課程總覽 \| {siteName} | 課程列表描述 |
| 課程分類 | {分類名}課程 \| {siteName} | 該分類課程描述 |
| 課程詳細 | {課程名稱} \| {siteName} | 課程摘要（前 160 字） |
| 成果案例 | 成果案例 \| {siteName} | 案例頁描述 |
| 最新消息 | 最新消息 \| {siteName} | 消息列表描述 |
| 關於我們 | 關於我們 \| {siteName} | 機構介紹 |
| FAQ | 常見問題 \| {siteName} | FAQ 頁描述 |
| 報名 | 線上報名 \| {siteName} | 報名說明 |

### 6.3 技術實作要點

| 項目 | 實作方式 |
|------|----------|
| **Metadata API** | 使用 Next.js 14+ `metadata` / `generateMetadata` |
| **結構化資料** | `Course`、`Organization` 的 JSON-LD，放 layout 或對應頁 |
| **語意 HTML** | `<main>`, `<article>`, `<section>`, `<h1>` 階層正確 |
| **圖片 alt** | 所有 `<Image>` 提供 alt |
| **sitemap.xml** | `app/sitemap.ts` 動態生成 |
| **robots.txt** | `app/robots.ts` 或 `public/robots.txt` |
| ** canonical** | 動態頁設定 canonical URL |

### 6.4 檔案規劃

```
app/
├── layout.tsx          # 全域 metadata 預設
├── sitemap.ts          # 動態 sitemap
├── robots.ts           # robots.txt
└── (main)/
    └── courses/
        └── [id]/
            └── page.tsx   # generateMetadata + JSON-LD
```

---

## 7. 後續接資料庫的銜接方式

### 7.1 資料層抽象設計

**目標：** 現有元件與頁面邏輯不變，僅替換「資料來源」。

```
現在：Page → lib/data/getCourses() → 讀取 JSON
未來：Page → lib/data/getCourses() → lib/api/courses.ts → 後端 API
```

### 7.2 建議的資料存取層結構

```
lib/
├── data/                     # 資料取得入口（對 Page 透明）
│   ├── courses.ts
│   │   ├── getCourses(filters?)
│   │   ├── getCourseById(id)
│   │   └── getCoursesByCategory(category)
│   ├── news.ts
│   ├── cases.ts
│   ├── faq.ts
│   └── index.ts
│
├── api/                      # 未來 API 呼叫（可選）
│   ├── client.ts             # fetch 封裝、baseURL、auth
│   ├── courses.ts            # GET /courses, GET /courses/:id
│   ├── news.ts
│   └── ...
│
└── config.ts                 # 環境變數：USE_MOCK, API_BASE_URL
```

### 7.3 切換邏輯範例（概念）

```typescript
// lib/data/courses.ts（概念，非完整程式）

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export async function getCourses(filters?: CourseFilters): Promise<Course[]> {
  if (USE_MOCK) {
    return getMockCourses(filters);
  }
  return fetchCoursesFromAPI(filters);
}
```

- 開發／展示用：`NEXT_PUBLIC_USE_MOCK=true`
- 正式環境：`NEXT_PUBLIC_USE_MOCK=false`，由 `lib/api/` 呼叫後端

### 7.4 銜接步驟建議

| 步驟 | 動作 |
|------|------|
| 1 | 保持 `types/` 與後端 API 回應型別一致（或加轉換層） |
| 2 | 建立 `lib/api/client.ts`，統一 fetch、錯誤處理、baseURL |
| 3 | 實作 `lib/api/courses.ts` 等，對應後端路由 |
| 4 | 修改 `lib/data/*.ts`，依環境變數選擇 mock 或 API |
| 5 | 視需求加入 React Query / SWR 做快取與重新驗證 |
| 6 | 動態頁使用 `generateStaticParams` 可改為 ISR 或 SSR |

### 7.5 環境變數規劃

```env
# .env.local（範例）

# 資料來源切換
NEXT_PUBLIC_USE_MOCK=true

# API（未來）
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
# 若有需要
# API_SECRET_KEY=xxx
```

### 7.6 CMS 銜接考量

若使用 Headless CMS（如 Strapi、Sanity、Contentful）：

| 項目 | 說明 |
|------|------|
| **Content Type** | 依現有 types 設計 CMS schema |
| **取數方式** | CMS SDK 或 REST/GraphQL 取代 mock |
| **預覽** | 若有 draft 預覽，可加 `NEXT_PUBLIC_PREVIEW_MODE` |
| **重新驗證** | 使用 `revalidatePath` 或 ISR 配合 webhook |

---

## 附錄：技術棧總覽

| 項目 | 選型 |
|------|------|
| 框架 | Next.js 14+ (App Router) |
| 語言 | TypeScript |
| 樣式 | Tailwind CSS |
| 資料 | 本地 JSON / mock，預留 API 層 |
| 圖片 | next/image |
| 表單 | 可控元件 + 自訂驗證（未來可加 react-hook-form + zod） |
| 響應式 | Tailwind breakpoints，mobile-first |
| SEO | Metadata API、sitemap、robots、JSON-LD |

---

*文件結束。此架構供開發規劃參考，實作時可依需求微調。*
