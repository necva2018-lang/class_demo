/**
 * Banner 資料取得層
 * 供前台與後台共用，支援 localStorage 持久化
 */

import type { Banner } from "@/types/banner";
import bannersData from "@/data/banners.json";
import { createStorageStore } from "@/lib/admin-storage";

type BannerJson = {
  id: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  order: number;
  active: boolean;
  isDefault?: boolean;
};

function toBanner(raw: BannerJson): Banner {
  return {
    id: raw.id,
    title: raw.title,
    subtitle: raw.subtitle,
    backgroundImage: raw.backgroundImage,
    primaryCta: raw.primaryCta ?? {
      label: raw.primaryCtaLabel ?? "立即找課程",
      href: raw.primaryCtaHref ?? "/courses",
    },
    secondaryCta:
      raw.secondaryCtaLabel && raw.secondaryCtaHref
        ? { label: raw.secondaryCtaLabel, href: raw.secondaryCtaHref }
        : raw.secondaryCta,
    order: raw.order,
    active: raw.active,
    isDefault: raw.isDefault,
  };
}

const defaultBanners: Banner[] = (Array.isArray(bannersData) ? bannersData : [])
  .map((b) => toBanner(b as BannerJson))
  .sort((a, b) => a.order - b.order);

const store = createStorageStore<Banner[]>("banners", defaultBanners);

export function getBanners(): Banner[] {
  return store.get().slice().sort((a, b) => a.order - b.order);
}

export function getActiveBanners(): Banner[] {
  return getBanners().filter((b) => b.active);
}

export function getDefaultBanner(): Banner | undefined {
  return getBanners().find((b) => b.isDefault) ?? getActiveBanners()[0];
}

/** 後台 mock 儲存用，同步寫入 localStorage */
export function setBannersLocal(banners: Banner[]): void {
  store.set(banners.sort((a, b) => a.order - b.order));
}

/** 還原為預設值 */
export function resetBannersDefault(): void {
  store.reset();
}
