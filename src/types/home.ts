/**
 * 首頁內容設定型別
 * 供 admin/home 與前台首頁共用
 */

export interface HomePageConfig {
  hero: {
    title: string;
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
  };
  audienceSection?: {
    title: string;
    items: string[];
  };
  categoryEntry?: {
    government: { title: string; description: string; href: string };
    paid: { title: string; description: string; href: string };
  };
  featuredCourses?: {
    title: string;
    subtitle?: string;
    limit: number;
  };
  whyUs?: {
    title: string;
    items: { title: string; description: string; icon?: string }[];
  };
  stories?: {
    title: string;
  };
  testimonials?: {
    title: string;
  };
  applySteps?: {
    title: string;
  };
  faqSummary?: {
    title: string;
  };
  cta: {
    title: string;
    subtitle: string;
    buttonLabel: string;
    buttonHref: string;
  };
}
