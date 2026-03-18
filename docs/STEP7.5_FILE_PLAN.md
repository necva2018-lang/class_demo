# Step 7.5 檔案修改計畫

## 1. CourseForm 儲存流程補齊

| 檔案 | 用途 |
|------|------|
| `src/components/admin/courses/AdminCourseFormWrapper.tsx` | Client 包裝元件，提供 onSave：呼叫 setCoursesLocal + router.push |
| `src/app/admin/courses/[id]/page.tsx` | 改為使用 AdminCourseFormWrapper，傳入 course |
| `src/app/admin/courses/new/page.tsx` | 改為使用 AdminCourseFormWrapper，傳入 null |

## 2. 各模組 Reset UI

| 檔案 | 用途 |
|------|------|
| `src/app/admin/about/AdminAboutPageClient.tsx` | Client wrapper：Reset 按鈕 + AdminAboutForm |
| `src/app/admin/settings/AdminSettingsPageClient.tsx` | Client wrapper：Reset 按鈕 + AdminSettingsForm |
| `src/app/admin/seo/AdminSeoPageClient.tsx` | Client wrapper：Reset 按鈕 + AdminSeoForm |
| `src/app/admin/banners/AdminBannersPageClient.tsx` | Client wrapper：Reset + 載入 getBanners |
| `src/app/admin/faqs/AdminFaqsPageClient.tsx` | Client wrapper：Reset + 載入 getFaqItems |
| `src/app/admin/news/AdminNewsPageClient.tsx` | Client wrapper：Reset + 載入 getNews |
| `src/app/admin/stories/AdminStoriesPageClient.tsx` | Client wrapper：Reset + 載入 getCases |
| `src/app/admin/courses/AdminCoursesPageClient.tsx` | Client wrapper：Reset + 載入 getCourses |
| `src/app/admin/categories/AdminCategoriesPageClient.tsx` | Client wrapper：Reset 按鈕（模組尚為 placeholder） |
| 對應 `page.tsx` | 改為渲染上述 Client 元件 |

## 3. 移除重複 import

| 檔案 | 修改 |
|------|------|
| `src/components/admin/news/AdminNewsList.tsx` | 若有重複 setNewsLocal import 則移除 |
| `src/components/admin/stories/AdminStoriesList.tsx` | 若有重複 setCasesLocal import 則移除 |

## 4. 前台 localStorage hydration 補強

| 檔案 | 用途 |
|------|------|
| `src/components/shared/ClientStoreGate.tsx` | 延遲渲染，等 mount 後再顯示 children（減少 SSR/client 不一致閃爍） |
| `src/app/(main)/faq/FAQPageWithClientData.tsx` | 在 Gate 內取 getFaqItems，傳給 FAQPageClient |
| `src/app/(main)/faq/page.tsx` | 改用 ClientStoreGate + FAQPageWithClientData |
| `src/app/(main)/courses/CoursesPageWithClientData.tsx` | 在 Gate 內取 getCourses、getCategories，傳給 CoursesPageClient |
| `src/app/(main)/courses/page.tsx` | 改用 ClientStoreGate + CoursesPageWithClientData |
