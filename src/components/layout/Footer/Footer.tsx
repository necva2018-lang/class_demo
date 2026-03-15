import Link from "next/link";
import type { FooterProps } from "@/components/types";

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

const DEFAULT_SITE_NAME = "職訓課程招生網";
const DEFAULT_DESCRIPTION = "協助您找到適合的職訓課程，開啟職涯新篇章";

export function Footer({
  siteName = DEFAULT_SITE_NAME,
  description = DEFAULT_DESCRIPTION,
  contact = {
    phone: "0800-000-000",
    hours: "週一至週五 09:00-18:00",
  },
  linkGroups = DEFAULT_LINK_GROUPS,
  copyright,
}: FooterProps) {
  const copyrightText =
    copyright ?? `© ${new Date().getFullYear()} ${siteName} 版權所有`;

  return (
    <footer className="border-t border-slate-200 bg-slate-800 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="text-lg font-bold text-white hover:text-slate-200"
            >
              {siteName}
            </Link>
            <p className="mt-2 text-sm text-slate-400">{description}</p>
            {(contact.phone || contact.hours) && (
              <div className="mt-4">
                {contact.phone && (
                  <p className="text-sm">客服專線：{contact.phone}</p>
                )}
                {contact.hours && (
                  <p className="text-sm">服務時間：{contact.hours}</p>
                )}
              </div>
            )}
          </div>

          {/* Links */}
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold text-white">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-slate-700 pt-8 text-center text-sm text-slate-500">
          {copyrightText}
        </div>
      </div>
    </footer>
  );
}
