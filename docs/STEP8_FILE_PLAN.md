# Step 8 檔案計畫

## 一、資料模型補強

| 檔案 | 用途 |
|------|------|
| `src/lib/data/news.ts` | News 介面增加 image?, featured?, seoTitle?, seoDescription? |
| `src/lib/data/cases.ts` | CaseStudy 介面增加 category?, image?, featured?, seoTitle?, seoDescription? |
| `src/data/news.json` | 既有資料維持，新欄位可為空 |
| `src/data/cases.json` | 為既有案例補上 category（就業案例） |

## 二、共用元件

| 檔案 | 用途 |
|------|------|
| `src/components/shared/NewsCard.tsx` | 消息卡片，顯示封面、標題、摘要、日期、類型，Link 到 /news/[slug] |
| `src/components/shared/CaseCard.tsx` | 案例卡片，顯示封面、標題、摘要、年份、分類，Link 到 /cases/[slug]，精選樣式 |
| `src/components/shared/ContentMeta.tsx` | 內容 meta 區塊（類型、日期、返回按鈕） |
| `src/components/shared/FilterTabs.tsx` | 依類型/分類篩選的 Tab 元件 |
| `src/components/shared/index.ts` | 匯出新元件 |

## 三、News 頁面

| 檔案 | 用途 |
|------|------|
| `src/app/(main)/news/page.tsx` | 最新消息列表頁，Server Component，metadata + 傳資料給 Client |
| `src/app/(main)/news/NewsPageClient.tsx` | Client：篩選、列表、空狀態 |
| `src/app/(main)/news/[slug]/page.tsx` | 單篇消息詳細頁，generateStaticParams + notFound |
| `src/app/(main)/news/[slug]/NewsDetailClient.tsx` | Client：內容渲染、返回、CTA |

## 四、Cases 頁面

| 檔案 | 用途 |
|------|------|
| `src/app/(main)/news/page.tsx` | 成果案例列表頁 |
| `src/app/(main)/cases/CasesPageClient.tsx` | Client：篩選、列表、空狀態 |
| `src/app/(main)/cases/[slug]/page.tsx` | 單篇案例詳細頁 |
| `src/app/(main)/cases/[slug]/CaseDetailClient.tsx` | Client：內容、metrics、返回、CTA |

## 五、常數與型別

| 檔案 | 用途 |
|------|------|
| `src/constants/news.ts` | NEWS_TYPE_LABELS（announcement→招生公告 等） |
| `src/constants/cases.ts` | CASE_CATEGORY_LABELS（就業案例、創業案例 等） |
