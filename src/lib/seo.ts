/**
 * SEO 設定與工具
 * 統一管理 site config、metadata 產生邏輯
 * 優先讀取 admin seo-settings + site-settings（Postgres），fallback 為預設值
 */

import { getSeoSettings } from "@/lib/data/seo-settings";
import { getSiteSettings } from "@/lib/data/settings";

export interface SeoConfig {
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  keywords: string[];
  baseUrl: string;
  defaultOgImage: string;
}

/** 預設值（當 DB 無法取得時使用） */
const FALLBACK_SEO: SeoConfig = {
  siteName: "職訓課程招生網",
  defaultTitle: "找到適合的職訓課程，開啟職涯新篇章",
  defaultDescription:
    "提供政府補助與自費職訓課程，包含職前訓練、在職訓練、證照課程等，協助待業者、轉職者、在職進修者提升技能，順利就業。",
  keywords: [
    "職訓",
    "職業訓練",
    "政府補助",
    "在職進修",
    "證照課程",
    "就業培訓",
    "職前訓練",
  ],
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  defaultOgImage: "/images/og-default.png",
};

/** 取得有效 SEO 設定（同步，fallback 用，保留相容） */
export function getEffectiveSeoConfig(): SeoConfig {
  return {
    ...FALLBACK_SEO,
    defaultOgImage: `${FALLBACK_SEO.baseUrl}${FALLBACK_SEO.defaultOgImage}`,
  };
}

/** 從 DB 取得有效 SEO 設定（非同步，供 metadata 使用） */
export async function getEffectiveSeoConfigAsync(): Promise<SeoConfig> {
  try {
    const [seo, settings] = await Promise.all([
      getSeoSettings(),
      getSiteSettings(),
    ]);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const ogImage =
      seo.ogImage ||
      (seo as { ogImageUrl?: string }).ogImageUrl ||
      FALLBACK_SEO.defaultOgImage;
    const fullOgImage = ogImage.startsWith("http")
      ? ogImage
      : `${baseUrl}${ogImage.startsWith("/") ? ogImage : `/${ogImage}`}`;
    return {
      siteName: settings.siteName || FALLBACK_SEO.siteName,
      defaultTitle: seo.defaultTitle || FALLBACK_SEO.defaultTitle,
      defaultDescription:
        seo.defaultDescription || FALLBACK_SEO.defaultDescription,
      keywords: FALLBACK_SEO.keywords,
      baseUrl,
      defaultOgImage: fullOgImage,
    };
  } catch {
    return {
      ...FALLBACK_SEO,
      defaultOgImage: `${FALLBACK_SEO.baseUrl}${FALLBACK_SEO.defaultOgImage}`,
    };
  }
}

/** @deprecated 請改用 getEffectiveSeoConfig()，保留以相容既有程式 */
export const SEO_CONFIG = {
  get siteName() {
    return getEffectiveSeoConfig().siteName;
  },
  get defaultTitle() {
    return getEffectiveSeoConfig().defaultTitle;
  },
  get defaultDescription() {
    return getEffectiveSeoConfig().defaultDescription;
  },
  keywords: FALLBACK_SEO.keywords,
  baseUrl: FALLBACK_SEO.baseUrl,
  get defaultOgImage() {
    return getEffectiveSeoConfig().defaultOgImage;
  },
};

export type MetadataParams = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
};

/**
 * 產生完整 metadata 物件（使用指定 config，供 generateMetadata 使用）
 */
export function createMetadataWithConfig(
  config: SeoConfig,
  params: MetadataParams = {}
) {
  const {
    title,
    description = config.defaultDescription,
    path = "",
    image,
    type = "website",
    publishedTime,
    modifiedTime,
    noIndex = false,
  } = params;

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const pathWithBase = path
    ? `${basePath}${path.startsWith("/") ? path : `/${path}`}`
    : basePath || "/";
  const url = pathWithBase
    ? `${config.baseUrl}${pathWithBase.startsWith("/") ? pathWithBase : `/${pathWithBase}`}`
    : config.baseUrl;
  const defaultOg = config.defaultOgImage;
  const ogImage = image?.startsWith("http")
    ? image
    : image
      ? `${config.baseUrl}${image.startsWith("/") ? image : `/${image}`}`
      : defaultOg.startsWith("http")
        ? defaultOg
        : `${config.baseUrl}${defaultOg.startsWith("/") ? defaultOg : `/${defaultOg}`}`;
  const fullTitle = title
    ? `${title} | ${config.siteName}`
    : config.siteName;

  return {
    title: fullTitle,
    description: truncateDescription(description, 160),
    keywords: [...config.keywords],
    authors: [{ name: config.siteName }],
    openGraph: {
      type,
      siteName: config.siteName,
      title: fullTitle,
      description: truncateDescription(description, 160),
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
      locale: "zh_TW",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: truncateDescription(description, 160),
    },
    alternates: {
      canonical: url,
    },
    ...(noIndex && { robots: "noindex, nofollow" as const }),
  };
}

/**
 * 產生完整 metadata 物件（同步版，使用 fallback config）
 */
export function createMetadata(params: MetadataParams = {}) {
  return createMetadataWithConfig(getEffectiveSeoConfig(), params);
}

/** 將 description 截斷至指定字數（中文約 1 字 = 1 字元） */
function truncateDescription(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/** 產生課程詳細頁的 SEO description */
export function createCourseDescription(course: {
  summary: string;
  location: string;
  hours: number;
  startDate: string;
  subCategory?: string;
}): string {
  const parts = [course.summary];
  parts.push(`上課地點：${course.location}`);
  parts.push(`總時數：${course.hours} 小時`);
  parts.push(`開課日期：${course.startDate}`);
  return truncateDescription(parts.join(" | "), 160);
}
