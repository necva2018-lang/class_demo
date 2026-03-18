# Step 5 檔案規劃

## 一、新增檔案

### Types
| 檔案 | 用途 |
|------|------|
| `src/types/home.ts` | HomePageConfig 介面，首頁各區塊設定 |
| `src/types/banner.ts` | Banner 介面，支援輪播 |
| `src/types/about.ts` | AboutConfig 介面 |
| `src/types/site-settings.ts` | SiteSettings 介面 |
| `src/types/seo-settings.ts` | SeoSettings 介面 |
| `src/types/index.ts` | 更新 export 上述 types |

### Mock Data
| 檔案 | 用途 |
|------|------|
| `src/data/home-config.json` | 首頁設定 mock |
| `src/data/banners.json` | Banner 列表 mock |
| `src/data/about-config.json` | 關於我們 mock |
| `src/data/site-settings.json` | 網站設定 mock |
| `src/data/seo-settings.json` | SEO 設定 mock |

### Lib/Data
| 檔案 | 用途 |
|------|------|
| `src/lib/data/home.ts` | getHomeConfig() |
| `src/lib/data/banners.ts` | getBanners(), getBannerById() |
| `src/lib/data/about.ts` | getAboutConfig() |
| `src/lib/data/settings.ts` | getSiteSettings() |
| `src/lib/data/seo-settings.ts` | getSeoSettings() |

### Admin UI 元件（共用）
| 檔案 | 用途 |
|------|------|
| `src/components/admin/ui/AdminArrayField.tsx` | 陣列欄位（新增/刪除項目） |
| `src/components/admin/ui/index.ts` | 更新 export |

### Admin 表單元件
| 檔案 | 用途 |
|------|------|
| `src/components/admin/home/AdminHomeForm.tsx` | 首頁內容表單 |
| `src/components/admin/banners/AdminBannersList.tsx` | Banner 列表與 inline 編輯 |
| `src/components/admin/about/AdminAboutForm.tsx` | 關於我們表單 |
| `src/components/admin/settings/AdminSettingsForm.tsx` | 網站設定表單 |
| `src/components/admin/seo/AdminSeoForm.tsx` | SEO 設定表單 |

## 二、修改檔案

| 檔案 | 修改內容 |
|------|----------|
| `src/app/admin/home/page.tsx` | 使用 AdminHomeForm，傳入 getHomeConfig() |
| `src/app/admin/banners/page.tsx` | 使用 AdminBannersList |
| `src/app/admin/about/page.tsx` | 使用 AdminAboutForm |
| `src/app/admin/settings/page.tsx` | 使用 AdminSettingsForm |
| `src/app/admin/seo/page.tsx` | 使用 AdminSeoForm |
| `src/types/index.ts` | 新增 export |

## 三、不改動

- 既有 admin layout、sidebar、header
- 既有 courses、categories、faqs、news、stories 模組
- `src/lib/seo.ts`（保留現有 createMetadata，SEO 設定為 admin 可編輯的 config 來源）
