"use client";

import { useState, useMemo } from "react";
import type { Banner } from "@/types/banner";
import { setBannersLocal } from "@/lib/data/banners";
import {
  AdminCard,
  AdminTable,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
} from "@/components/admin";

interface AdminBannersListProps {
  banners: Banner[];
}

export function AdminBannersList({ banners: initialBanners }: AdminBannersListProps) {
  const [banners, setBanners] = useState(initialBanners);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const sorted = useMemo(
    () => [...banners].sort((a, b) => a.order - b.order),
    [banners]
  );

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`確定要刪除「${title}」嗎？`)) {
      const next = banners.filter((b) => b.id !== id);
      setBanners(next);
      setBannersLocal(next);
      if (editingId === id) setEditingId(null);
    }
  };

  const handleSave = (banner: Banner) => {
    const exists = banners.some((b) => b.id === banner.id);
    let next: Banner[];
    if (exists) {
      next = banners.map((b) => (b.id === banner.id ? banner : b));
      setBanners(next);
      setEditingId(null);
    } else {
      next = [...banners, banner].sort((a, b) => a.order - b.order);
      setBanners(next);
      setAdding(false);
    }
    setBannersLocal(next);
    alert("儲存成功");
  };

  const handleMove = (id: string, direction: "up" | "down") => {
    const idx = sorted.findIndex((b) => b.id === id);
    if (idx < 0) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= sorted.length) return;
    const reordered = [...sorted];
    [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
    const next = reordered.map((b, i) => ({ ...b, order: i }));
    setBanners(next);
    setBannersLocal(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          新增 Banner
        </button>
      </div>

      {adding && (
        <AdminCard title="新增 Banner">
          <BannerForm
            banner={{
              id: `banner-${Date.now()}`,
              title: "",
              subtitle: "",
              backgroundImage: "",
              primaryCta: { label: "", href: "" },
              secondaryCta: { label: "", href: "" },
              order: banners.length,
              active: true,
              isDefault: false,
            }}
            onSave={handleSave}
            onCancel={() => setAdding(false)}
          />
        </AdminCard>
      )}

      <AdminCard>
        {sorted.length > 0 ? (
          <AdminTable>
            <AdminTableHead>
              <AdminTableHeaderCell>順序</AdminTableHeaderCell>
              <AdminTableHeaderCell>標題</AdminTableHeaderCell>
              <AdminTableHeaderCell>狀態</AdminTableHeaderCell>
              <AdminTableHeaderCell>預設</AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-right">操作</AdminTableHeaderCell>
            </AdminTableHead>
            <AdminTableBody>
              {sorted.map((banner, idx) =>
                editingId === banner.id ? (
                  <AdminTableRow key={banner.id}>
                    <AdminTableCell colSpan={5} className="bg-slate-50">
                      <BannerForm
                        banner={banner}
                        onSave={handleSave}
                        onCancel={() => setEditingId(null)}
                      />
                    </AdminTableCell>
                  </AdminTableRow>
                ) : (
                  <AdminTableRow key={banner.id}>
                    <AdminTableCell>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMove(banner.id, "up")}
                          disabled={idx === 0}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                          aria-label="上移"
                        >
                          ↑
                        </button>
                        <span>{banner.order + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleMove(banner.id, "down")}
                          disabled={idx === sorted.length - 1}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                          aria-label="下移"
                        >
                          ↓
                        </button>
                      </div>
                    </AdminTableCell>
                    <AdminTableCell className="font-medium">{banner.title || "—"}</AdminTableCell>
                    <AdminTableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          banner.active ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {banner.active ? "啟用" : "停用"}
                      </span>
                    </AdminTableCell>
                    <AdminTableCell>{banner.isDefault ? "是" : "否"}</AdminTableCell>
                    <AdminTableCell className="text-right">
                      <button
                        type="button"
                        onClick={() => setEditingId(banner.id)}
                        className="text-primary-600 hover:underline"
                      >
                        編輯
                      </button>
                      <span className="mx-2 text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(banner.id, banner.title)}
                        className="text-red-600 hover:underline"
                      >
                        刪除
                      </button>
                    </AdminTableCell>
                  </AdminTableRow>
                )
              )}
            </AdminTableBody>
          </AdminTable>
        ) : (
          <p className="py-12 text-center text-slate-500">
            尚無 Banner，點擊「新增 Banner」開始新增
          </p>
        )}
      </AdminCard>
    </div>
  );
}

function BannerForm({
  banner,
  onSave,
  onCancel,
}: {
  banner: Banner;
  onSave: (banner: Banner) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(banner);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) {
      alert("請填寫標題");
      return;
    }
    onSave({ ...form });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">標題 *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">副標</label>
          <input
            type="text"
            value={form.subtitle}
            onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">背景圖片 URL</label>
        <input
          type="text"
          value={form.backgroundImage}
          onChange={(e) => setForm((prev) => ({ ...prev, backgroundImage: e.target.value }))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="/images/hero.jpg"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">主按鈕文字</label>
          <input
            type="text"
            value={form.primaryCta?.label ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                primaryCta: { ...prev.primaryCta, label: e.target.value, href: prev.primaryCta?.href ?? "" },
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">主按鈕連結</label>
          <input
            type="text"
            value={form.primaryCta?.href ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                primaryCta: { ...prev.primaryCta, label: prev.primaryCta?.label ?? "", href: e.target.value },
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">次按鈕文字</label>
          <input
            type="text"
            value={form.secondaryCta?.label ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                secondaryCta: { ...prev.secondaryCta, label: e.target.value, href: prev.secondaryCta?.href ?? "" },
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">次按鈕連結</label>
          <input
            type="text"
            value={form.secondaryCta?.href ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                secondaryCta: { ...prev.secondaryCta, label: prev.secondaryCta?.label ?? "", href: e.target.value },
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
            className="rounded border-slate-300"
          />
          <span className="text-sm">啟用</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
            className="rounded border-slate-300"
          />
          <span className="text-sm">預設主 Banner</span>
        </label>
        <div className="flex-1" />
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            儲存
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            取消
          </button>
        </div>
      </div>
    </form>
  );
}
