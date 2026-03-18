"use client";

import { useEffect, useState } from "react";
import type { SiteSettings } from "@/types/settings";
import { withBasePath } from "@/lib/routes";
import { AdminCard, AdminFormSection } from "@/components/admin";
import siteSettings from "@/data/site-settings.json";

export function AdminSettingsForm() {
  const [settings, setSettings] = useState<SiteSettings>(() => siteSettings as SiteSettings);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch(withBasePath("/api/config/settings"), { cache: "no-store" });
      if (!res.ok) return;
      const json = (await res.json()) as { value: SiteSettings | null };
      if (cancelled) return;
      if (json.value) setSettings(json.value);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = <K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateContact = (k: keyof SiteSettings["contact"], v: string) => {
    setSettings((prev) => ({
      ...prev,
      contact: { ...(prev.contact ?? {}), [k]: v },
    }));
  };

  const updateSocial = (k: keyof SiteSettings["social"], v: string) => {
    setSettings((prev) => ({
      ...prev,
      social: { ...(prev.social ?? {}), [k]: v },
    }));
  };

  const updateFooter = (k: keyof SiteSettings["footer"], v: string) => {
    setSettings((prev) => ({
      ...prev,
      footer: { ...(prev.footer ?? {}), [k]: v },
    }));
  };

  const updateCta = (k: keyof SiteSettings["cta"], v: string) => {
    setSettings((prev) => ({
      ...prev,
      cta: { ...(prev.cta ?? {}), [k]: v },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(withBasePath("/api/config/settings"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: settings }),
    });
    if (!res.ok) {
      alert("儲存失敗");
      return;
    }
    alert("儲存成功");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <AdminCard>
        <AdminFormSection title="網站基本資訊">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              網站名稱
            </label>
            <input
              type="text"
              value={settings.siteName ?? ""}
              onChange={(e) => update("siteName", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              網站副標題
            </label>
            <input
              type="text"
              value={settings.siteSubtitle ?? ""}
              onChange={(e) => update("siteSubtitle", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="選填"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Logo URL
            </label>
            <input
              type="text"
              value={settings.logo ?? ""}
              onChange={(e) => update("logo", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
              placeholder="/images/logo.png 或完整 URL"
            />
          </div>
        </AdminFormSection>
      </AdminCard>

      <AdminCard>
        <AdminFormSection title="聯絡資訊">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                聯絡電話
              </label>
              <input
                type="text"
                value={settings.contact?.phone ?? ""}
                onChange={(e) => updateContact("phone", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={settings.contact?.email ?? ""}
                onChange={(e) => updateContact("email", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              地址
            </label>
            <input
              type="text"
              value={settings.contact?.address ?? ""}
              onChange={(e) => updateContact("address", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              服務時間
            </label>
            <input
              type="text"
              value={settings.contact?.serviceHours ?? ""}
              onChange={(e) => updateContact("serviceHours", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="週一至週五 09:00-18:00"
            />
          </div>
        </AdminFormSection>
      </AdminCard>

      <AdminCard>
        <AdminFormSection title="社群連結">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                LINE 連結
              </label>
              <input
                type="url"
                value={settings.social?.line ?? ""}
                onChange={(e) => updateSocial("line", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="https://line.me/..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Facebook 連結
              </label>
              <input
                type="url"
                value={settings.social?.facebook ?? ""}
                onChange={(e) => updateSocial("facebook", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>
        </AdminFormSection>
      </AdminCard>

      <AdminCard>
        <AdminFormSection title="頁尾與 CTA">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              頁尾版權文字
            </label>
            <input
              type="text"
              value={settings.footer?.copyright ?? ""}
              onChange={(e) => updateFooter("copyright", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="© 2025 職訓課程招生網 版權所有"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                全站預設 CTA 文字
              </label>
              <input
                type="text"
                value={settings.cta?.defaultLabel ?? ""}
                onChange={(e) => updateCta("defaultLabel", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="立即找課程"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                全站預設 CTA 連結
              </label>
              <input
                type="text"
                value={settings.cta?.defaultHref ?? ""}
                onChange={(e) => updateCta("defaultHref", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="/courses"
              />
            </div>
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
