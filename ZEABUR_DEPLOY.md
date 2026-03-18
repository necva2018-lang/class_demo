## Zeabur + Postgres 部署（Next.js + Prisma）

### 1) 在 Zeabur 建立服務

- **新增 Postgres**：建立後取得連線字串（DATABASE_URL）
- **新增 Web（Node/Next.js）**：指向此專案 Repo

### 2) 設定環境變數

在 Web 服務的環境變數加入：

- `DATABASE_URL`: Zeabur 提供的 Postgres 連線字串
- （可選）`NODE_ENV`: `production`

> 注意：本專案只有在 GitHub Pages 情境才會套用 `basePath` 與 `output: "export"`。
> Zeabur 上不需要設定 `GITHUB_REPOSITORY`。

### 3) Build / Start 指令

建議設定：

- **Build**: `npm ci && npm run build`
- **Start**: `npm run start`

本專案的 `npm run start` 會先跑：

- `prisma migrate deploy`（套用 migration）
- `next start`

### 4) 第一次上線資料（Banner 預設值）

第一次上線如果你希望帶入 `src/data/banners.json` 的預設 Banner，可以在 Zeabur 執行一次：

- `npx prisma db seed`

之後 Banner 的新增/編輯/排序會寫入 Postgres。

