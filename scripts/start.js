const { spawnSync } = require("child_process");

function run(command, args) {
  const res = spawnSync(command, args, {
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

// Zeabur Postgres service commonly exposes one of these.
process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_CONNECTION_STRING ||
  process.env.POSTGRES_URI ||
  process.env.POSTGRES_URL;

function looksLikeValidPostgresUrl(url) {
  return typeof url === "string" && /^(postgresql|postgres):\/\//.test(url);
}

function interpolateTemplateUrl(url) {
  if (typeof url !== "string") return url;
  // Replace ${VAR} with process.env.VAR when present.
  return url.replace(/\$\{([A-Z0-9_]+)\}/g, (_, name) => process.env[name] ?? "");
}

function buildFromPieces() {
  const u = process.env.POSTGRES_USERNAME;
  const p = process.env.POSTGRES_PASSWORD;
  const h = process.env.POSTGRES_HOST;
  const port = process.env.POSTGRES_PORT;
  const db = process.env.POSTGRES_DATABASE;
  if (!u || !p || !h || !port || !db) return null;
  return `postgresql://${encodeURIComponent(u)}:${encodeURIComponent(p)}@${h}:${port}/${db}?schema=public`;
}

if (!process.env.DATABASE_URL) {
  console.error(
    [
      "Missing DATABASE_URL.",
      "Set DATABASE_URL in Zeabur Web service Variables, or link Postgres and use POSTGRES_CONNECTION_STRING/POSTGRES_URI.",
    ].join("\n")
  );
  process.exit(1);
}

// If DATABASE_URL is a template like postgresql://${POSTGRES_USERNAME}..., expand it.
process.env.DATABASE_URL = interpolateTemplateUrl(process.env.DATABASE_URL);

// 確保包含 schema=public，避免 Prisma 連線錯誤（Zeabur 連線字串常缺少此參數）
function ensureSchemaParam(url) {
  if (typeof url !== "string" || !url) return url;
  if (/[?&]schema=/.test(url)) return url;
  const separator = url.includes("?") ? "&" : "?";
  return url + separator + "schema=public";
}
process.env.DATABASE_URL = ensureSchemaParam(process.env.DATABASE_URL);

// If still invalid, try building from Zeabur's POSTGRES_* pieces.
if (!looksLikeValidPostgresUrl(process.env.DATABASE_URL)) {
  const built = buildFromPieces();
  if (built) process.env.DATABASE_URL = built;
}

if (!looksLikeValidPostgresUrl(process.env.DATABASE_URL)) {
  console.error(
    [
      "Invalid DATABASE_URL (must start with postgresql:// or postgres://).",
      "Fix by setting DATABASE_URL to Postgres service's POSTGRES_CONNECTION_STRING (a full URL),",
      "or make sure POSTGRES_USERNAME/POSTGRES_PASSWORD/POSTGRES_HOST/POSTGRES_PORT/POSTGRES_DATABASE exist.",
      `Current DATABASE_URL value starts with: ${String(process.env.DATABASE_URL).slice(0, 24)}`,
    ].join("\n")
  );
  process.exit(1);
}

run("npx", ["prisma", "migrate", "deploy"]);
run("npx", ["prisma", "db", "seed"]);
run("npx", ["next", "start"]);

