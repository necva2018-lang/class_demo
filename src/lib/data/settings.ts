import type { SiteSettings } from "@/types/settings";
import siteSettings from "@/data/site-settings.json";
import { getAppConfig, resetAppConfig, setAppConfig } from "@/lib/config-store";

const KEY = "settings";
const FALLBACK = siteSettings as SiteSettings;

export async function getSiteSettings(): Promise<SiteSettings> {
  return await getAppConfig<SiteSettings>(KEY, FALLBACK);
}

export async function setSiteSettings(settings: SiteSettings): Promise<void> {
  await setAppConfig(KEY, settings);
}

export async function resetSiteSettingsDefault(): Promise<void> {
  await resetAppConfig(KEY);
}
