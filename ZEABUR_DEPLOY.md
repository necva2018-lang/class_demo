## Zeabur + Postgres 部署（Next.js + Prisma）

專案已包含 `zbpack.json`，Zeabur 會自動使用正確的 Install / Build / Start 指令。

---

### 步驟 1：在 Zeabur 建立專案並匯入 GitHub

1. 登入 [Zeabur](https://zeabur.com)
2. **Create Project**（或選現有專案）
3. **Add Service** → 選 **Deploy your source code**
4. 連動 GitHub，搜尋並選擇 **necva2018-lang/class_demo**
5. 匯入後 Zeabur 會建立一個 **Web Service**（Node.js/Next.js）

---

### 步驟 2：新增 Postgres 並取得連線字串

1. 同專案內 **Add Service** → 選 **Database** → **PostgreSQL**
2. 建立完成後，到 Postgres 服務的 **Variables** 頁籤
3. 複製 **`POSTGRES_CONNECTION_STRING`** 或 **`POSTGRES_URI`** 的值（Zeabur 會自動帶入帳密與主機）

---

### 步驟 3：設定 Web 服務的環境變數

到 **Web 服務**（Next.js）→ **Variables**，新增：

| 變數名稱 | 值 | 說明 |
|----------|-----|------|
| `DATABASE_URL` | 貼上 Postgres 的連線字串 | 若 Zeabur 有「連結服務」可選 Postgres，可選「注入」；或手動貼 `POSTGRES_CONNECTION_STRING` 的值 |
| `BASE_PATH` | `/CLASS_DEMO` | 選填。要讓網站跑在 `https://你的網域/CLASS_DEMO/` 才設 |

---

### 步驟 4：部署

- Zeabur 會依 `zbpack.json` 自動執行：
  - **Install**: `npm ci`（含 `prisma generate`）
  - **Build**: `npm run build`
  - **Start**: `npm run start`（會先跑 `prisma migrate deploy` 再 `next start`）
- 若 Build/Start 有被覆寫，請改回上述指令或刪掉自訂，讓專案用 `zbpack.json` 設定。

---

### 步驟 5（選填）：匯入預設 Banner

部署成功後，若要將 `src/data/banners.json` 寫入資料庫：

1. 到 Web 服務的 **Console / Shell**
2. 執行：`npx prisma db seed`
3. 之後 Banner 由後台管理，資料存在 Postgres。

---

### 常用連結

- **Repo**: https://github.com/necva2018-lang/class_demo
- **Zeabur 文件（Next.js）**: https://zeabur.com/docs/en-US/guides/nodejs/nextjs

