import { prisma } from "@/lib/db";

export async function getAppConfig<T>(key: string, fallback: T): Promise<T> {
  try {
    const row = await prisma.appConfig.findUnique({ where: { key } });
    if (!row) return fallback;
    return row.value as T;
  } catch {
    // Build-time / preview environments may not have DB available.
    return fallback;
  }
}

export async function setAppConfig<T>(key: string, value: T): Promise<void> {
  await prisma.appConfig.upsert({
    where: { key },
    update: { value: value as any },
    create: { key, value: value as any },
  });
}

export async function resetAppConfig(key: string): Promise<void> {
  await prisma.appConfig.delete({ where: { key } }).catch(() => undefined);
}

