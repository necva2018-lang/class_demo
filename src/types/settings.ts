/**
 * 網站基本設定型別
 * 供 admin/settings 與全站共用
 */

export interface SiteSettings {
  siteName: string;
  siteSubtitle?: string;
  logo?: string;
  contact: {
    phone: string;
    email: string;
    address: string;
    serviceHours?: string;
  };
  social: {
    line?: string;
    facebook?: string;
  };
  footer: {
    copyright?: string;
  };
  cta: {
    defaultLabel: string;
    defaultHref: string;
  };
}
