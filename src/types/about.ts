/**
 * 關於我們頁面設定型別
 * 供 admin/about 與前台關於我們頁共用
 */

export interface AboutConfig {
  associationName: string;
  intro: string;
  mission: string;
  serviceAudience: string[];
  coreFeatures: string[];
  partners: string[];
  contact: {
    phone: string;
    email: string;
    address: string;
    serviceHours?: string;
    mapEmbed?: string;
  };
  cta?: {
    text: string;
    href: string;
  };
}
