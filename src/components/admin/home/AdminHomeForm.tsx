"use client";

import { useState } from "react";
import type { HomePageConfig } from "@/types/home";
import { AdminCard, AdminFormSection } from "@/components/admin";
import { AdminArrayField } from "@/components/admin/ui/AdminArrayField";

interface AdminHomeFormProps {
  initialData: HomePageConfig;
  onSave?: (data: HomePageConfig) => void;
}

export function AdminHomeForm({ initialData, onSave }: AdminHomeFormProps) {
  const [form, setForm] = useState(initialData);

  const update = <K extends keyof HomePageConfig>(
    key: K,
    value: HomePageConfig[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(form);
    alert("儲存成功（mock 階段資料未實際寫入）");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <AdminFormSection title="Hero 主視覺">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">主標 *</label>
            <input
              type="text"
              value={form.hero.title}
              onChange={(e) =>
                update("hero", { ...form.hero, title: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">副標</label>
            <textarea
              value={form.hero.subtitle}
              onChange={(e) =>
                update("hero", { ...form.hero, subtitle: e.target.value })
              }
              rows={2}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">主按鈕文字 *</label>
              <input
                type="text"
                value={form.hero.primaryCta.label}
                onChange={(e) =>
                  update("hero", {
                    ...form.hero,
                    primaryCta: { ...form.hero.primaryCta, label: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">主按鈕連結 *</label>
              <input
                type="text"
                value={form.hero.primaryCta.href}
                onChange={(e) =>
                  update("hero", {
                    ...form.hero,
                    primaryCta: { ...form.hero.primaryCta, href: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="/courses"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">次按鈕文字</label>
              <input
                type="text"
                value={form.hero.secondaryCta?.label ?? ""}
                onChange={(e) =>
                  update("hero", {
                    ...form.hero,
                    secondaryCta: {
                      ...form.hero.secondaryCta,
                      label: e.target.value,
                      href: form.hero.secondaryCta?.href ?? "/apply",
                    },
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">次按鈕連結</label>
              <input
                type="text"
                value={form.hero.secondaryCta?.href ?? ""}
                onChange={(e) =>
                  update("hero", {
                    ...form.hero,
                    secondaryCta: {
                      ...form.hero.secondaryCta,
                      label: form.hero.secondaryCta?.label ?? "",
                      href: e.target.value,
                    },
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="適合對象"
        description="首頁「適合對象」區塊的標題與項目列表"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">區塊標題</label>
            <input
              type="text"
              value={form.audienceSection?.title ?? ""}
              onChange={(e) =>
                update("audienceSection", {
                  ...form.audienceSection,
                  title: e.target.value,
                  items: form.audienceSection?.items ?? [],
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <AdminArrayField
            label="項目列表"
            items={form.audienceSection?.items ?? []}
            onChange={(items) =>
              update("audienceSection", {
                ...form.audienceSection,
                title: form.audienceSection?.title ?? "",
                items,
              })
            }
            placeholder="待業者、轉職者..."
          />
        </div>
      </AdminFormSection>

      <AdminFormSection title="首頁課程分類入口" description="政府補助／自費兩張卡片">
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="mb-3 text-sm font-medium text-slate-700">政府補助課程</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="標題"
                value={form.categoryEntry?.government.title ?? ""}
                onChange={(e) =>
                  update("categoryEntry", {
                    ...form.categoryEntry,
                    government: {
                      ...form.categoryEntry?.government,
                      title: e.target.value,
                      description: form.categoryEntry?.government.description ?? "",
                      href: form.categoryEntry?.government.href ?? "",
                    },
                    paid: form.categoryEntry?.paid ?? {
                      title: "",
                      description: "",
                      href: "",
                    },
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="描述"
                value={form.categoryEntry?.government.description ?? ""}
                onChange={(e) =>
                  update("categoryEntry", {
                    ...form.categoryEntry,
                    government: {
                      ...form.categoryEntry?.government,
                      title: form.categoryEntry?.government.title ?? "",
                      description: e.target.value,
                      href: form.categoryEntry?.government.href ?? "",
                    },
                    paid: form.categoryEntry?.paid ?? {
                      title: "",
                      description: "",
                      href: "",
                    },
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="連結"
                value={form.categoryEntry?.government.href ?? ""}
                onChange={(e) =>
                  update("categoryEntry", {
                    ...form.categoryEntry,
                    government: {
                      ...form.categoryEntry?.government,
                      title: form.categoryEntry?.government.title ?? "",
                      description: form.categoryEntry?.government.description ?? "",
                      href: e.target.value,
                    },
                    paid: form.categoryEntry?.paid ?? {
                      title: "",
                      description: "",
                      href: "",
                    },
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="mb-3 text-sm font-medium text-slate-700">自費課程</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="標題"
                value={form.categoryEntry?.paid.title ?? ""}
                onChange={(e) =>
                  update("categoryEntry", {
                    ...form.categoryEntry,
                    government: form.categoryEntry?.government ?? {
                      title: "",
                      description: "",
                      href: "",
                    },
                    paid: {
                      ...form.categoryEntry?.paid,
                      title: e.target.value,
                      description: form.categoryEntry?.paid.description ?? "",
                      href: form.categoryEntry?.paid.href ?? "",
                    },
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="描述"
                value={form.categoryEntry?.paid.description ?? ""}
                onChange={(e) =>
                  update("categoryEntry", {
                    ...form.categoryEntry,
                    government: form.categoryEntry?.government ?? {
                      title: "",
                      description: "",
                      href: "",
                    },
                    paid: {
                      ...form.categoryEntry?.paid,
                      title: form.categoryEntry?.paid.title ?? "",
                      description: e.target.value,
                      href: form.categoryEntry?.paid.href ?? "",
                    },
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="連結"
                value={form.categoryEntry?.paid.href ?? ""}
                onChange={(e) =>
                  update("categoryEntry", {
                    ...form.categoryEntry,
                    government: form.categoryEntry?.government ?? {
                      title: "",
                      description: "",
                      href: "",
                    },
                    paid: {
                      ...form.categoryEntry?.paid,
                      title: form.categoryEntry?.paid.title ?? "",
                      description: form.categoryEntry?.paid.description ?? "",
                      href: e.target.value,
                    },
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection title="熱門課程區塊">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">標題</label>
            <input
              type="text"
              value={form.featuredCourses?.title ?? ""}
              onChange={(e) =>
                update("featuredCourses", {
                  ...form.featuredCourses,
                  title: e.target.value,
                  subtitle: form.featuredCourses?.subtitle ?? "",
                  limit: form.featuredCourses?.limit ?? 6,
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">顯示數量</label>
            <input
              type="number"
              min={1}
              max={12}
              value={form.featuredCourses?.limit ?? 6}
              onChange={(e) =>
                update("featuredCourses", {
                  ...form.featuredCourses,
                  title: form.featuredCourses?.title ?? "",
                  subtitle: form.featuredCourses?.subtitle ?? "",
                  limit: parseInt(e.target.value, 10) || 6,
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection title="為什麼選擇我們" description="優勢項目列表">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">區塊標題</label>
            <input
              type="text"
              value={form.whyUs?.title ?? ""}
              onChange={(e) =>
                update("whyUs", {
                  ...form.whyUs,
                  title: e.target.value,
                  items: form.whyUs?.items ?? [],
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            {(form.whyUs?.items ?? []).map((item, i) => (
              <div key={i} className="flex gap-2 rounded-lg border border-slate-200 p-3">
                <input
                  type="text"
                  placeholder="標題"
                  value={item.title}
                  onChange={(e) => {
                    const items = [...(form.whyUs?.items ?? [])];
                    items[i] = { ...items[i], title: e.target.value };
                    update("whyUs", { title: form.whyUs?.title ?? "", items });
                  }}
                  className="flex-1 rounded border px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="描述"
                  value={item.description}
                  onChange={(e) => {
                    const items = [...(form.whyUs?.items ?? [])];
                    items[i] = { ...items[i], description: e.target.value };
                    update("whyUs", { title: form.whyUs?.title ?? "", items });
                  }}
                  className="flex-1 rounded border px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    const items = (form.whyUs?.items ?? []).filter((_, j) => j !== i);
                    update("whyUs", { title: form.whyUs?.title ?? "", items });
                  }}
                  className="text-red-600 text-sm hover:underline"
                >
                  刪除
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                update("whyUs", {
                  title: form.whyUs?.title ?? "",
                  items: [...(form.whyUs?.items ?? []), { title: "", description: "" }],
                })
              }
              className="text-sm text-primary-600 hover:underline"
            >
              + 新增優勢項目
            </button>
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection title="其他區塊標題" description="學員成果、見證、報名流程、FAQ 摘要">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">學員成果區塊標題</label>
            <input
              type="text"
              value={form.stories?.title ?? ""}
              onChange={(e) =>
                update("stories", { ...form.stories, title: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">學員見證區塊標題</label>
            <input
              type="text"
              value={form.testimonials?.title ?? ""}
              onChange={(e) =>
                update("testimonials", { ...form.testimonials, title: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">報名流程區塊標題</label>
            <input
              type="text"
              value={form.applySteps?.title ?? ""}
              onChange={(e) =>
                update("applySteps", { ...form.applySteps, title: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">FAQ 摘要區塊標題</label>
            <input
              type="text"
              value={form.faqSummary?.title ?? ""}
              onChange={(e) =>
                update("faqSummary", { ...form.faqSummary, title: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection title="頁尾 CTA 區塊">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">主標 *</label>
            <input
              type="text"
              value={form.cta.title}
              onChange={(e) =>
                update("cta", { ...form.cta, title: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">副標</label>
            <input
              type="text"
              value={form.cta.subtitle}
              onChange={(e) =>
                update("cta", { ...form.cta, subtitle: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">按鈕文字 *</label>
              <input
                type="text"
                value={form.cta.buttonLabel}
                onChange={(e) =>
                  update("cta", { ...form.cta, buttonLabel: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">按鈕連結 *</label>
              <input
                type="text"
                value={form.cta.buttonHref}
                onChange={(e) =>
                  update("cta", { ...form.cta, buttonHref: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                required
              />
            </div>
          </div>
        </div>
      </AdminFormSection>

      <div className="flex justify-end gap-4 border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          取消
        </button>
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
