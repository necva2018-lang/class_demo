/**
 * 首頁內容設定 - 資料取得層
 * 供前台與後台共用，支援 localStorage 持久化
 */

import type { HomePageConfig } from "@/types/home";
import homeConfig from "@/data/home-config.json";
import { createStorageStore } from "@/lib/admin-storage";

const store = createStorageStore<HomePageConfig>("home", homeConfig as HomePageConfig);

export function getHomeConfig(): HomePageConfig {
  return store.get();
}

/** 後台 mock 儲存用，同步寫入 localStorage */
export function setHomeConfigLocal(config: HomePageConfig): void {
  store.set(config);
}

/** 還原為預設值 */
export function resetHomeConfigDefault(): void {
  store.reset();
}
