# 職訓課程網站 — 專案初始版本說明

> 建立日期：2025-03-15

---

## 已建立的檔案與用途

### 1. 專案配置

| 檔案 | 用途 |
|------|------|
| `package.json` | 專案依賴（Next.js 14、React 18、TypeScript、Tailwind） |
| `tsconfig.json` | TypeScript 配置，含 `@/*` path alias |
| `next.config.js` | Next.js 配置 |
| `tailwind.config.ts` | Tailwind 主題（primary、neutral 色系） |
| `postcss.config.js` | PostCSS 配置（Tailwind） |
| `next-env.d.ts` | Next.js TypeScript 型別宣告 |

---

### 2. 全域 Layout 與樣式

| 檔案 | 用途 |
|------|------|
| `src/app/layout.tsx` | 根 layout，設定 metadata、html lang |
| `src/app/globals.css` | 全域 Tailwind、base 樣式 |
| `src/app/not-found.tsx` | 404 頁面 |

---

### 3. 主 Layout（Header / Footer）

| 檔案 | 用途 |
|------|------|
| `src/app/(main)/layout.tsx` | 主 layout：Header + main + Footer |
| `src/components/layout/Header.tsx` | 全站導覽、Logo、漢堡選單（手機版）、主要 CTA |
| `src/components/layout/Footer.tsx` | 連結區塊、聯絡資訊、版權 |

---

### 4. 頁面

| 檔案 | 路由 | 用途 |
|------|------|------|
| `src/app/(main)/page.tsx` | `/` | 首頁（Hero、課程分類入口、熱門課程、數據、CTA） |
| `src/app/(main)/courses/page.tsx` | `/courses` | 課程總覽（篩選 + 列表） |
| `src/app/(main)/courses/[id]/page.tsx` | `/courses/[id]` | 課程詳細（大綱、師資、補助、報名 CTA） |
| `src/app/(main)/apply/page.tsx` | `/apply` | 報名頁（占位，可接 courseId） |

---

### 5. Mock 資料

| 檔案 | 用途 |
|------|------|
| `src/data/courses.json` | 5 筆課程（職前、在職、證照、推廣） |
| `src/data/categories.json` | 5 個分類（職前訓練、在職訓練、專班課程、證照課程、推廣課程） |

---

### 6. 型別定義

| 檔案 | 用途 |
|------|------|
| `src/types/course.ts` | Course、Instructor、CourseOutlineItem |
| `src/types/category.ts` | Category |
| `src/types/index.ts` | 統一匯出 |

---

### 7. 資料存取層

| 檔案 | 用途 |
|------|------|
| `src/lib/data/courses.ts` | getCourses、getCourseById、getCoursesByCategory、getFeaturedCourses、getCategories、getCategoryBySlug |

---

### 8. 元件

| 檔案 | 用途 |
|------|------|
| `src/components/ui/Button.tsx` | 通用按鈕（primary/secondary/outline/ghost） |
| `src/components/course/CourseCard.tsx` | 課程卡片（可重用，含標籤、摘要、費用、連結） |
| `src/components/course/CourseFilter.tsx` | 課程分類篩選（依 URL query 切換） |
| `src/components/course/index.ts` | 課程元件匯出 |

---

## 功能摘要

### 已實作

- ✅ **基本 layout**：Header（含手機版選單）、Footer
- ✅ **首頁**：Hero、課程分類入口、熱門推薦、數據區塊、CTA
- ✅ **課程總覽**：依 URL `?category=xxx` 篩選
- ✅ **課程分類篩選**：全部 / 職前訓練 / 在職訓練 / 專班 / 證照 / 推廣
- ✅ **課程詳細**：完整資訊、大綱、師資、補助說明、相關課程、報名 CTA
- ✅ **課程卡片**：可重用，支援標籤、費用格式化
- ✅ **報名頁**：占位頁，可接收 `?courseId=xxx`
- ✅ **Mock 資料**：課程與分類 JSON
- ✅ **手機版優先**：響應式設計、漢堡選單

### 尚未實作（可後續擴充）

- 關於我們、成果案例、最新消息、FAQ 頁面（Footer 連結會 404）
- 報名表單實際功能
- 圖片資源（目前使用 placeholder）
- 搜尋、排序

---

## 啟動方式

```bash
npm install
npm run dev
```

開發伺服器預設 `http://localhost:3000`

```bash
npm run build
npm run start
```

 production  build 與啟動

---

## 資料夾結構

```
src/
├── app/
│   ├── layout.tsx           # 根 layout
│   ├── globals.css
│   ├── not-found.tsx
│   └── (main)/
│       ├── layout.tsx       # Header + Footer
│       ├── page.tsx         # 首頁
│       ├── courses/
│       │   ├── page.tsx     # 課程總覽
│       │   └── [id]/
│       │       └── page.tsx # 課程詳細
│       └── apply/
│           └── page.tsx     # 報名頁
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   │   └── Button.tsx
│   └── course/
│       ├── CourseCard.tsx
│       ├── CourseFilter.tsx
│       └── index.ts
├── lib/
│   └── data/
│       └── courses.ts
├── types/
│   ├── course.ts
│   ├── category.ts
│   └── index.ts
└── data/
    ├── courses.json
    └── categories.json
```

---

## 設計風格

- **色系**：slate 灰階 + indigo 主色，搭配 primary 藍色系
- **風格**：乾淨、專業、有信任感
- **手機優先**：Tailwind 預設 mobile-first，sm/md/lg breakpoints
