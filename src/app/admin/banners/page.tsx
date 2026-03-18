import { AdminBannersList } from "@/components/admin/banners/AdminBannersList";
import { prisma } from "@/lib/db";
import type { Banner } from "@/types/banner";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const rows = await prisma.banner.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  const banners: Banner[] = rows.map((b) => ({
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    backgroundImage: b.backgroundImage,
    primaryCta: { label: b.primaryCtaLabel, href: b.primaryCtaHref },
    secondaryCta:
      b.secondaryCtaLabel && b.secondaryCtaHref
        ? { label: b.secondaryCtaLabel, href: b.secondaryCtaHref }
        : undefined,
    order: b.order,
    active: b.active,
    isDefault: b.isDefault,
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Banner 管理</h2>
      <AdminBannersList banners={banners} />
    </div>
  );
}
