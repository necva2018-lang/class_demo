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

if (!process.env.DATABASE_URL) {
  console.error(
    [
      "Missing DATABASE_URL.",
      "Set DATABASE_URL in Zeabur Web service Variables, or link Postgres and use POSTGRES_CONNECTION_STRING/POSTGRES_URI.",
    ].join("\n")
  );
  process.exit(1);
}

run("npx", ["prisma", "migrate", "deploy"]);
run("npx", ["next", "start"]);

