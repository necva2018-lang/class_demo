# Step 8 完成摘要

## 一、已完成頁面

| 頁面路由 | 是否完成 | 功能狀態 | 備註 |
|----------|----------|----------|------|
| /news | ❌ 未完成 | 檔案不存在 | 導航有連結，但 `src/app/(main)/news/page.tsx` 未建立 |
| /news/[slug] | ❌ 未完成 | 檔案不存在 | `src/app/(main)/news/[slug]/page.tsx` 未建立 |
| /cases | ❌ 未完成 | 檔案不存在 | 導航有連結，但 `src/app/(main)/cases/page.tsx` 未建立 |
| /cases/[slug] | ❌ 未完成 | 檔案不存在 | `src/app/(main)/cases/[slug]/page.tsx` 未建立 |

---

## 二、新增／修改檔案

| 檔案路徑 | 類型 | 用途 |
|----------|------|------|
| src/lib/data/news.ts | 已存在 | 消息資料層：getNews、getNewsBySlug、localStorage 持久化 |
| src/lib/data/cases.ts | 已存在 | 案例資料層：getCases、getCaseBySlug、localStorage 持久化 |
| src/lib/seo.ts | 已存在 | SEO 工具：createMetadata、getEffectiveSeoConfig、og image fallback |
| src/components/shared/NewsCard.tsx | 已存在 | 最新消息卡片元件，支援 type、featured、image |
| src/components/shared/CaseCard.tsx | 已存在 | 成果案例卡片元件，支援 category、featured、image |
| src/components/shared/ContentMeta.tsx | 已存在 | 內容元資訊：type、date、year、extra |
| src/components/shared/EmptyState/EmptyState.tsx | 已存在 | 空狀態元件 |
| src/components/shared/FilterTabs.tsx | 已存在 | 篩選分頁元件（client） |
| src/app/(main)/news/page.tsx | 未建立 | — |
| src/app/(main)/news/[slug]/page.tsx | 未建立 | — |
| src/app/(main)/cases/page.tsx | 未建立 | — |
| src/app/(main)/cases/[slug]/page.tsx | 未建立 | — |
| src/components/shared/PageHero.tsx | 未建立 | — |

---

## 三、資料模型與資料來源

### news 與 cases 欄位支援狀況

**News 介面**（`src/lib/data/news.ts`）已支援：
- 必備：id、slug、title、summary、type、publishedAt
- 選用：content、image、featured、seoTitle、seoDescription

**CaseStudy 介面**（`src/lib/data/cases.ts`）已支援：
- 必備：id、slug、title、summary
- 選用：content、courseName、year、metrics、publishedAt、category、image、featured、seoTitle、seoDescription

### 預設 JSON 與實際資料

**news.json** 實際欄位：
- 有：id、slug、title、summary、type、publishedAt、createdAt
- 缺：content、image、featured、seoTitle、seoDescription

**cases.json** 實際欄位：
- 有：id、slug、title、summary、year、metrics、courseName
- 缺：content、category、image、featured、publishedAt、seoTitle、seoDescription

**結論**：型別與資料層已定義完整欄位，但預設 JSON 尚缺部分欄位；若後台編輯補上，即可顯示。

---

## 四、SEO / metadata 狀態

| 頁面 | 是否有 metadata | 動態 metadata | fallback |
|------|-----------------|---------------|----------|
| /news | ❌ 無（頁面未建立） | — | — |
| /news/[slug] | ❌ 無（頁面未建立） | — | — |
| /cases | ❌ 無（頁面未建立） | — | — |
| /cases/[slug] | ❌ 無（頁面未建立） | — | — |

**共用 SEO 工具**（`src/lib/seo.ts`）已具備：
- `createMetadata()`：支援 title、description、path、image、og、twitter、canonical
- `getEffectiveSeoConfig()`：seo-settings + site-settings 合併
- og image fallback：無 image 時使用 `defaultOgImage`
- 全站 fallback：FALLBACK_SEO 預設值

---

## 五、localStorage / hydration 狀態

- **讀取策略**：`createStorageStore`（`src/lib/admin-storage.ts`）
  - SSR / getStaticProps：`!isClient()` 時回傳 `defaultValue`（JSON）
  - Client：優先讀取 localStorage，無則回傳 `defaultValue`

- **hydration guard / client wrapper**：無專門處理

- **閃爍風險**：
  - 若後台修改過 news/cases 並寫入 localStorage，首次載入時 SSR 輸出預設 JSON，client hydration 時改用 localStorage → 可能出現內容 briefly 變動
  - 未使用 `suppressHydrationWarning` 或 client-only 包裝

---

## 六、未完成或待補強項目

1. **缺少的頁面**
   - `/news` 列表頁
   - `/news/[slug]` 詳細頁
   - `/cases` 列表頁
   - `/cases/[slug]` 詳細頁

2. **缺少的元件**
   - `PageHero` 尚未建立；可選方案：建立共用元件，或沿用 courses/about 的 inline header

3. **缺少的 SEO 處理**
   - 上述四個頁面尚未掛載 metadata
   - 詳細頁需實作 `generateMetadata`，並使用 `createMetadata` 與 seoTitle / seoDescription / image fallback

4. **缺少的資料欄位（預設 JSON）**
   - news.json：content、image、featured、seoTitle、seoDescription
   - cases.json：content、category、image、featured、publishedAt、seoTitle、seoDescription

5. **其他限制**
   - 導航與 Footer 已連結 `/news`、`/cases`，但目前會 404
   - 課程詳細頁 `courses/[id]` 的 `generateMetadata` 僅回傳 `{ title, description }`，未使用 `createMetadata`，缺少完整 og image 等設定

---

## 七、結論

**Step 8 完成度約 50%。**

- **已完成**：資料層（getNews、getCases、依 slug 取單筆）、localStorage 持久化、共用元件（NewsCard、CaseCard、ContentMeta、EmptyState、FilterTabs）、SEO 工具、型別定義  
- **未完成**：四個前台頁面、PageHero 元件、news/cases 的 metadata、預設 JSON 部分欄位

**建議下一步**：優先建立 `/news` 與 `/cases` 列表頁及對應的詳細頁，並在頁面中設定 `metadata` / `generateMetadata`。資料層與元件已齊備，可直接引入並呈現，再視需要補上 PageHero 與預設 JSON 的欄位。
