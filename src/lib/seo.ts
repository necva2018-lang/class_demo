/**
 * SEO 設定與工具
 * 統一管理 site config、metadata 產生邏輯
 */

export const SEO_CONFIG = {
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
  ] as string[],
  /** 正式環境請設為實際網域，如 https://training.example.com */
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  /** OG 預設圖片（1200x630 建議） */
  defaultOgImage: "/images/og-default.png",
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
 * 產生完整 metadata 物件
 */
export function createMetadata(params: MetadataParams = {}) {
  const {
    title,
    description = SEO_CONFIG.defaultDescription,
    path = "",
    image,
    type = "website",
    publishedTime,
    modifiedTime,
    noIndex = false,
  } = params;

  const url = path
    ? `${SEO_CONFIG.baseUrl}${path.startsWith("/") ? path : `/${path}`}`
    : SEO_CONFIG.baseUrl;
  const ogImage = image?.startsWith("http")
    ? image
    : image
      ? `${SEO_CONFIG.baseUrl}${image.startsWith("/") ? image : `/${image}`}`
      : `${SEO_CONFIG.baseUrl}${SEO_CONFIG.defaultOgImage}`;
  const fullTitle = title
    ? `${title} | ${SEO_CONFIG.siteName}`
    : SEO_CONFIG.siteName;

  return {
    title: fullTitle,
    description: truncateDescription(description, 160),
    keywords: [...SEO_CONFIG.keywords],
    authors: [{ name: SEO_CONFIG.siteName }],
    openGraph: {
      type,
      siteName: SEO_CONFIG.siteName,
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
