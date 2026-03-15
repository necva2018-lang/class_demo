# Step 6 前台資料整合 — 修改檔案清單

## 修改範圍

僅做「資料來源整合」，不改變版面結構與視覺設計。

---

## 一、修改檔案清單

### 1. `src/lib/seo.ts`
- **用途**：讓 metadata 優先讀取 `getSeoSettings()` 的預設值
- **修改**：新增 `getEffectiveSeoConfig()` 或讓 `SEO_CONFIG` 可從 seo-settings 覆寫；`createMetadata` 支援傳入從 settings 取得的 title/description

### 2. `src/app/layout.tsx`
- **用途**：根 layout 的 metadata
- **修改**：改用 `getSeoSettings()` 取得 defaultTitle、defaultDescription、ogImage；`getSiteSettings()` 取得 siteName；維持 fallback

### 3. `src/app/(main)/layout.tsx`
- **用途**：主內容區 layout，內含 Header、Footer
- **修改**：呼叫 `getSiteSettings()`，將 siteName、contact、footer、cta 傳給 Header 與 Footer

### 4. `src/components/layout/Header/Header.tsx`
- **用途**：全站 Header
- **修改**：無（已透過 props 取得 siteName、ctaHref、ctaLabel，由 layout 傳入）

### 5. `src/components/layout/Footer/Footer.tsx`
- **用途**：全站 Footer
- **修改**：無（已透過 props 取得 siteName、description、contact、copyright，由 layout 傳入）

### 6. `src/app/(main)/page.tsx`（首頁）
- **用途**：首頁
- **修改**：
  - Hero：改讀 `getHomeConfig().hero`
  - 課程分類入口：改讀 `getHomeConfig().categoryEntry`
  - 熱門課程區塊：標題、數量來自 `getHomeConfig().featuredCourses`
  - 為什麼選擇我們：改讀 `getHomeConfig().whyUs`
  - 頁尾 CTA：改讀 `getHomeConfig().cta`
  - metadata：改用 `getSeoSettings()` 或 `getHomeConfig()` 若有覆寫

### 7. `src/app/(main)/about/page.tsx`（關於我們）
- **用途**：關於我們頁
- **修改**：
  - 內容：改讀 `getAboutConfig()`
  - metadata：description 從 about intro 產生

### 8. `src/app/(main)/faq/page.tsx`（FAQ）
- **用途**：FAQ 頁
- **修改**：
  - FAQ 列表：改讀 `getFaqItems()`（取代直接 import faq.json）
  - 分類：改讀 `getFaqCategories()` 或從 items 衍生
  - 聯絡電話：改讀 `getSiteSettings().contact.phone`

---

## 二、不修改／暫不處理

| 項目 | 說明 |
|------|------|
| **最新消息頁** | 前台尚無 `/news` 路由，暫不建立 |
| **成果案例頁** | 前台尚無 `/cases` 路由，暫不建立 |
| **Banner 輪播** | 首頁 Hero 目前用 home config，banner 輪播可之後整合 |
| **Header 結構** | 僅改為由 layout 傳入 props，不動元件結構 |
| **Footer 結構** | 同上 |

---

## 三、資料來源對照

| 前台區塊 | 資料來源 |
|----------|----------|
| 根 layout metadata | `getSeoSettings()`、`getSiteSettings()` |
| Header (siteName, CTA) | `getSiteSettings()` |
| Footer (siteName, contact, copyright) | `getSiteSettings()` |
| 首頁 Hero | `getHomeConfig().hero` |
| 首頁課程分類 | `getHomeConfig().categoryEntry` |
| 首頁熱門課程標題 | `getHomeConfig().featuredCourses` |
| 首頁為什麼選擇我們 | `getHomeConfig().whyUs` |
| 首頁 CTA | `getHomeConfig().cta` |
| 關於我們內容 | `getAboutConfig()` |
| FAQ 列表 | `getFaqItems()` |
| FAQ 聯絡電話 | `getSiteSettings().contact.phone` |
