/**
 * Banner / Hero 型別
 * 供 admin/banners 與前台首頁 Hero 區塊共用
 */

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  order: number;
  active: boolean;
  /** 是否為預設主 banner（輪播時優先顯示） */
  isDefault?: boolean;
}
