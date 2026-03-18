# 資料庫規劃 — 測試階段與正式部署

> 依據專案：職訓課程網站 | `output: "export"` 靜態輸出 | GitHub Pages / Vercel 部署

---

## 一、目前架構摘要

| 項目 | 說明 |
|------|------|
| **建置方式** | Next.js `output: "export"` → 純靜態 HTML/JS/CSS |
| **資料來源** | `src/data/*.json` 靜態 JSON + `lib/admin-storage.ts` localStorage |
| **後台儲存** | Admin 編輯結果存於瀏覽器 `localStorage` |
| **部署目標** | GitHub Pages（靜態）、或 Vercel |

**重點**：靜態導出（static export）沒有執行期伺服器，前端無法直接連線到資料庫。

---

## 二、測試階段的規劃

### 2.1 現狀維持（建議）

| 用途 | 方式 | 說明 |
|------|------|------|
| **前台資料** | `src/data/*.json` | 課程、分類、新聞、案例、FAQ、橫幅等 |
| **後台編輯** | localStorage（`admin-storage.ts`） | 編輯後暫存於本機瀏覽器 |
| **開發體驗** | `npm run dev` | 改 JSON 或 localStorage 即可測試 UI |

**優點**：

- 不需額外服務或資料庫
- 修改即生效，方便迭代
- 適合本地與 PR 預覽環境

### 2.2 測試用環境變數

```env
# .env.local（開發 / 測試）
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2.3 可選：測試資料隔離

若需要多套測試資料，可建立：

```
src/data/
├── courses.json          # 預設（或 production 種子）
├── fixtures/
│   └── courses-test.json # 測試用資料
```

在 `lib/data/courses.ts` 依環境或 flag 選擇載入哪一份 JSON。

---

## 三、正式部署的規劃

正式環境需要**真實的持久化儲存**，因為：

- localStorage 僅限單一裝置 / 單一瀏覽器
- JSON 在 build 時被寫死，無法即時更新
- Admin 編輯無法跨裝置、跨訪客共享

### 3.1 方案選擇（依預算與需求）

| 方案 | 適用情境 | 複雜度 | 備註 |
|------|----------|--------|------|
| **A. Headless CMS** | 內容為主、非技術編輯 | 低 | 推薦：Sanity、Strapi、Contentful |
| **B. 自建 API + DB** | 需要自訂邏輯或較細權限 | 中高 | 需後端與 DB 主機 |
| **C. Serverless + DB** | 要動態頁面 + 控制成本 | 中 | Vercel Functions + 雲端 DB |
| **D. 靜態 + 定時重建** | 內容不需即時 | 低 | 用 GitHub Actions 定期 build |

以下分別說明。

---

### 3.2 方案 A：Headless CMS

**流程**：

```
CMS（Strapi/Sanity 等）→ API → 前端 fetch（build 或 client）
```

**與現有架構的銜接**：

- 新增 `lib/api/` 作為 API 呼叫與轉換層
- 在 `lib/data/*.ts` 中依 `NEXT_PUBLIC_USE_MOCK` 切換：  
  - `true` → 讀 JSON  
  - `false` → 呼叫 CMS API
- 回傳格式不同時，寫 `apiResponseToCourse()` 等轉換函式

**建議 CMS**：

- **Sanity**：Schema 彈性、免費額度大，適合課程、新聞等
- **Strapi**：自架、可完全掌握
- **Contentful**：企業級、API 穩定

**環境變數**：

```env
# .env.production
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_CMS_URL=https://your-cms.example.com
NEXT_PUBLIC_CMS_TOKEN=xxx
# 或各 CMS 的 PROJECT_ID、DATASET 等
```

---

### 3.3 方案 B：自建 API + 關聯式／NoSQL 資料庫

**架構**：

```
前端（靜態或 SPA） → REST/GraphQL API → 應用伺服器 → DB
```

**資料庫建議**：

| 類型 | 範例 | 適用 |
|------|------|------|
| 關聯式 | PostgreSQL、MySQL | 課程、分類、關係明確 |
| NoSQL | MongoDB、Supabase | 結構常有變動或 JSON 友善 |
| 無伺服器 DB | Supabase、PlanetScale | 不想自管主機 |

**銜接方式**：

1. 後端提供 `/api/courses`、`/api/courses/:id` 等
2. 前端在 `lib/api/courses.ts` 實作 `fetchCourses`、`fetchCourseById`
3. `lib/data/courses.ts` 改為 async，依環境變數決定用 mock 或 API

---

### 3.4 方案 C：Vercel 部署 + Serverless + 雲端 DB

若改為部署在 Vercel（而非 GitHub Pages 靜態檔）：

- 可啟用 API Routes / Server Actions
- 在 API 內使用 Prisma、Drizzle 或直接連線到雲端 DB
- 頁面可採用 SSG、ISR 或 SSR，依需求選擇

**適合**：想保留 Next.js 全功能，又希望簡單擴充 DB。

---

### 3.5 方案 D：GitHub Pages 靜態 + 定時重建

維持目前靜態輸出與 GitHub Pages：

- 後台或 CMS 變更後，觸發 GitHub Actions 重新 `npm run build` 並 deploy
- 資料在 **build 時** 從 API 拉取，寫入靜態頁
- 適合：更新頻率低（如每日一次）、可接受延遲

**GitHub Actions 範例**：

```yaml
# 每日 00:00 或 webhook 觸發
- run: npm run build
  env:
    NEXT_PUBLIC_USE_MOCK: false
    NEXT_PUBLIC_CMS_URL: ${{ secrets.CMS_URL }}
    # 若 build 時會呼叫 API，需在 build 步驟能取得資料
```

---

## 四、資料層抽象與環境切換

不論選哪種方案，建議維持統一的資料介面：

```typescript
// lib/data/courses.ts 概念結構
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export async function getCourses(params?: CourseFilterParams): Promise<Course[]> {
  if (USE_MOCK) {
    return getMockCourses(params);  // 讀 JSON / localStorage
  }
  const res = await fetchCoursesFromApi(params);
  return res.map(apiResponseToCourse);
}
```

**好處**：

- 測試與正式環境只差環境變數
- 頁面與元件只依賴 `Course` 型別，不直接依賴 API 格式
- 之後更換資料來源時，只需改 `lib/data/*.ts` 與 `lib/api/*.ts`

---

## 五、環境設定整理

| 環境 | `NEXT_PUBLIC_USE_MOCK` | 資料來源 |
|------|------------------------|----------|
| 本地開發 | `true` | JSON + localStorage |
| 測試／預覽 | `true` 或 `false` | 依需要切換 |
| 正式部署 | `false` | CMS API / 自建 API |

對應檔案：`.env.local`（開發）、`.env.production`（正式）、GitHub Actions 的 `env`。

---

## 六、建議路徑（依階段）

1. **測試階段**：維持 JSON + localStorage，用 `NEXT_PUBLIC_USE_MOCK=true`。
2. **正式上線前**：選擇 CMS 或自建 API，實作 `lib/api/` 與轉換層。
3. **部署**：
   - 若用 GitHub Pages 靜態：採用方案 D（定時 rebuild）或 build 時拉 API。
   - 若用 Vercel：可直接採用方案 C（Serverless + DB）。

若有目標平台（例如一定要 GitHub Pages 或一定要 Vercel），可以再細化該平台的部署與資料流程。
