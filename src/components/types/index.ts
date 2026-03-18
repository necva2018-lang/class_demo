/**
 * 共用元件 Props 型別定義
 * 統一管理，方便維護與擴充
 */

import type { ReactNode } from "react";

// ============ Layout ============

export interface NavItem {
  href: string;
  label: string;
}

export interface FooterLinkGroup {
  title: string;
  links: { href: string; label: string }[];
}

export interface HeaderProps {
  siteName?: string;
  navItems?: NavItem[];
  ctaHref?: string;
  ctaLabel?: string;
}

export interface FooterProps {
  siteName?: string;
  description?: string;
  contact?: {
    phone?: string;
    hours?: string;
  };
  linkGroups?: FooterLinkGroup[];
  copyright?: string;
}

// ============ Shared ============

export interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export interface CTAButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "white";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  external?: boolean;
}

export interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
  tags: string[];
  className?: string;
}

export interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  courseName?: string;
  className?: string;
}

export interface FAQItemData {
  question: string;
  answer: string;
}

export interface FAQItemProps {
  question: string;
  answer: string;
  /** 受控模式：由父層管理開合狀態 */
  isOpen?: boolean;
  onToggle?: () => void;
  /** 非受控模式：初始是否展開（僅當未提供 isOpen/onToggle 時使用） */
  defaultOpen?: boolean;
  className?: string;
}

export interface EmptyStateProps {
  title?: string;
  description: string;
  action?: {
    href: string;
    label: string;
  };
  icon?: ReactNode;
  className?: string;
}
