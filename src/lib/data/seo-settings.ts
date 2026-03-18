/**
 * SEO 設定 - 資料取得層
 * 供前台與後台共用，支援 localStorage 持久化
 */

import type { SeoSettings } from "@/types/seo-config";
import seoSettings from "@/data/seo-settings.json";
import { createStorageStore } from "@/lib/admin-storage";

const store = createStorageStore<SeoSettings>("seo", seoSettings as SeoSettings);

export function getSeoSettings(): SeoSettings {
  return store.get();
}

/** 後台 mock 儲存用，同步寫入 localStorage */
export function setSeoSettingsLocal(settings: SeoSettings): void {
  store.set(settings);
}

/** 還原為預設值 */
export function resetSeoSettingsDefault(): void {
  store.reset();
}
