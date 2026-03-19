# Zeabur 部署計畫 — Class Demo（職訓課程平台）

本文件為 **Zeabur 正確安裝 Web 服務與 PostgreSQL 資料庫** 的完整部署計畫，請依序執行。

---

## 部署順序總覽

```
1. 建立專案 → 2. 先加「PostgreSQL」→ 3. 再加「Web（GitHub 原始碼）」→ 4. 設定變數與連結
```

**重要：** 必須先建立資料庫服務，再部署 Web 服務，並讓 Web 服務能取得 `DATABASE_URL`，啟動時才會通過 migration 與 seed。

---

## 一、在 Zeabur 建立專案與服務

### 步驟 1：建立專案並加入「資料庫」服務

| 步驟 | 操作 |
|------|------|
| 1-1 | 登入 [zeabur.com](https://zeabur.com) |
| 1-2 | **Create Project**（或選擇現有專案） |
| 1-3 | **Add Service** → **Database** → **PostgreSQL** |
| 1-4 | 等待 PostgreSQL 服務建立並啟動完成（狀態為 Running） |

完成後，專案內會有一個 **PostgreSQL** 服務。Zeabur 會自動產生連線用環境變數（例如 `POSTGRES_CONNECTION_STRING`、`POSTGRES_URI` 或 `POSTGRES_USERNAME` / `POSTGRES_PASSWORD` / `POSTGRES_HOST` / `POSTGRES_PORT` / `POSTGRES_DATABASE`）。

### 步驟 2：加入「Web」服務（從 GitHub）

| 步驟 | 操作 |
|------|------|
| 2-1 | 同一專案內，**Add Service** → **Deploy your source code**（或 Git / GitHub） |
| 2-2 | 連動 GitHub（若尚未連動，依畫面授權） |
| 2-3 | 搜尋 **class_demo**，選擇 **necva2018-lang/class_demo** → **Import** |
| 2-4 | 等待 Zeabur 偵測到專案（會依 `zbpack.json` 或偵測到 Next.js 使用對應建置流程） |

此時專案內應有兩個服務：**PostgreSQL**、**class_demo（Web）**。

---

## 二、連結資料庫與 Web 服務（取得 DATABASE_URL）

Web 服務啟動時會執行 `prisma migrate deploy` 與 `prisma db seed`，**必須**能取得正確的 `DATABASE_URL`。

### 方式 A：使用 Zeabur「連結 / Link」功能（建議）

| 步驟 | 操作 |
|------|------|
| A-1 | 進入 **class_demo（Web 服務）** 的設定頁 |
| A-2 | 找到 **Variables** 或 **Connections / 連結** |
| A-3 | 若有 **Link to PostgreSQL** 或 **連結至 Postgres**，點選並選擇剛建立的 **PostgreSQL** 服務 |
| A-4 | Zeabur 會注入如 `POSTGRES_CONNECTION_STRING` 或 `POSTGRES_URI`。本專案 **start 腳本** 會自動使用這些變數組出 `DATABASE_URL`（並補上 `?schema=public`） |

若連結後仍無 `DATABASE_URL`，請手動新增一筆：

- **Name**: `DATABASE_URL`  
- **Value**: 從 **PostgreSQL 服務** → **Variables** 複製 `POSTGRES_CONNECTION_STRING` 或 `POSTGRES_URI` 的**整段值**。若沒有 `?schema=public`，啟動時腳本會自動補上。

### 方式 B：手動設定 DATABASE_URL

| 步驟 | 操作 |
|------|------|
| B-1 | 到 **PostgreSQL 服務** → **Variables**，複製 `POSTGRES_CONNECTION_STRING` 或 `POSTGRES_URI` 的完整內容 |
| B-2 | 到 **class_demo（Web 服務）** → **Variables** → **Add Variable** |
| B-3 | **Name**: `DATABASE_URL` |
| B-4 | **Value**: 貼上連線字串，格式應類似：`postgresql://USER:PASSWORD@HOST:PORT/DATABASE`（可加 `?schema=public`，未加則啟動時會自動補上） |

---

## 三、Web 服務建置與啟動指令（無需手動填）

專案根目錄 **zbpack.json** 已設定，Zeabur 會自動使用：

| 階段 | 指令 | 說明 |
|------|------|------|
| Install | `npm ci` | 安裝依賴（含 `prisma generate` 透過 postinstall） |
| Build | `npm run build` | 執行 `next build` |
| Start | `npm run start` | 執行 `node scripts/start.js` |

**Start 腳本會依序執行：**

1. 檢查並設定 `DATABASE_URL`（支援從 `POSTGRES_CONNECTION_STRING` / `POSTGRES_URI` 或 Zeabur 注入的變數取得，並自動補上 `schema=public`）
2. `npx prisma migrate deploy` — 套用資料庫 migration
3. `npx prisma db seed` — 匯入預設 Banner（若已有資料會略過）
4. `npx next start` — 啟動 Next.js

若 Zeabur 畫面上有 **Build Command / Start Command** 被自動帶成其他值，請改回留空或設為上述，讓系統依 **zbpack.json** 使用。

---

## 四、環境變數整理

### Web 服務必填

| 變數名稱 | 值 | 說明 |
|----------|-----|------|
| `DATABASE_URL` | Postgres 連線字串 | 從 Postgres 服務複製，或透過「連結 Postgres」後由 Zeabur 注入；start 腳本會接受 `POSTGRES_CONNECTION_STRING` / `POSTGRES_URI` 並轉成 `DATABASE_URL`，並自動補上 `?schema=public` |

### Web 服務選填

| 變數名稱 | 值 | 說明 |
|----------|-----|------|
| `BASE_PATH` | `/CLASS_DEMO` | 僅在要讓網站跑在 `https://你的網域/CLASS_DEMO/` 時設定；不設則為根路徑 `/` |
| `NODE_ENV` | `production` | 選填，Zeabur 多數情況會自動設 |

---

## 五、部署完成後檢查

- [ ] **PostgreSQL** 服務狀態為 **Running**
- [ ] **class_demo（Web）** 服務狀態為 **Running**
- [ ] Web 服務 **Variables** 中具備有效 `DATABASE_URL`（或已連結 Postgres 且 Zeabur 注入連線變數）
- [ ] 開啟 Zeabur 提供的 Web 網址，可正常開啟首頁與課程頁
- [ ] （選填）若要再次手動執行 seed：到 Web 服務 **Console / Shell** 執行 `npx prisma db seed`

---

## 六、專案內已為 Zeabur 準備的檔案

| 檔案 | 用途 |
|------|------|
| `zbpack.json` | Zeabur 建置指令：install / build / start |
| `prisma/schema.prisma` | Prisma 資料模型，`provider = "postgresql"`，`url = env("DATABASE_URL")` |
| `prisma/migrations/` | 資料庫 migration，供 `prisma migrate deploy` 套用 |
| `scripts/start.js` | 啟動前設定 `DATABASE_URL`、補上 `schema=public`、執行 migrate + seed + next start |
| `.env.example` | 本機與 Zeabur 變數範例（勿將真實密碼提交 Git） |
| `package.json` → `engines.node` | 建議 Node >= 20.19.0 |

---

## 七、常見問題

- **啟動失敗：Missing DATABASE_URL**  
  → 到 Web 服務 **Variables** 新增 `DATABASE_URL`，或使用「連結 Postgres」讓 Zeabur 注入連線變數。

- **Prisma 連線錯誤（schema 相關）**  
  → 本專案 start 腳本會自動在連線字串補上 `?schema=public`，若仍報錯請確認連線字串格式為 `postgresql://...`。

- **Build / Start 指令被改掉**  
  → 在 Web 服務設定中將 Build Command、Start Command 清空或改回與 `zbpack.json` 一致，讓 Zeabur 使用專案內設定。

---

## 八、參考連結

- **GitHub Repo**: https://github.com/necva2018-lang/class_demo  
- **Zeabur 文件（Next.js）**: https://zeabur.com/docs/en-US/guides/nodejs/nextjs  
- **Zeabur 環境變數**: https://zeabur.com/docs/en-US/deploy/variables  
