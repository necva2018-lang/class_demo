import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/data/settings";

const DEFAULT_NAV_ITEMS = [
  { href: "/", label: "首頁" },
  { href: "/courses", label: "課程總覽" },
  { href: "/about", label: "關於我們" },
  { href: "/faq", label: "常見問題" },
];

const DEFAULT_LINK_GROUPS = [
  {
    title: "課程",
    links: [
      { href: "/courses", label: "課程總覽" },
      { href: "/courses?category=job-preparation", label: "職前訓練" },
      { href: "/courses?category=in-service", label: "在職訓練" },
      { href: "/courses?category=certification", label: "證照課程" },
    ],
  },
  {
    title: "資訊",
    links: [
      { href: "/about", label: "關於我們" },
      { href: "/cases", label: "成果案例" },
      { href: "/news", label: "最新消息" },
      { href: "/faq", label: "常見問題" },
    ],
  },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = getSiteSettings();
  return (
    <div className="flex min-h-screen flex-col">
      <Header
        siteName={settings.siteName}
        navItems={DEFAULT_NAV_ITEMS}
        ctaHref={settings.cta.defaultHref}
        ctaLabel={settings.cta.defaultLabel}
      />
      <main className="flex-1">{children}</main>
      <Footer
        siteName={settings.siteName}
        description={settings.siteSubtitle}
        contact={{
          phone: settings.contact.phone,
          hours: settings.contact.serviceHours ?? "週一至週五 09:00-18:00",
        }}
        linkGroups={DEFAULT_LINK_GROUPS}
        copyright={settings.footer.copyright || undefined}
      />
    </div>
  );
}
