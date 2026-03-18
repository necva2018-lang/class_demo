"use client";

import { useState } from "react";
import type { AboutConfig } from "@/types/about";
import { AdminCard, AdminFormSection, AdminArrayField } from "@/components/admin";
import { getAboutConfig, setAboutConfigLocal } from "@/lib/data/about";

export function AdminAboutForm() {
  const [config, setConfig] = useState<AboutConfig>(() => getAboutConfig());

  const update = <K extends keyof AboutConfig>(
    key: K,
    value: AboutConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAboutConfigLocal(config);
    alert("儲存成功");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <AdminCard>
        <AdminFormSection title="協會基本資訊">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              協會名稱
            </label>
            <input
              type="text"
              value={config.associationName ?? ""}
              onChange={(e) => update("associationName", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              協會簡介
            </label>
            <textarea
              value={config.intro ?? ""}
              onChange={(e) => update("intro", e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              成立宗旨
            </label>
            <textarea
              value={config.mission ?? ""}
              onChange={(e) => update("mission", e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </AdminFormSection>
      </AdminCard>

      <AdminCard>
        <AdminFormSection title="服務與特色">
          <AdminArrayField
            label="服務對象"
            items={config.serviceAudience ?? []}
            onChange={(items) => update("serviceAudience", items)}
            placeholder="新增服務對象"
          />
          <AdminArrayField
            label="核心特色"
            items={config.coreFeatures ?? []}
            onChange={(items) => update("coreFeatures", items)}
            placeholder="新增特色項目"
          />
          <AdminArrayField
            label="合作單位"
            items={config.partners ?? []}
            onChange={(items) => update("partners", items)}
            placeholder="新增合作單位"
          />
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
                value={config.contact?.phone ?? ""}
                onChange={(e) =>
                  update("contact", {
                    ...(config.contact ?? {}),
                    phone: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={config.contact?.email ?? ""}
                onChange={(e) =>
                  update("contact", {
                    ...(config.contact ?? {}),
                    email: e.target.value,
                  })
                }
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
              value={config.contact?.address ?? ""}
              onChange={(e) =>
                update("contact", {
                  ...config.contact,
                  address: e.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              地圖嵌入欄位（預留）
            </label>
            <textarea
              value={config.contact?.mapEmbed ?? ""}
              onChange={(e) =>
                update("contact", {
                  ...config.contact,
                  mapEmbed: e.target.value,
                })
              }
              rows={2}
              placeholder="可貼入 Google Map iframe 或 embed code"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
            />
          </div>
        </AdminFormSection>
      </AdminCard>

      <AdminCard>
        <AdminFormSection title="頁面 CTA">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                CTA 按鈕文字
              </label>
              <input
                type="text"
                value={config.cta?.text ?? ""}
                onChange={(e) =>
                  update("cta", { ...config.cta, text: e.target.value, href: config.cta?.href ?? "" })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                CTA 按鈕連結
              </label>
              <input
                type="text"
                value={config.cta?.href ?? ""}
                onChange={(e) =>
                  update("cta", { text: config.cta?.text ?? "", href: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="/courses 或 https://..."
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
