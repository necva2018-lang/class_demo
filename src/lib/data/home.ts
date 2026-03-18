import type { HomePageConfig } from "@/types/home";
import homeConfig from "@/data/home-config.json";
import { getAppConfig, resetAppConfig, setAppConfig } from "@/lib/config-store";

const KEY = "home";
const FALLBACK = homeConfig as HomePageConfig;

export async function getHomeConfig(): Promise<HomePageConfig> {
  return await getAppConfig<HomePageConfig>(KEY, FALLBACK);
}

export async function setHomeConfig(config: HomePageConfig): Promise<void> {
  await setAppConfig(KEY, config);
}

export async function resetHomeConfigDefault(): Promise<void> {
  await resetAppConfig(KEY);
}
