"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminHeaderProps {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  onMenuClick?: () => void;
}

const ROUTE_LABELS: Record<string, string> = {
  "/admin": "總覽",
  "/admin/courses": "課程列表",
  "/admin/courses/new": "新增課程",
  "/admin/categories": "課程分類",
  "/admin/home": "首頁內容",
  "/admin/banners": "Banner 管理",
  "/admin/stories": "成果案例",
  "/admin/faqs": "FAQ 管理",
  "/admin/news": "最新消息",
  "/admin/about": "關於我們",
  "/admin/settings": "網站設定",
  "/admin/seo": "SEO 設定",
};

function getBreadcrumbs(pathname: string): { label: string; href?: string }[] {
  const items: { label: string; href?: string }[] = [{ label: "首頁", href: "/admin" }];
  if (pathname === "/admin") return items;

  const segments = pathname.split("/").filter(Boolean).slice(1);
  let href = "/admin";
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (seg !== "new" && isNaN(Number(seg))) {
      href += `/${seg}`;
      items.push({
        label: ROUTE_LABELS[href] ?? seg,
        href: i < segments.length - 1 ? href : undefined,
      });
    } else {
      items.push({
        label: seg === "new" ? "新增" : `編輯`,
        href: undefined,
      });
      break;
    }
  }
  return items;
}

export function AdminHeader({ title, breadcrumbs, actions, onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const crumbs = breadcrumbs ?? getBreadcrumbs(pathname);
  const displayTitle = title ?? ROUTE_LABELS[pathname] ?? "控制台";

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:h-16 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onMenuClick?.()}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="開啟選單"
        >
          ☰
        </button>
        <div className="flex flex-col gap-0.5">
          <nav className="flex items-center gap-1.5 text-sm text-slate-500">
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-slate-300">/</span>}
                {c.href ? (
                  <Link href={c.href} className="hover:text-slate-700">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-slate-900 font-medium">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="text-lg font-semibold text-slate-900 lg:text-xl">
            {displayTitle}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </header>
  );
}
