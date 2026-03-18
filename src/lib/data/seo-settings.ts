import type { SeoSettings } from "@/types/seo-config";
import seoSettings from "@/data/seo-settings.json";
import { getAppConfig, resetAppConfig, setAppConfig } from "@/lib/config-store";

const KEY = "seo";
export const SEO_FALLBACK = seoSettings as SeoSettings;

export async function getSeoSettings(): Promise<SeoSettings> {
  return await getAppConfig<SeoSettings>(KEY, SEO_FALLBACK);
}

export async function setSeoSettings(settings: SeoSettings): Promise<void> {
  await setAppConfig(KEY, settings);
}

export async function resetSeoSettingsDefault(): Promise<void> {
  await resetAppConfig(KEY);
}
