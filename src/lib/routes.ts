export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const normalizedBase = base && base !== "/" ? base.replace(/\/+$/, "") : "";
  if (!normalizedBase) return path;
  if (!path) return normalizedBase;
  if (path.startsWith(normalizedBase)) return path;
  return `${normalizedBase}${path.startsWith("/") ? path : `/${path}`}`;
}

