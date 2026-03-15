# 職訓課程網站 — 後台控制台產品規格書

> 版本：v1.0 | 建立日期：2025-03-15  
> 依據：職訓課程網站前台架構、Next.js App Router、TypeScript、Tailwind CSS

---

## 一、後台產品規格

### 1.1 後台定位與目標

| 項目 | 說明 |
|------|------|
| **產品名稱** | 職訓課程網站後台控制台 (Admin Dashboard) |
| **核心價值主張** | 讓非工程人員透過後台管理前端網站內容，無需修改程式碼 |
| **目標受眾** | 內容編輯、營運人員、管理者 |
| **與前台關係** | 後台所有變更預期反映於前台，透過統一資料層對接 |

### 1.2 後台核心目標

| 序號 | 目標 | 說明 |
|------|------|------|
| 1 | 課程管理 | 新增、編輯、刪除課程，設定招生狀態、精選、排序 |
| 2 | 課程分類管理 | 主分類／子分類設定，顯示順序，支援未來階層擴充 |
| 3 | 首頁內容管理 | Hero、課程入口、熱門課程、數據、CTA 等區塊 |
| 4 | Banner / Hero 管理 | 主視覺、標題、按鈕、背景圖，支援輪播擴充 |
| 5 | 成果案例管理 | 案例 CRUD、分類、精選、排序、圖片預留 |
| 6 | FAQ 管理 | 問答 CRUD、分類、排序、首頁摘要標記 |
| 7 | 最新消息管理 | 消息 CRUD、發布狀態、封面圖、SEO |
| 8 | 關於我們管理 | 協會介紹、宗旨、服務對象、合作單位、聯絡資訊 |
| 9 | 報名連結與 CTA 管理 | 全站 CTA 按鈕、報名連結 |
| 10 | 網站基本設定 | 網站名稱、Logo、聯絡、社群、頁尾 |
| 11 | SEO 設定 | 全站預設、各模組自訂、OG 結構預留 |
| 12 | 未來擴充 | 登入權限、資料庫、角色權限 |

### 1.3 技術約束與原則

| 項目 | 說明 |
|------|------|
| **框架** | Next.js App Router |
| **語言** | TypeScript |
| **樣式** | Tailwind CSS |
| **資料** | 先使用 mock data / local JSON / local state |
| **架構** | 保留接 API / CMS / database 的能力 |
| **設計** | 元件化、型別完整、可維護、可擴充 |
| **響應式** | 手機版可瀏覽與基本編輯 |

---

## 二、後台 Sitemap

```
/admin                          # 後台根（Dashboard 首頁）
│
├── /admin                      # Dashboard 總覽
│
├── /admin/courses              # 課程管理
│   ├── /admin/courses          # 課程列表
│   ├── /admin/courses/new      # 新增課程
│   └── /admin/courses/[id]     # 編輯課程
│
├── /admin/categories           # 課程分類管理
│
├── /admin/home                 # 首頁內容管理
│
├── /admin/banners              # Banner / Hero 管理
│
├── /admin/stories              # 成果案例管理
│   ├── /admin/stories          # 案例列表
│   ├── /admin/stories/new      # 新增案例（可選）
│   └── /admin/stories/[id]     # 編輯案例（可選）
│
├── /admin/faqs                 # FAQ 管理
│
├── /admin/news                 # 最新消息管理
│   ├── /admin/news             # 消息列表
│   ├── /admin/news/new         # 新增消息（可選）
│   └── /admin/news/[id]        # 編輯消息（可選）
│
├── /admin/about                # 關於我們管理
│
├── /admin/settings             # 網站設定
│
└── /admin/seo                  # SEO 設定
```

### 2.1 路由與檔案對照表

| 路由 | 檔案路徑 | 頁面用途 |
|------|----------|----------|
| `/admin` | `app/admin/layout.tsx` + `app/admin/page.tsx` | 後台 Layout + Dashboard |
| `/admin/courses` | `app/admin/courses/page.tsx` | 課程列表 |
| `/admin/courses/new` | `app/admin/courses/new/page.tsx` | 新增課程 |
| `/admin/courses/[id]` | `app/admin/courses/[id]/page.tsx` | 編輯課程 |
| `/admin/categories` | `app/admin/categories/page.tsx` | 課程分類管理 |
| `/admin/home` | `app/admin/home/page.tsx` | 首頁內容管理 |
| `/admin/banners` | `app/admin/banners/page.tsx` | Banner / Hero 管理 |
| `/admin/stories` | `app/admin/stories/page.tsx` | 成果案例列表（可含 inline 新增/編輯或分頁） |
| `/admin/stories/new` | `app/admin/stories/new/page.tsx` | 新增案例（可選） |
| `/admin/stories/[id]` | `app/admin/stories/[id]/page.tsx` | 編輯案例（可選） |
| `/admin/faqs` | `app/admin/faqs/page.tsx` | FAQ 管理 |
| `/admin/news` | `app/admin/news/page.tsx` | 最新消息列表 |
| `/admin/news/new` | `app/admin/news/new/page.tsx` | 新增消息（可選） |
| `/admin/news/[id]` | `app/admin/news/[id]/page.tsx` | 編輯消息（可選） |
| `/admin/about` | `app/admin/about/page.tsx` | 關於我們管理 |
| `/admin/settings` | `app/admin/settings/page.tsx` | 網站設定 |
| `/admin/seo` | `app/admin/seo/page.tsx` | SEO 設定 |

**建議：** 初期 Stories、News 可採列表頁 + Modal / Drawer 做新增／編輯，減少路由；若表單較複雜，再拆分為 `/new` 與 `/[id]` 獨立頁。

---

## 三、各模組功能規格

### 3.1 Dashboard 首頁總覽

| 區塊 | 內容 |
|------|------|
| **統計卡片** | 課程總數、招生中課程數、精選課程數、最新消息數、FAQ 數、成果案例數 |
| **最近更新** | 最近更新的課程、消息、案例列表（時間排序，可限制筆數） |
| **快速操作** | 新增課程、新增消息、新增案例、前往設定等入口按鈕 |
| **導航區** | 左側 Sidebar 或上方導覽，連結至各管理模組 |

### 3.2 課程管理 (Courses)

| 功能 | 說明 |
|------|------|
| 列表顯示 | 顯示所有課程，支援表格或卡片式 |
| 搜尋 | 依標題、摘要關鍵字搜尋 |
| 篩選 | 依主分類、子分類、招生狀態、精選篩選 |
| 排序 | 依開課日期、建立時間、sortOrder |
| 新增課程 | 表單填寫，欄位見下方 Course 資料模型 |
| 編輯課程 | 進入編輯頁，修改後儲存 |
| 刪除課程 | 單筆刪除，可加確認提示 |
| 招生狀態切換 | 快速切換 open / full / closed / coming |
| 精選標記 | 勾選／取消精選 |
| 排序設定 | 數字 sortOrder，決定列表顯示順序 |
| 前台預覽 | 連結至 `/courses/[id]` 或 `/courses/[slug]` |

**欄位：** id, slug, title, mainCategory, subCategory, tags, summary, description, targetAudience, features, outline, teacher, location, hours, quota, status, startDate, endDate, image, applyUrl, faq, featured, sortOrder, seoTitle, seoDescription

### 3.3 課程分類管理 (Categories)

| 功能 | 說明 |
|------|------|
| 新增分類 | 填寫 slug、名稱、父分類、描述、排序 |
| 編輯分類 | 修改名稱、描述、排序、顯示狀態 |
| 主分類/子分類 | parent: government | paid，子分類隸屬主分類 |
| 顯示順序 | order 數字 |
| 顯示於前台 | 布林值，控制是否出現在前台導覽 |
| 擴充性 | 結構預留 parentId，未來可支援多階層 |

### 3.4 首頁內容管理 (Home Page)

| 區塊 | 可編輯項目 |
|------|------------|
| Hero | 主標、副標、主按鈕文字與連結、次按鈕（可選） |
| 課程分類入口 | 政府補助／自費兩張卡片標題、描述、連結 |
| 熱門課程區塊 | 標題、副標、是否顯示、顯示數量 |
| 為什麼選擇我們 | 區塊標題、各項目標題與描述 |
| 學員成果展示 | 區塊標題、精選案例 ID 或數量 |
| 學員見證 | 見證內容、來源 |
| 報名流程 | 步驟標題、說明 |
| FAQ 摘要 | 顯示數量、是否顯示、分類篩選 |
| 最下方 CTA | 標題、副標、按鈕文字、連結 |
| 數據區塊 | 結訓學員、就業率、合作企業、開設課程 等數字與標籤 |

### 3.5 Banner / Hero 管理

| 功能 | 說明 |
|------|------|
| 列表 | 多筆 Banner 管理（可輪播） |
| 標題 | 主標、副標 |
| 按鈕 | 主按鈕文字與連結、次按鈕文字與連結 |
| 背景圖 | 圖片 URL 或上傳欄位預留 |
| 排序 | 輪播順序 |
| 啟用狀態 | 是否顯示於前台 |

### 3.6 成果案例管理 (Success Stories)

| 功能 | 說明 |
|------|------|
| 新增／編輯／刪除 | CRUD 操作 |
| 圖片欄位 | 預留上傳或 URL 輸入 |
| 案例分類 | 就業案例 / 創業案例 / 學員心得 / 作品展示 |
| 精選標記 | 是否顯示於精選區 |
| 排序 | sortOrder 或 publishedAt |

### 3.7 FAQ 管理

| 功能 | 說明 |
|------|------|
| 新增／編輯／刪除 | CRUD |
| FAQ 分類 | categoryId, categoryName（報名相關、補助相關、課程相關等） |
| 排序 | order |
| 首頁摘要 | 是否顯示在首頁 FAQ 摘要區塊 |

### 3.8 最新消息管理 (News)

| 功能 | 說明 |
|------|------|
| 新增／編輯／刪除 | CRUD |
| 發布日期 | publishedAt |
| 封面圖 | 欄位預留 |
| 摘要 | summary |
| 發布狀態 | 是否發布（published: boolean） |
| SEO | seoTitle, seoDescription |

### 3.9 關於我們管理 (About)

| 區塊 | 可編輯內容 |
|------|------------|
| 協會介紹 | 文字區塊 |
| 宗旨 | 文字區塊 |
| 服務對象 | 列表或文字 |
| 合作單位 | 文字或列表 |
| 聯絡資訊 | 電話、Email、服務時間 |
| 地址／地圖 | 欄位預留 |

### 3.10 網站設定 (Site Settings)

| 項目 | 說明 |
|------|------|
| 網站名稱 | siteName |
| 網站副標題 | 可選 |
| Logo | 欄位預留（URL 或上傳） |
| 聯絡電話 | phone |
| Email | email |
| 地址 | address |
| LINE 連結 | lineUrl |
| Facebook 連結 | facebookUrl |
| 頁尾資訊 | footerText |
| 全站 CTA | 預設按鈕文字、連結 |

### 3.11 SEO 設定

| 項目 | 說明 |
|------|------|
| 全站預設 title | defaultTitle |
| 全站預設 description | defaultDescription |
| 各模組自訂 | 課程、消息、案例、關於我們等可覆寫 seoTitle, seoDescription |
| Open Graph | ogImage, ogType 等結構預留 |

---

## 四、資料模型

### 4.1 課程 (Course)

> 與現有 `types/course.ts` 對齊，並補足後台所需欄位

```typescript
interface Course {
  id: string;
  slug: string;
  title: string;
  mainCategory: "government" | "paid";
  subCategory: CourseSubCategory;
  tags: string[];
  summary: string;
  description: string;
  targetAudience: string[];
  features: string[];
  outline: { unit: number; title: string; content: string }[];
  teacher: string;  // 或擴充為 instructors 陣列
  location: string;
  hours: number;
  quota: number;
  status: "open" | "full" | "closed" | "coming";
  startDate: string;
  endDate: string;
  image: string;
  applyUrl: string;
  faq: { question: string; answer: string }[];
  featured: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### 4.2 課程分類 (Category)

> 與現有 `types/category.ts` 對齊，擴充顯示狀態

```typescript
interface Category {
  id: string;
  slug: string;
  name: string;
  parent: "government" | "paid";
  description?: string;
  order: number;
  visible?: boolean;  // 是否顯示於前台
  parentId?: string;  // 未來多階層擴充
}
```

### 4.3 首頁設定 (HomePageConfig)

```typescript
interface HomePageConfig {
  hero: {
    title: string;
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
  };
  categoryEntry: {
    government: { title: string; description: string; href: string };
    paid: { title: string; description: string; href: string };
  };
  featuredCourses: { title: string; subtitle: string; limit: number };
  stats: { label: string; value: string }[];
  whyUs: { title: string; items: { title: string; desc: string; icon?: string }[] };
  stories: { title: string; limit: number };
  testimonials: { title: string; items: { quote: string; source?: string }[] };
  applySteps?: { title: string; desc: string }[];
  faqSummary: { title: string; limit: number; showOnHome: boolean };
  cta: { title: string; subtitle: string; buttonLabel: string; buttonHref: string };
}
```

### 4.4 Banner / Hero

```typescript
interface Banner {
  id: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  order: number;
  active: boolean;
}
```

### 4.5 成果案例 (CaseStudy) — 擴充

```typescript
interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: "employment" | "entrepreneurship" | "testimonial" | "portfolio";
  image?: string;
  courseName?: string;
  year?: number;
  metrics?: { label: string; value: string | number }[];
  featured: boolean;
  sortOrder: number;
  publishedAt: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### 4.6 FAQ — 擴充

```typescript
interface FaqItem {
  id: string;
  categoryId: string;
  categoryName: string;
  question: string;
  answer: string;
  order: number;
  showOnHome: boolean;  // 是否顯示在首頁摘要
}
```

### 4.7 最新消息 (News) — 擴充

```typescript
interface News {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  type: "announcement" | "course" | "event" | "other";
  coverImage?: string;
  publishedAt: string;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### 4.8 關於我們 (AboutConfig)

```typescript
interface AboutConfig {
  intro: string;
  mission: string;
  serviceAudience: string[];
  partners: string[];
  contact: {
    phone: string;
    email: string;
    address: string;
    serviceHours: string;
    mapEmbed?: string;
  };
}
```

### 4.9 網站設定 (SiteSettings)

```typescript
interface SiteSettings {
  siteName: string;
  siteSubtitle?: string;
  logo?: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  social: {
    line?: string;
    facebook?: string;
  };
  footer: {
    text: string;
    copyright?: string;
  };
  cta: {
    defaultLabel: string;
    defaultHref: string;
  };
}
```

### 4.10 SEO 設定 (SeoSettings)

```typescript
interface SeoSettings {
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage?: string;
  keywords?: string[];
  // Open Graph 擴充預留
  ogType?: "website" | "article";
}
```

---

## 五、Mock Data 檔案拆分方式

```
src/
├── data/                        # 前台與後台共用的原始 mock
│   ├── courses.json
│   ├── categories.json
│   ├── news.json
│   ├── cases.json
│   ├── faq.json
│   └── ...
│
├── data/admin/                  # 後台專用 mock（或與上共用）
│   ├── home-config.json         # 首頁設定
│   ├── banners.json
│   ├── about-config.json
│   ├── site-settings.json
│   └── seo-settings.json
│
├── lib/
│   ├── data/                    # 資料取得層（對外介面）
│   │   ├── courses.ts
│   │   ├── categories.ts
│   │   ├── news.ts
│   │   ├── cases.ts
│   │   ├── faq.ts
│   │   ├── home.ts
│   │   ├── banners.ts
│   │   ├── about.ts
│   │   ├── settings.ts
│   │   └── seo.ts
│   │
│   └── stores/                  # 後台狀態（mock 階段可選）
│       └── admin-store.ts       # 若用 zustand / context 管理編輯中狀態
```

**原則：**
- 前台讀取：`lib/data/*.ts` → JSON
- 後台讀取／寫入：`lib/data/*.ts` → 同一 JSON，或先寫入 memory / localStorage 模擬
- 未來接 API：在 `lib/data/*.ts` 內切換 `USE_MOCK ? readJSON : fetchAPI`

---

## 六、前台與後台共用資料的方法

| 方式 | 說明 |
|------|------|
| **共用 types** | `src/types/` 為單一來源，前台、後台、API 均使用相同介面 |
| **共用 lib/data** | `getCourses()`、`getCategories()` 等由 `lib/data/` 提供，前台與後台都呼叫 |
| **Mock 階段** | 後台「儲存」時寫入 JSON 或 memory，前台重新載入時讀取最新資料 |
| **未來 API** | `lib/data` 改為呼叫 API，後台透過 REST/POST 更新，前台透過 GET 讀取；或使用 React Query/SWR 做 cache invalidation |

---

## 七、未來改接資料庫 / CMS / API

| 步驟 | 動作 |
|------|------|
| 1 | 維持 `types/` 與後端 schema 一致（或加 adapter 轉換） |
| 2 | 建立 `lib/api/client.ts`：fetch 封裝、baseURL、auth header |
| 3 | 建立 `lib/api/courses.ts` 等：GET/POST/PUT/DELETE 端點 |
| 4 | 修改 `lib/data/*.ts`：`USE_MOCK ? mock : api` 切換 |
| 5 | 後台表單送出改為呼叫 API，而非寫入 JSON |
| 6 | 視需要加入 React Query / SWR 做快取與 revalidate |
| 7 | 若用 Headless CMS，依 Content Type 對應，CMS 提供 API，用同一 adapter 轉成 types |

---

## 八、未來登入驗證與角色權限

| 項目 | 建議 |
|------|------|
| **認證** | NextAuth.js 或 Auth0、Clerk 等，保護 `/admin/*` 路由 |
| **中間件** | `middleware.ts` 檢查 `/admin` 路徑，未登入則導向登入頁 |
| **角色** | admin / editor / viewer 等，依 role 控制可存取模組 |
| **權限矩陣** | 預先定義：例如 editor 可編輯課程／消息，不可改設定；admin 可全部 |
| **UI** | 依權限隱藏 Sidebar 項目或按鈕 |
| **API** | 後端 API 也須做權限檢查，不信任前端 |

---

## 九、頁面關係圖（簡圖）

```
                    ┌─────────────────┐
                    │  /admin (Layout)│
                    │  Sidebar+Header │
                    └────────┬────────┘
                             │
     ┌───────────────────────┼───────────────────────┐
     │                       │                       │
     ▼                       ▼                       ▼
┌─────────┐           ┌─────────────┐           ┌──────────┐
│Dashboard│           │  /courses   │           │/categories│
│ 總覽    │           │ 課程列表    │◄─────────►│ 分類管理  │
└────┬────┘           └──────┬──────┘           └──────────┘
     │                        │
     │                   ┌────┴────┐
     │                   ▼         ▼
     │            /courses/new  /courses/[id]
     │            新增課程       編輯課程
     │
     ├──────────┬──────────┬──────────┬──────────┬──────────┐
     ▼          ▼          ▼          ▼          ▼          ▼
┌───────┐ ┌────────┐ ┌────────┐ ┌──────┐ ┌───────┐ ┌───────┐
│/home  │ │/banners│ │/stories│ │/faqs │ │/news  │ │/about │
│首頁   │ │Banner  │ │成果案例│ │ FAQ  │ │消息   │ │關於   │
└───────┘ └────────┘ └────────┘ └──────┘ └───────┘ └───────┘
     │          │          │          │          │          │
     └──────────┴──────────┴──────────┴──────────┴──────────┘
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
              ┌──────────┐     ┌──────────┐
              │/settings │     │  /seo    │
              │網站設定  │     │ SEO設定  │
              └──────────┘     └──────────┘
```

---

## 十、建議元件清單

### 10.1 Layout 元件

| 元件 | 路徑 | 用途 |
|------|------|------|
| AdminLayout | `app/admin/layout.tsx` | 後台根 layout |
| AdminSidebar | `components/admin/AdminSidebar.tsx` | 左側導覽 |
| AdminHeader | `components/admin/AdminHeader.tsx` | 上方 header，標題、快捷操作 |
| AdminPageContainer | `components/admin/AdminPageContainer.tsx` | 內容區 padding、max-width |

### 10.2 共用 UI 元件（後台用）

| 元件 | 路徑 | 用途 |
|------|------|------|
| AdminCard | `components/admin/ui/AdminCard.tsx` | 卡片容器 |
| AdminTable | `components/admin/ui/AdminTable.tsx` | 表格（含排序、篩選欄位預留） |
| AdminButton | `components/admin/ui/AdminButton.tsx` | 主／次／危險按鈕 |
| AdminInput | `components/admin/ui/AdminInput.tsx` | 文字輸入 |
| AdminSelect | `components/admin/ui/AdminSelect.tsx` | 下拉選單 |
| AdminTextarea | `components/admin/ui/AdminTextarea.tsx` | 多行文字 |
| AdminCheckbox | `components/admin/ui/AdminCheckbox.tsx` | 勾選框 |
| AdminBadge | `components/admin/ui/AdminBadge.tsx` | 狀態標籤 |
| AdminModal | `components/admin/ui/AdminModal.tsx` | 彈窗 |
| AdminConfirmDialog | `components/admin/ui/AdminConfirmDialog.tsx` | 確認刪除等 |
| AdminFormSection | `components/admin/ui/AdminFormSection.tsx` | 表單分區標題 |
| AdminSearchInput | `components/admin/ui/AdminSearchInput.tsx` | 搜尋框 |
| AdminFilterDropdown | `components/admin/ui/AdminFilterDropdown.tsx` | 篩選下拉 |

### 10.3 Dashboard 元件

| 元件 | 路徑 | 用途 |
|------|------|------|
| StatCard | `components/admin/dashboard/StatCard.tsx` | 統計數字卡片 |
| RecentUpdates | `components/admin/dashboard/RecentUpdates.tsx` | 最近更新列表 |
| QuickActions | `components/admin/dashboard/QuickActions.tsx` | 快速操作按鈕 |

### 10.4 各模組專用元件（可選）

| 模組 | 元件 | 用途 |
|------|------|------|
| Courses | CourseForm | 課程新增／編輯表單 |
| Courses | CourseStatusBadge | 招生狀態標籤 |
| Categories | CategoryForm | 分類表單 |
| Home | HomeSectionEditor | 首頁各區塊編輯器 |
| Banners | BannerForm | Banner 表單 |
| Stories | CaseForm | 案例表單 |
| FAQs | FaqForm | FAQ 表單 |
| News | NewsForm | 消息表單 |
| About | AboutSectionEditor | 關於我們區塊編輯 |
| Settings | SettingsForm | 網站設定表單 |
| SEO | SeoForm | SEO 設定表單 |

### 10.5 資料／狀態層（未來）

| 項目 | 說明 |
|------|------|
| `lib/stores/admin-store.ts` | 後台全域狀態（可選 zustand） |
| `lib/hooks/useCourses.ts` | 課程 CRUD hook |
| `lib/hooks/useAdminData.ts` | 通用 admin 資料載入 |

---

## 十一、Step 1 總結

本文件完成：

1. ✅ 後台產品規格
2. ✅ 後台 Sitemap 與路由規劃
3. ✅ 各模組功能規格
4. ✅ 資料模型定義
5. ✅ Mock data 檔案拆分方式
6. ✅ 前台與後台共用資料方法
7. ✅ 未來接 API / 登入權限的銜接方式
8. ✅ 頁面關係圖
9. ✅ 建議元件清單

**下一步：Step 2 — 規劃後台 UI/UX Wireframe**

---

*文件結束。請確認後再進行 Step 2。*
