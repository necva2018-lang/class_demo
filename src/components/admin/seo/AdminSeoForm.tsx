"use client";

import { useState } from "react";
import type { SeoSettings } from "@/types/seo-config";
import { AdminCard, AdminFormSection } from "@/components/admin";
import { getSeoSettings, setSeoSettingsLocal } from "@/lib/data/seo-settings";

export function AdminSeoForm() {
  const [settings, setSettings] = useState<SeoSettings>(() => getSeoSettings());

  const update = <K extends keyof SeoSettings>(
    key: K,
    value: SeoSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSeoSettingsLocal(settings);
    alert("儲存成功");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <AdminCard>
        <AdminFormSection
          title="全站預設 SEO"
          description="各頁面若未自訂，將使用此預設值"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              全站預設 SEO title
            </label>
            <input
              type="text"
              value={settings.defaultTitle ?? ""}
              onChange={(e) => update("defaultTitle", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="找到適合的職訓課程，開啟職涯新篇章"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              全站預設 SEO description
            </label>
            <textarea
              value={settings.defaultDescription ?? ""}
              onChange={(e) => update("defaultDescription", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="提供政府補助與自費職訓課程..."
            />
          </div>
        </AdminFormSection>
      </AdminCard>

      <AdminCard>
        <AdminFormSection
          title="Open Graph"
          description="社群分享時顯示的標題與描述"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              OG Title
            </label>
            <input
              type="text"
              value={settings.ogTitle ?? ""}
              onChange={(e) => update("ogTitle", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="若未填寫，使用全站預設 title"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              OG Description
            </label>
            <textarea
              value={settings.ogDescription ?? ""}
              onChange={(e) => update("ogDescription", e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              OG Image URL
            </label>
            <input
              type="text"
              value={settings.ogImage ?? ""}
              onChange={(e) => update("ogImage", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
              placeholder="/images/og-default.png 或完整 URL，建議 1200x630"
            />
          </div>
        </AdminFormSection>
      </AdminCard>

      <AdminCard>
        <AdminFormSection title="進階設定">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              robots 設定
            </label>
            <select
              value={settings.robots ?? "index, follow"}
              onChange={(e) => update("robots", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="index, follow">index, follow（允許索引）</option>
              <option value="noindex, nofollow">noindex, nofollow（不索引）</option>
              <option value="index, nofollow">index, nofollow</option>
              <option value="noindex, follow">noindex, follow</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Schema / 結構化資料（預留）
            </label>
            <textarea
              value={settings.schemaJson ?? ""}
              onChange={(e) => update("schemaJson", e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
              placeholder='可貼入 JSON-LD 結構化資料，例如 {"@context":"https://schema.org",...}'
            />
          </div>
        </AdminFormSection>
      </AdminCard>

      <div className="flex justify-end gap-4 border-t border-slate-200 pt-6">
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          儲存
        </button>
      </div>
    </form>
  );
}
