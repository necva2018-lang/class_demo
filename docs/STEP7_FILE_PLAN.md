# Step 7 實作計畫：localStorage Persistence

## 檔案清單

### 新增檔案
| 檔案 | 用途 |
|------|------|
| `src/components/admin/ui/AdminResetButton.tsx` | 可重用「還原為預設值」按鈕 |
| `docs/STEP7_FILE_PLAN.md` | 本計畫說明 |

### 修改檔案
| 檔案 | 變更 |
|------|------|
| `src/lib/data/courses.ts` | 為 categories 加入 store、setCategoriesLocal、resetCategoriesDefault |
| `src/components/admin/ui/index.ts` | 匯出 AdminResetButton |
| `src/components/admin/home/AdminHomeForm.tsx` | 接收 onSave 時呼叫 setHomeConfigLocal |
| `src/components/admin/about/AdminAboutForm.tsx` | handleSubmit 呼叫 setAboutConfigLocal |
| `src/components/admin/settings/AdminSettingsForm.tsx` | handleSubmit 呼叫 setSiteSettingsLocal |
| `src/components/admin/seo/AdminSeoForm.tsx` | handleSubmit 呼叫 setSeoSettingsLocal |
| `src/components/admin/banners/AdminBannersList.tsx` | 在 handleSave、handleDelete、handleMove 後呼叫 setBannersLocal |
| `src/components/admin/faqs/AdminFaqList.tsx` | 在 handleSaveEdit、handleSaveNew、handleDelete 後呼叫 setFaqItemsLocal |
| `src/components/admin/news/AdminNewsList.tsx` | 在 save/delete 後呼叫 setNewsLocal |
| `src/components/admin/stories/AdminStoriesList.tsx` | 在 save/delete 後呼叫 setCasesLocal |
| `src/components/admin/courses/AdminCoursesList.tsx` | handleDelete 後呼叫 setCoursesLocal |
| `src/components/admin/courses/CourseForm.tsx` | 內建 persist 邏輯（setCoursesLocal）+ onSave 給 redirect |
| `src/app/admin/home/page.tsx` | 改 client，載入 getHomeConfig()，傳 onSave、reset 按鈕 |
| `src/app/admin/about/page.tsx` | 改 client，加入 reset 按鈕 |
| `src/app/admin/settings/page.tsx` | 改 client，加入 reset 按鈕 |
| `src/app/admin/seo/page.tsx` | 改 client，加入 reset 按鈕 |
| `src/app/admin/banners/page.tsx` | 改 client，載入 getBanners()，加入 reset 按鈕 |
| `src/app/admin/faqs/page.tsx` | 改 client，載入 getFaqItems()，加入 reset 按鈕 |
| `src/app/admin/news/page.tsx` | 改 client，載入 getNews()，加入 reset 按鈕 |
| `src/app/admin/stories/page.tsx` | 改 client，載入 getCases()，加入 reset 按鈕 |
| `src/app/admin/courses/page.tsx` | 改 client，載入 getCourses()，加入 reset 按鈕 |
| `src/app/admin/courses/[id]/page.tsx` | 改用 client 包裝以傳遞 onSave |
| `src/app/admin/courses/new/page.tsx` | 改用 client 包裝以傳遞 onSave |

### 不需修改（已具備 storage）
| 檔案 | 說明 |
|------|------|
| `src/lib/admin-storage.ts` | 已有 createStorageStore |
| `src/lib/data/home.ts` | 已有 store、set、reset |
| `src/lib/data/about.ts` | 已有 |
| `src/lib/data/settings.ts` | 已有 |
| `src/lib/data/seo-settings.ts` | 已有 |
| `src/lib/data/banners.ts` | 已有 |
| `src/lib/data/faq.ts` | 已有 |
| `src/lib/data/news.ts` | 已有 |
| `src/lib/data/cases.ts` | 已有 |
