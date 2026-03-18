# 前後端整合檢查報告

> 檢查日期：依程式碼狀態

---

## 一、資料來源總覽

| 資料類型 | AppConfig Key | 資料層 | 前台頁面 | 後台頁面 | API | withBasePath |
|----------|---------------|--------|----------|----------|-----|--------------|
| **課程** | courses | config-store | /courses, /courses/[id], / | /admin/courses | /api/config/courses | ✅ |
| **分類** | categories | config-store | /courses, / | - (開發中) | /api/config/categories | N/A |
| **首頁** | home | config-store | / | /admin/home | /api/config/home | ✅ |
| **最新消息** | news | config-store | /news, /news/[slug] | /admin/news | /api/config/news | ✅ |
| **FAQ** | faq | config-store | /faq | /admin/faqs | /api/config/faq | ✅ |
| **成果案例** | cases | config-store | /cases, /cases/[slug] | /admin/stories | /api/config/cases | ✅ |
| **關於我們** | about | config-store | /about | /admin/about | /api/config/about | ✅ |
| **網站設定** | settings | config-store | layout (Header/Footer) | /admin/settings | /api/config/settings | ✅ |
| **SEO 設定** | seo | config-store | metadata | /admin/seo | /api/config/seo | ✅ |
| **Banner** | Banner 表 | prisma | / (HomeBannerClient) | /admin/banners | /api/banners | ✅ |

---

## 二、已整合項目 ✅

1. **API 路徑**：所有 `/api/config/*`、`/api/banners` 的 fetch 已加上 `withBasePath`
2. **資料層**：前台與後台皆透過 `getAppConfig` / Prisma 讀寫同一資料來源
3. **動態渲染**：主要資料頁面已設定 `export const dynamic = "force-dynamic"`
4. **Seed**：courses、categories 會在 DB 空的時候寫入 AppConfig

---

## 三、尚未完全整合項目 ⚠️

### 1. SEO 設定 ✅（已整合）

- 已改為 `getEffectiveSeoConfigAsync()` 從 DB 讀取 seo + site settings
- 所有頁面 metadata 改為 `generateMetadata` 使用 `createMetadataWithConfig(config, params)`
- 後台 SEO 修改會即時反映在前台 metadata

### 2. 課程分類管理

- **狀況**：`/admin/categories` 為佔位頁，尚未實作
- **影響**：分類僅能透過 seed/JSON 或直接寫入 DB 更新
- **建議**：補上分類的 CRUD 後台與 API 串接

### 3. (main) Layout 動態設定

- **狀況**：`(main)/layout.tsx` 呼叫 `getSiteSettings()`，但 layout 本身未設定 `dynamic`
- **影響**：在部分快取情境下，Header/Footer 可能顯示舊的網站名稱與設定
- **建議**：在 layout 加上 `export const dynamic = "force-dynamic"`，或確認子頁面的 dynamic 會正確往上傳遞

---

## 四、Seed 覆蓋範圍

目前 seed 會寫入：
- `Banner` 表
- AppConfig：`courses`、`categories`

其餘 AppConfig（`news`、`faq`、`cases`、`home`、`about`、`settings`、`seo`）：
- 首次由 `getAppConfig` 的 fallback 提供
- 後台第一次儲存後才會在 DB 建立

若希望新環境與預設 JSON 完全一致，可將這些也納入 seed。

---

## 五、頁面與 dynamic 設定

| 頁面 | dynamic | 資料來源 |
|------|---------|----------|
| / | ✅ | getHomeConfig, getFeaturedCourses, getCategories |
| /courses | ✅ | getCourses, getCategories |
| /courses/[id] | ✅ | getCourseById, getCoursesByCategory |
| /news | ✅ | getNews |
| /news/[slug] | ✅ | getNewsBySlug |
| /faq | ✅ | getFaqItems, getFaqCategories, getSiteSettings |
| /about | ✅ | getAboutConfig, getSiteSettings |
| /cases | ✅ | getCases |
| /cases/[slug] | ✅ | getCaseBySlug |
| /apply | ❌ | 無後端資料 |
| (main)/layout | ❌ | getSiteSettings |

---

## 六、總結

- **已整合**：課程、首頁、消息、FAQ、案例、關於我們、網站設定、Banner、**SEO metadata**
- **需調整**：課程分類管理（/admin/categories 為佔位頁）
