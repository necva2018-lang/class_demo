import { getBanners } from "@/lib/data/banners";
import { AdminBannersList } from "@/components/admin/banners/AdminBannersList";

export default function AdminBannersPage() {
  const banners = getBanners();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Banner 管理</h2>
      <AdminBannersList banners={banners} />
    </div>
  );
}
