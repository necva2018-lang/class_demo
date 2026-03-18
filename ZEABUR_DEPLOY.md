# Zeabur 部署設定（CLASS_DEMO）

專案已為 Zeabur 準備好：`zbpack.json`、Prisma v7 的 `prisma.config.ts`、以及 Node 20+ 的 `engines`。照下列清單操作即可完成部署。

---

## 一、在 Zeabur 建立服務

| 步驟 | 操作 |
|------|------|
| 1 | 登入 [zeabur.com](https://zeabur.com) → **Create Project**（或選現有專案） |
| 2 | **Add Service** → **Deploy your source code** |
| 3 | 連動 GitHub → 搜尋 **class_demo** → 選擇 **necva2018-lang/class_demo** → **Import** |
| 4 | **Add Service** → **Database** → **PostgreSQL**，建立一個 Postgres |

---

## 二、Web 服務環境變數（必填）

到 **Web 服務**（class_demo）→ **Variables**，新增：

| 變數名稱 | 值 | 說明 |
|----------|-----|------|
| `DATABASE_URL` | 貼上 Postgres 連線字串 | 從 **Postgres 服務** → **Variables** 複製 `POSTGRES_CONNECTION_STRING` 或 `POSTGRES_URI` 的**整段值** |

若 Zeabur 有「連結 / 注入 Postgres」按鈕，可改為連結 Postgres 服務，再手動新增一筆：

- **Name**: `DATABASE_URL`  
- **Value**: `${POSTGRES_CONNECTION_STRING}`（或 Zeabur 提供的對應變數）

---

## 三、Web 服務環境變數（選填）

| 變數名稱 | 值 | 說明 |
|----------|-----|------|
| `BASE_PATH` | `/CLASS_DEMO` | 要讓網站跑在 `https://你的網域/CLASS_DEMO/` 時才設；不設則為根路徑 `/` |
| `NODE_ENV` | `production` | 選填，Zeabur 多數情況會自動設 |

---

## 四、Build / Start 指令（已寫在專案內，無需手動填）

專案根目錄的 **zbpack.json** 已設定，Zeabur 會自動使用：

- **Install**: `npm ci`
- **Build**: `npm run build`
- **Start**: `npm run start`

其中 `npm run start` 會依序執行：

1. `prisma migrate deploy`（套用資料庫 migration）
2. `next start`（啟動 Next.js）

若 Zeabur 畫面上有「Build Command / Start Command」欄位被自動帶入其他值，可改回上述或清空，讓系統依 **zbpack.json** 使用。

---

## 五、部署完成後（選填）

若要匯入預設 Banner（來自 `src/data/banners.json`）：

1. 到 **Web 服務** → **Console / Shell**
2. 執行：`npx prisma db seed`
3. 之後可到 **後台 Banner 管理** 新增/編輯，資料會存在 Postgres。

---

## 六、專案內已為 Zeabur 準備的檔案

| 檔案 | 用途 |
|------|------|
| `zbpack.json` | Zeabur 建置指令（install / build / start） |
| `prisma.config.ts`（根目錄 + `prisma/`） | Prisma v7 資料庫連線，讀取 `DATABASE_URL` |
| `prisma/schema.prisma` | 僅 `provider = "postgresql"`，無 `url`（v7 規定） |
| `prisma/migrations/` | 初始 migration，供 `prisma migrate deploy` 套用 |
| `.env.example` | 本機與 Zeabur 變數範例，勿把真實密碼提交 Git |
| `package.json` → `engines.node` | 建議 Node >= 20.19.0 |

---

## 七、常用連結

- **GitHub Repo**: https://github.com/necva2018-lang/class_demo  
- **Zeabur 文件（Next.js）**: https://zeabur.com/docs/en-US/guides/nodejs/nextjs  
- **Zeabur 環境變數**: https://zeabur.com/docs/en-US/deploy/variables  
