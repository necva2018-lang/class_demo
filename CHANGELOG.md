# Changelog

## [1.5.0] - 2025-03-15

### 新增

- 前台最新消息頁面：`/news`、`/news/[slug]`
- 前台成果案例頁面：`/cases`、`/cases/[slug]`
- PageHero 共用元件
- useClientStorage hook（hydration guard）
- news.json、cases.json 補強欄位（content、image、featured、seoTitle、seoDescription、category、publishedAt）

### 修正

- courses/[id] SEO：整合 createMetadata，完整 og image 與 canonical
- AdminCourseFormWrapper：補齊 title、subtitle 必填與傳遞
- AdminHomeForm：匯出至 @/components/admin

### 已知限制

- Mock data，無真實 API
- localStorage 持久化僅限 browser
- Admin 無登入機制
