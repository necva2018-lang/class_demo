"use client";

import { useState, useMemo } from "react";
import type { CaseStudy } from "@/lib/data/cases";
import {
  AdminCard,
  AdminTable,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
} from "@/components/admin";

interface AdminStoriesListProps {
  items: CaseStudy[];
}

export function AdminStoriesList({ items: initialItems }: AdminStoriesListProps) {
  const [items, setItems] = useState(initialItems);
  const [keyword, setKeyword] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const filtered = useMemo(() => {
    if (!keyword) return items;
    const k = keyword.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(k) ||
        (item.summary ?? "").toLowerCase().includes(k) ||
        (item.courseName ?? "").toLowerCase().includes(k)
    );
  }, [items, keyword]);

  async function persist(next: CaseStudy[]) {
    setItems(next);
    const res = await fetch("/api/config/cases", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: next }),
    });
    if (!res.ok) alert("儲存失敗（資料庫）");
  }

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`確定要刪除「${title}」嗎？`)) return;
    const next = items.filter((i) => i.id !== id);
    await persist(next);
    if (editingId === id) setEditingId(null);
  };

  const handleSave = async (item: CaseStudy) => {
    const exists = items.some((i) => i.id === item.id);
    let next: CaseStudy[];
    if (exists) {
      next = items.map((i) => (i.id === item.id ? item : i));
      setEditingId(null);
    } else {
      next = [item, ...items];
      setAdding(false);
    }
    await persist(next);
    alert("儲存成功");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
        <input
          type="search"
          placeholder="搜尋標題、摘要、課程..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="min-w-[200px] max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => setKeyword("")}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          清除
        </button>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="ml-auto rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          新增案例
        </button>
      </div>

      {adding && (
        <AdminCard title="新增成果案例">
          <CaseItemForm
            item={{
              id: `case-${Date.now()}`,
              slug: "",
              title: "",
              summary: "",
              content: "",
              publishedAt: new Date().toISOString().slice(0, 10),
              courseName: "",
              year: new Date().getFullYear(),
            } as CaseStudy}
            onSave={handleSave}
            onCancel={() => setAdding(false)}
          />
        </AdminCard>
      )}

      <AdminCard>
        {filtered.length > 0 ? (
          <AdminTable>
            <AdminTableHead>
              <AdminTableHeaderCell>標題</AdminTableHeaderCell>
              <AdminTableHeaderCell>課程</AdminTableHeaderCell>
              <AdminTableHeaderCell>年度</AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-right">操作</AdminTableHeaderCell>
            </AdminTableHead>
            <AdminTableBody>
              {filtered.map((item) =>
                editingId === item.id ? (
                  <AdminTableRow key={item.id}>
                    <AdminTableCell colSpan={4} className="bg-slate-50">
                      <CaseItemForm
                        item={item}
                        onSave={handleSave}
                        onCancel={() => setEditingId(null)}
                      />
                    </AdminTableCell>
                  </AdminTableRow>
                ) : (
                  <AdminTableRow key={item.id}>
                    <AdminTableCell className="font-medium">{item.title}</AdminTableCell>
                    <AdminTableCell>{item.courseName ?? "—"}</AdminTableCell>
                    <AdminTableCell>{item.year ?? "—"}</AdminTableCell>
                    <AdminTableCell className="text-right">
                      <button
                        type="button"
                        onClick={() => setEditingId(item.id)}
                        className="text-primary-600 hover:underline"
                      >
                        編輯
                      </button>
                      <span className="mx-2 text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.title)}
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
            尚無符合條件的案例
            {items.length === 0 ? "，點擊「新增案例」開始新增" : "，請調整搜尋條件"}
          </p>
        )}
        {filtered.length > 0 && (
          <p className="mt-4 text-sm text-slate-500">共 {filtered.length} 筆</p>
        )}
      </AdminCard>
    </div>
  );
}

function CaseItemForm({
  item,
  onSave,
  onCancel,
}: {
  item: CaseStudy;
  onSave: (item: CaseStudy) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(item);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("請填寫標題");
      return;
    }
    const slug =
      form.slug.trim() ||
      form.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\u4e00-\u9fff-]/g, "");
    onSave({ ...form, slug });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
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
        <label className="mb-1 block text-sm font-medium text-slate-700">摘要</label>
        <textarea
          value={form.summary}
          onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">相關課程</label>
          <input
            type="text"
            value={form.courseName ?? ""}
            onChange={(e) => setForm((prev) => ({ ...prev, courseName: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">年度</label>
          <input
            type="number"
            value={form.year ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                year: e.target.value ? parseInt(e.target.value, 10) : undefined,
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="2024"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Slug（選填）</label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
        />
      </div>
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
    </form>
  );
}
