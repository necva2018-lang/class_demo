"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

type NavItem =
  | { label: string; href: string; icon?: string }
  | { label: string; children: { label: string; href: string }[]; icon?: string };

const NAV_ITEMS: NavItem[] = [
  {
    label: "總覽",
    href: "/admin",
    icon: "📊",
  },
  {
    label: "課程",
    children: [
      { label: "課程列表", href: "/admin/courses" },
      { label: "課程分類", href: "/admin/categories" },
    ],
    icon: "📚",
  },
  { label: "首頁", href: "/admin/home", icon: "🏠" },
  { label: "Banner", href: "/admin/banners", icon: "🖼️" },
  {
    label: "內容",
    children: [
      { label: "成果案例", href: "/admin/stories" },
      { label: "FAQ", href: "/admin/faqs" },
      { label: "最新消息", href: "/admin/news" },
    ],
    icon: "📄",
  },
  { label: "關於我們", href: "/admin/about", icon: "ℹ️" },
  {
    label: "設定",
    children: [
      { label: "網站設定", href: "/admin/settings" },
      { label: "SEO 設定", href: "/admin/seo" },
    ],
    icon: "⚙️",
  },
];

function NavLink({
  href,
  label,
  icon,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  icon?: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
        transition-colors
        ${
          isActive
            ? "bg-primary-100 text-primary-700"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }
      `}
    >
      {icon && <span className="text-base" aria-hidden>{icon}</span>}
      {label}
    </Link>
  );
}

function NavGroup({
  label,
  icon,
  children: navChildren,
  activeHrefs,
  onNavigate,
}: {
  label: string;
  icon?: string;
  children: readonly { label: string; href: string }[];
  activeHrefs: readonly string[];
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(() =>
    navChildren.some((c) => activeHrefs.includes(c.href))
  );

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      >
        <span className="flex items-center gap-3">
          {icon && <span className="text-base" aria-hidden>{icon}</span>}
          {label}
        </span>
        <span
          className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▼
        </span>
      </button>
      {open && (
        <div className="ml-4 space-y-0.5 border-l border-slate-200 pl-2">
          {navChildren.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`
                block rounded-lg px-2 py-2 text-sm
                ${
                  activeHrefs.includes(item.href)
                    ? "bg-primary-50 text-primary-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminSidebar({ mobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
      )}
      {/* Mobile drawer */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-slate-200 bg-white shadow-xl
          transition-transform duration-200 ease-out lg:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <span className="font-semibold text-slate-900">選單</span>
          <button
            type="button"
            onClick={onMobileClose}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="關閉選單"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => {
            if ("children" in item) {
              return (
                <NavGroup
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  children={item.children}
                  activeHrefs={item.children.map((c) => c.href)}
                  onNavigate={onMobileClose}
                />
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                  ${pathname === item.href ? "bg-primary-100 text-primary-700" : "text-slate-600 hover:bg-slate-100"}
                `}
              >
                {item.icon && <span aria-hidden>{item.icon}</span>}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            前往前台 →
          </a>
        </div>
      </aside>
      {/* Desktop sidebar */}
      <aside
        className="
          hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white
          lg:flex
        "
      >
        <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-4">
          <Link href="/admin" className="font-semibold text-slate-900">
            後台控制台
          </Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => {
            if ("children" in item) {
              return (
                <NavGroup
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  children={item.children}
                  activeHrefs={item.children.map((c) => c.href)}
                />
              );
            }
            return (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={pathname === item.href}
              />
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            前往前台 →
          </a>
        </div>
      </aside>
    </>
  );
}
