"use client";

import { useState } from "react";
import type { Course } from "@/types";
import type {
  CourseMainCategory,
  CourseSubCategory,
  CourseStatus,
  CourseOutlineItem,
  CourseFaqItem,
} from "@/types/course";
import {
  MAIN_CATEGORY_LABELS,
  SUB_CATEGORY_LABELS,
} from "@/types/course";
import { AdminCard, AdminFormSection } from "@/components/admin";

const STATUS_OPTIONS: CourseStatus[] = ["open", "full", "closed", "coming"];
const STATUS_LABELS: Record<CourseStatus, string> = {
  open: "招生中",
  full: "已額滿",
  closed: "已截止",
  coming: "即將開放",
};

const SUB_BY_MAIN: Record<CourseMainCategory, CourseSubCategory[]> = {
  government: ["job-preparation", "in-service", "special-class"],
  paid: ["certification", "promotion"],
};

function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u4e00-\u9fff-]/g, "");
}

interface CourseFormProps {
  initialData?: Course | null;
  onSave?: (data: Course) => void;
}

const emptyCourse = (): Partial<Course> => ({
  id: "",
  slug: "",
  title: "",
  mainCategory: "government",
  subCategory: "job-preparation",
  tags: [],
  summary: "",
  description: "",
  targetAudience: [],
  features: [],
  outline: [],
  location: "",
  hours: 0,
  quota: 0,
  status: "open",
  startDate: "",
  endDate: "",
  image: "",
  applyUrl: "",
  faq: [],
  featured: false,
});

export function CourseForm({ initialData, onSave }: CourseFormProps) {
  const [form, setForm] = useState<Partial<Course>>(() =>
    initialData ? { ...initialData } : { ...emptyCourse() }
  );

  const update = <K extends keyof Course>(key: K, value: Course[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !initialData && typeof value === "string") {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const addArrayItem = (key: "tags" | "targetAudience" | "features", value: string) => {
    if (!value.trim()) return;
    setForm((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), value.trim()],
    }));
  };

  const removeArrayItem = (key: "tags" | "targetAudience" | "features", idx: number) => {
    setForm((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((_, i) => i !== idx),
    }));
  };

  const addOutlineItem = () => {
    const outline = (form.outline || []) as CourseOutlineItem[];
    const nextUnit = outline.length + 1;
    setForm((prev) => ({
      ...prev,
      outline: [...outline, { unit: nextUnit, title: "", content: "" }],
    }));
  };

  const updateOutlineItem = (idx: number, field: "title" | "content", value: string) => {
    const outline = [...(form.outline || [])] as CourseOutlineItem[];
    outline[idx] = { ...outline[idx], [field]: value };
    setForm((prev) => ({ ...prev, outline }));
  };

  const removeOutlineItem = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      outline: (prev.outline || []).filter((_, i) => i !== idx),
    }));
  };

  const addFaqItem = () => {
    const faq = (form.faq || []) as CourseFaqItem[];
    setForm((prev) => ({ ...prev, faq: [...faq, { question: "", answer: "" }] }));
  };

  const updateFaqItem = (idx: number, field: "question" | "answer", value: string) => {
    const faq = [...(form.faq || [])] as CourseFaqItem[];
    faq[idx] = { ...faq[idx], [field]: value };
    setForm((prev) => ({ ...prev, faq }));
  };

  const removeFaqItem = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      faq: (prev.faq || []).filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim() || !form.slug?.trim()) {
      alert("請填寫標題與 Slug");
      return;
    }
    const data: Course = {
      id: form.id || `course-${Date.now()}`,
      slug: form.slug.trim(),
      title: form.title.trim(),
      mainCategory: form.mainCategory || "government",
      subCategory: form.subCategory || "job-preparation",
      tags: form.tags || [],
      summary: form.summary || "",
      description: form.description || "",
      targetAudience: form.targetAudience || [],
      features: form.features || [],
      outline: (form.outline || []) as CourseOutlineItem[],
      location: form.location || "",
      hours: form.hours ?? 0,
      quota: form.quota ?? 0,
      status: form.status || "open",
      startDate: form.startDate || "",
      endDate: form.endDate || "",
      image: form.image || "",
      applyUrl: form.applyUrl || "",
      faq: (form.faq || []) as CourseFaqItem[],
      featured: form.featured || false,
      instructors: form.instructors,
    };
    onSave?.(data);
  };

  const teacherName =
    (form.instructors?.[0]?.name as string) || "";
  const setTeacher = (name: string) => {
    setForm((prev) => ({
      ...prev,
      instructors: name
        ? [{ id: "temp", name, title: "", bio: "" }]
        : [],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <AdminFormSection title="基本資訊">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">標題 *</label>
            <input
              type="text"
              value={form.title || ""}
              onChange={(e) => update("title", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Slug *</label>
            <input
              type="text"
              value={form.slug || ""}
              onChange={(e) => update("slug", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
              placeholder="url-friendly-id"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">主分類 *</label>
            <select
              value={form.mainCategory || "government"}
              onChange={(e) => {
                const v = e.target.value as CourseMainCategory;
                update("mainCategory", v);
                update("subCategory", SUB_BY_MAIN[v][0]);
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {Object.entries(MAIN_CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">子分類 *</label>
            <select
              value={form.subCategory || "job-preparation"}
              onChange={(e) => update("subCategory", e.target.value as CourseSubCategory)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {(SUB_BY_MAIN[(form.mainCategory || "government")] || []).map((key) => (
                <option key={key} value={key}>{SUB_CATEGORY_LABELS[key]}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">標籤</label>
          <div className="flex flex-wrap gap-2">
            {(form.tags || []).map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-sm"
              >
                {t}
                <button type="button" onClick={() => removeArrayItem("tags", i)} className="text-slate-500 hover:text-red-600">
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="新增標籤"
              className="w-24 rounded border border-slate-300 px-2 py-1 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addArrayItem("tags", (e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">摘要 *</label>
          <textarea
            value={form.summary || ""}
            onChange={(e) => update("summary", e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </AdminFormSection>

      <AdminFormSection title="完整介紹">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">說明</label>
          <textarea
            value={form.description || ""}
            onChange={(e) => update("description", e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">適合對象</label>
          <div className="flex flex-wrap gap-2">
            {(form.targetAudience || []).map((t, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-sm">
                {t}
                <button type="button" onClick={() => removeArrayItem("targetAudience", i)}>×</button>
              </span>
            ))}
            <input
              type="text"
              placeholder="新增"
              className="w-24 rounded border px-2 py-1 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addArrayItem("targetAudience", (e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">課程特色</label>
          <div className="space-y-2">
            {(form.features || []).map((f, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={f}
                  onChange={(e) => {
                    const arr = [...(form.features || [])];
                    arr[i] = e.target.value;
                    update("features", arr);
                  }}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <button type="button" onClick={() => removeArrayItem("features", i)} className="text-red-600">刪除</button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("features", "新特色")}
              className="text-sm text-primary-600 hover:underline"
            >
              + 新增特色
            </button>
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection title="課程大綱">
        <div className="space-y-4">
          {(form.outline || []).map((item, i) => (
            <div key={i} className="flex flex-wrap gap-4 rounded-lg border border-slate-200 p-4">
              <span className="text-sm text-slate-500">單元 {(item as CourseOutlineItem).unit || i + 1}</span>
              <input
                type="text"
                placeholder="標題"
                value={(item as CourseOutlineItem).title}
                onChange={(e) => updateOutlineItem(i, "title", e.target.value)}
                className="flex-1 min-w-[120px] rounded border px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="內容"
                value={(item as CourseOutlineItem).content}
                onChange={(e) => updateOutlineItem(i, "content", e.target.value)}
                className="flex-1 min-w-[200px] rounded border px-3 py-2 text-sm"
              />
              <button type="button" onClick={() => removeOutlineItem(i)} className="text-red-600 text-sm">刪除</button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOutlineItem}
            className="text-sm text-primary-600 hover:underline"
          >
            + 新增單元
          </button>
        </div>
      </AdminFormSection>

      <AdminFormSection title="開課資訊">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">師資</label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacher(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">地點 *</label>
            <input
              type="text"
              value={form.location || ""}
              onChange={(e) => update("location", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">時數 *</label>
            <input
              type="number"
              value={form.hours || 0}
              onChange={(e) => update("hours", parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">名額</label>
            <input
              type="number"
              value={form.quota || 0}
              onChange={(e) => update("quota", parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">開課日期 *</label>
            <input
              type="date"
              value={form.startDate || ""}
              onChange={(e) => update("startDate", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">結訓日期</label>
            <input
              type="date"
              value={form.endDate || ""}
              onChange={(e) => update("endDate", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">招生狀態</label>
            <select
              value={form.status || "open"}
              onChange={(e) => update("status", e.target.value as CourseStatus)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection title="媒體與連結">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">封面圖 URL</label>
            <input
              type="text"
              value={form.image || ""}
              onChange={(e) => update("image", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">報名連結</label>
            <input
              type="text"
              value={form.applyUrl || ""}
              onChange={(e) => update("applyUrl", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="/apply?courseId=xxx"
            />
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection title="課程 FAQ">
        <div className="space-y-4">
          {(form.faq || []).map((item, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-4">
              <input
                type="text"
                placeholder="問題"
                value={(item as CourseFaqItem).question}
                onChange={(e) => updateFaqItem(i, "question", e.target.value)}
                className="mb-2 w-full rounded border px-3 py-2 text-sm"
              />
              <textarea
                placeholder="回答"
                value={(item as CourseFaqItem).answer}
                onChange={(e) => updateFaqItem(i, "answer", e.target.value)}
                rows={2}
                className="w-full rounded border px-3 py-2 text-sm"
              />
              <button type="button" onClick={() => removeFaqItem(i)} className="mt-2 text-sm text-red-600">刪除</button>
            </div>
          ))}
          <button type="button" onClick={addFaqItem} className="text-sm text-primary-600 hover:underline">
            + 新增 FAQ
          </button>
        </div>
      </AdminFormSection>

      <AdminFormSection title="顯示設定">
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.featured || false}
              onChange={(e) => update("featured", e.target.checked)}
              className="rounded border-slate-300"
            />
            <span className="text-sm">精選課程</span>
          </label>
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
