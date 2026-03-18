# Zeabur 部署規劃 — 職訓課程招生網

> 本文為規劃文件，僅供參考，**尚未執行任何部署操作**。

---

## 1. 專案現況摘要

| 項目 | 目前設定 |
|------|----------|
| 框架 | Next.js 14.2.18 |
| 輸出模式 | `output: "export"`（靜態匯出） |
| 目前部署 | GitHub Pages（`output/` → Pages） |
| basePath | `/class_demo`（因應 GitHub Pages 子路徑） |
| 資料來源 | JSON 檔案 + localStorage（admin） |

### 與 GitHub Pages 的差異

| 項目 | GitHub Pages | Zeabur |
|------|--------------|--------|
| 網域 | `username.github.io/repo-name/` | `xxx.zeabur.app` 或自訂網域（根路徑） |
| basePath | 需設為 repo 名稱 | 通常為空或 `/` |
|  build | GitHub Actions 執行 | Zeabur 自動偵測並執行 |
| 靜態輸出 | `out/` 資料夾 | 需確認 Zeabur 對 Next.js 靜態匯出的處理方式 |

---

## 2. Zeabur 部署前準備

### 2.1 前置條件檢查

- [ ] 專案已推送到 **GitHub**（Zeabur 需從 GitHub 匯入）
- [ ] 具備 Zeabur 帳號（可用 GitHub 登入）
- [ ] 確認 `package.json` 有 `build` 指令：`npm run build`

### 2.2 basePath 調整（重要）

**現況**：`next.config.js` 將 `basePath` 設為 `/class_demo`，是為了配合 GitHub Pages 的 `username.github.io/class_demo/` 路徑。

**Zeabur**：使用 `.zeabur.app` 或自訂網域時，網站通常在根路徑（如 `https://xxx.zeabur.app/`），因此 basePath 應為空。

**建議**：在 `next.config.js` 中以環境變數控制 basePath，部署到 Zeabur 時設定 `NEXT_PUBLIC_BASE_PATH=`（空字串）或 `NEXT_PUBLIC_BASE_PATH=/`。

---

## 3. 部署方案比較

### 方案 A：Next.js 標準模式（Zeabur 自動偵測）

**流程**：Zeabur 偵測到 Next.js → 執行 `npm run build` → 以 Node 服務方式運行。

**需注意**：專案目前為 `output: "export"`，產出為靜態 HTML，通常由靜態主機提供。若 Zeabur 預期以 `next start` 執行，可能須確認平台是否支援靜態匯出或需調整設定。

**適用**：Zeabur 已完整支援 Next.js 靜態匯出。

---

### 方案 B：改為 Node 服務模式

**作法**：移除 `next.config.js` 中的 `output: "export"`，改為一般 Next.js SSR/SSG 模式。

**優點**：
- 完全符合 Zeabur 的 Next.js 部署流程
- 之後若需要 API Routes、Server Components 等，可直接擴充

**缺點**：
- 架構變動較大
- 需要 Zeabur 維持 Node 執行環境

---

### 方案 C：純靜態部署

**作法**：保持 `output: "export"`，建置完成後以 `out/` 資料夾作為靜態網站在 Zeabur 部署。

**Zeabur 靜態說明**：
- 支援 SPA/MPA
- 可設定 `_redirects`、`_headers`、`404.html`
- 需確認 Zeabur 是否支援從 Next.js 建置產物中指定 `out/` 作為靜態根目錄

**適用**：若 Zeabur 可將 Node 建置的 `outputDir` 對應到 `out/`（文件提及 Build Logs 中可能有 `outputDir` 欄位）。

---

## 4. 建議執行步驟（規劃）

### 步驟 1：調整 basePath 為環境可配置

在 `next.config.js` 中，改為依環境變數決定 basePath：

```javascript
// next.config.js 範例
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/class_demo";
const assetPrefix = basePath ? `${basePath}/` : "/";
```

-  Zeabur：設定 `NEXT_PUBLIC_BASE_PATH=`（空）或 `/`
- GitHub Actions：保持 `NEXT_PUBLIC_BASE_PATH=/${{ github.event.repository.name }}`

---

### 步驟 2：建立 Zeabur 環境變數

在 Zeabur 服務的 **Variables** 頁籤設定：

| 變數名稱 | 建議值 | 說明 |
|----------|--------|------|
| `NEXT_PUBLIC_BASE_PATH` | （空）或 `/` | Zeabur 為根路徑 |
| `NEXT_PUBLIC_SITE_URL` | `https://你的網域/` | SEO、sitemap 等用途 |

---

### 步驟 3：Zeabur 操作流程

1. 登入 [Zeabur](https://zeabur.com)，用 GitHub 授權
2. **Create Project** → 選擇區域
3. **Deploy service** / **Add new service** → **Deploy from GitHub**
4. 完成 GitHub 授權後，選擇本專案 repository
5. 匯入後，Zeabur 會自動偵測為 Next.js 並開始建置

---

### 步驟 4：綁定網域

1. 在服務頁面進入 **Domain** 頁籤
2. 選擇 **Generate Domain** 取得 `.zeabur.app` 免費網域
3. 若有自訂網域，可在同一頁面新增並設定 DNS

---

### 步驟 5：驗證

- 檢查首頁：`https://你的網域/`
- 檢查課程：`https://你的網域/courses`
- 檢查後台：`https://你的網域/admin`
- 若有 basePath，需確認靜態資源與連結路徑正確

---

## 5. 潛在問題與對策

| 問題 | 可能原因 | 對策 |
|------|----------|------|
| 404 或空白頁 | basePath 設定錯誤 | 確認 Zeabur 環境變數 `NEXT_PUBLIC_BASE_PATH` |
| 靜態匯出與平台不符 | Zeabur 預期 `next start` 而非靜態 | 考慮改為一般 Next.js 模式或聯繫 Zeabur 支援 |
| 圖片無法載入 | `images: { unoptimized: true }` 與 basePath | 確認 `assetPrefix` 與實際路徑一致 |
| admin 資料遺失 | 使用 localStorage | 預期行為；正式環境需接後端 API 或 CMS |

---

## 6. 檔案與環境對照

| 檔案 | 是否需要修改 |
|------|--------------|
| `next.config.js` | 建議：basePath 改為可配置 |
| `package.json` | 不需要（已有 build 指令） |
| `.gitignore` | 不需要 |
| GitHub Actions | 建議保留，以維持 GitHub Pages 部署 |

---

## 7. 檢查清單（部署前）

- [ ] 已將 basePath 改為可用環境變數控制
- [ ] 已在 Zeabur 設定 `NEXT_PUBLIC_BASE_PATH`
- [ ] 專案已推送到 GitHub 且為最新狀態
- [ ] 已了解 Zeabur 對 Next.js 靜態匯出的支援方式
- [ ] 若需同時保留 GitHub Pages，已確認 basePath 在不同環境下正確切換

---

*本文僅供規劃使用，實際部署時可依 Zeabur 平台行為與文件微調。*
