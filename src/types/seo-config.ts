/**
 * SEO 設定型別（後台可編輯）
 * 供 admin/seo 與 lib/seo 銜接
 */

export interface SeoSettings {
  defaultTitle: string;
  defaultDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robots?: string;
  /** 預留：結構化資料 / schema */
  schemaJson?: string;
}
