"use client";

import { useState, useMemo } from "react";
import type { News } from "@/lib/data/news";
import { setNewsLocal } from "@/lib/data/news";
import {
  AdminCard,
  AdminTable,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
} from "@/components/admin";

const NEWS_TYPE_LABELS: Record<string, string> = {
  announcement: "公告",
  course: "課程訊息",
  event: "活動",
  other: "其他",
};

interface AdminNewsListProps {
  items: News[];
}

export function AdminNewsList({ items: initialItems }: AdminNewsListProps) {
  const [items, setItems] = useState(initialItems);
  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (keyword) {
        const k = keyword.toLowerCase();
        if (
          !item.title.toLowerCase().includes(k) &&
          !item.summary.toLowerCase().includes(k)
        ) {
          return false;
        }
      }
      if (typeFilter && item.type !== typeFilter) return false;
      return true;
    });
  }, [items, keyword, typeFilter]);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`確定要刪除「${title}」嗎？`)) {
      const next = items.filter((i) => i.id !== id);
      setItems(next);
      setNewsLocal(next);
      if (editingId === id) setEditingId(null);
    }
  };

  const handleSave = (item: News) => {
    const exists = items.some((i) => i.id === item.id);
    let next: News[];
    if (exists) {
      next = items.map((i) => (i.id === item.id ? item : i));
      setItems(next);
      setEditingId(null);
    } else {
      next = [item, ...items];
      setItems(next);
      setAdding(false);
    }
    setNewsLocal(next);
    alert("儲存成功");
  };

  const formatDate = (str: string) => {
    const d = new Date(str);
    return d.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
        <input
          type="search"
          placeholder="搜尋標題、摘要..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="min-w-[200px] max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">全部類型</option>
          {Object.entries(NEWS_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => { setKeyword(""); setTypeFilter(""); }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          清除篩選
        </button>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="ml-auto rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          新增消息
        </button>
      </div>

      {adding && (
        <AdminCard title="新增最新消息">
          <NewsItemForm
            item={{
              id: `news-${Date.now()}`,
              slug: "",
              title: "",
              summary: "",
              type: "announcement",
              publishedAt: new Date().toISOString().slice(0, 10),
            } as News}
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
              <AdminTableHeaderCell>類型</AdminTableHeaderCell>
              <AdminTableHeaderCell>發布日期</AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-right">操作</AdminTableHeaderCell>
            </AdminTableHead>
            <AdminTableBody>
              {filtered.map((item) =>
                editingId === item.id ? (
                  <AdminTableRow key={item.id}>
                    <AdminTableCell colSpan={4} className="bg-slate-50">
                      <NewsItemForm
                        item={item}
                        onSave={handleSave}
                        onCancel={() => setEditingId(null)}
                      />
                    </AdminTableCell>
                  </AdminTableRow>
                ) : (
                  <AdminTableRow key={item.id}>
                    <AdminTableCell className="font-medium">{item.title}</AdminTableCell>
                    <AdminTableCell>
                      {NEWS_TYPE_LABELS[item.type] ?? item.type}
                    </AdminTableCell>
                    <AdminTableCell>{formatDate(item.publishedAt)}</AdminTableCell>
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
            尚無符合條件的消息
            {items.length === 0 ? "，點擊「新增消息」開始新增" : "，請調整篩選條件"}
          </p>
        )}
        {filtered.length > 0 && (
          <p className="mt-4 text-sm text-slate-500">共 {filtered.length} 筆</p>
        )}
      </AdminCard>
    </div>
  );
}

function NewsItemForm({
  item,
  onSave,
  onCancel,
}: {
  item: News;
  onSave: (item: News) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(item);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("請填寫標題");
      return;
    }
    const slug = form.slug.trim() || form.title
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
          <label className="mb-1 block text-sm font-medium text-slate-700">類型</label>
          <select
            value={form.type}
            onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {Object.entries(NEWS_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">發布日期</label>
          <input
            type="date"
            value={form.publishedAt.slice(0, 10)}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                publishedAt: e.target.value + "T00:00:00Z",
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Slug（選填，自動產生）</label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
          placeholder="url-friendly-id"
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
