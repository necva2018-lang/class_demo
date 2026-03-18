/** @type {import('next').NextConfig} */
const isGitHubPages = Boolean(process.env.GITHUB_REPOSITORY);
const repoName = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split("/")[1]
  : "class_demo";

// basePath priority:
// 1) BASE_PATH (for Zeabur / any server deployment)
// 2) GitHub Pages repo-based path
// 3) no basePath
const envBasePath = process.env.BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || "";
const normalizedEnvBasePath =
  envBasePath && envBasePath !== "/"
    ? envBasePath.startsWith("/")
      ? envBasePath.replace(/\/+$/, "")
      : `/${envBasePath.replace(/\/+$/, "")}`
    : "";

const basePath = normalizedEnvBasePath || (isGitHubPages ? `/${repoName}` : "");
const assetPrefix = basePath ? `${basePath}/` : undefined;

const nextConfig = {
  // Zeabur / Node server needs SSR runtime (not static export)
  ...(isGitHubPages
    ? { output: "export", trailingSlash: true }
    : {}),
  ...(basePath ? { basePath } : {}),
  ...(assetPrefix ? { assetPrefix } : {}),
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath || "",
  },
};

module.exports = nextConfig;
