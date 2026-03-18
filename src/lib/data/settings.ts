/**
 * 網站設定 - 資料取得層
 * 供前台與後台共用，支援 localStorage 持久化
 */

import type { SiteSettings } from "@/types/settings";
import siteSettings from "@/data/site-settings.json";
import { createStorageStore } from "@/lib/admin-storage";

const store = createStorageStore<SiteSettings>("settings", siteSettings as SiteSettings);

export function getSiteSettings(): SiteSettings {
  return store.get();
}

/** 後台 mock 儲存用，同步寫入 localStorage */
export function setSiteSettingsLocal(settings: SiteSettings): void {
  store.set(settings);
}

/** 還原為預設值 */
export function resetSiteSettingsDefault(): void {
  store.reset();
}
