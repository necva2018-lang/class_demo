/**
 * 關於我們頁面設定 - 資料取得層
 * 供前台與後台共用，支援 localStorage 持久化
 */

import type { AboutConfig } from "@/types/about";
import aboutConfig from "@/data/about-config.json";
import { createStorageStore } from "@/lib/admin-storage";

const store = createStorageStore<AboutConfig>("about", aboutConfig as AboutConfig);

export function getAboutConfig(): AboutConfig {
  return store.get();
}

/** 後台 mock 儲存用，同步寫入 localStorage */
export function setAboutConfigLocal(config: AboutConfig): void {
  store.set(config);
}

/** 還原為預設值 */
export function resetAboutConfigDefault(): void {
  store.reset();
}
