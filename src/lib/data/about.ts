import type { AboutConfig } from "@/types/about";
import aboutConfig from "@/data/about-config.json";
import { getAppConfig, resetAppConfig, setAppConfig } from "@/lib/config-store";

const KEY = "about";
export const ABOUT_FALLBACK = aboutConfig as AboutConfig;

export async function getAboutConfig(): Promise<AboutConfig> {
  return await getAppConfig<AboutConfig>(KEY, ABOUT_FALLBACK);
}

export async function setAboutConfig(config: AboutConfig): Promise<void> {
  await setAppConfig(KEY, config);
}

export async function resetAboutConfigDefault(): Promise<void> {
  await resetAppConfig(KEY);
}
