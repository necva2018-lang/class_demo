"use client";

import { useState, useMemo } from "react";
import type { FaqItem } from "@/lib/data/faq";
import {
  AdminCard,
  AdminTable,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
} from "@/components/admin";

const FAQ_CATEGORIES = [
  { id: "enrollment", name: "報名相關" },
  { id: "subsidy", name: "補助相關" },
  { id: "course", name: "課程相關" },
  { id: "other", name: "其他" },
];

interface AdminFaqListProps {
  items: FaqItem[];
  categories: { id: string; name: string }[];
}

export function AdminFaqList({ items: initialItems, categories }: AdminFaqListProps) {
  const [items, setItems] = useState(initialItems);
  const [keyword, setKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<FaqItem> | null>(null);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (keyword) {
        const k = keyword.toLowerCase();
        if (
          !item.question.toLowerCase().includes(k) &&
          !item.answer.toLowerCase().includes(k)
        ) {
          return false;
        }
      }
      if (categoryFilter && item.categoryId !== categoryFilter) return false;
      return true;
    });
  }, [items, keyword, categoryFilter]);

  async function persist(next: FaqItem[]) {
    setItems(next);
    const res = await fetch("/api/config/faq", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: next }),
    });
    if (!res.ok) alert("儲存失敗（資料庫）");
  }

  const handleDelete = async (id: string, question: string) => {
    if (!window.confirm(`確定要刪除「${question}」嗎？`)) return;
    const next = items.filter((i) => i.id !== id);
    await persist(next);
    if (editingId === id) setEditingId(null);
  };

  const handleSaveEdit = async (item: FaqItem) => {
    const next = items.map((i) => (i.id === item.id ? item : i));
    await persist(next);
    setEditingId(null);
  };

  const handleAdd = () => {
    setNewItem({
      id: `faq-${Date.now()}`,
      categoryId: "enrollment",
      categoryName: "報名相關",
      question: "",
      answer: "",
    });
  };

  const handleSaveNew = async (item: FaqItem) => {
    const next = [...items, item];
    await persist(next);
    setNewItem(null);
  };

  const catMap = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
        <input
          type="search"
          placeholder="搜尋問題或回答..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="min-w-[200px] max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">全部分類</option>
          {FAQ_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            setKeyword("");
            setCategoryFilter("");
          }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          清除篩選
        </button>
        <button
          type="button"
          onClick={handleAdd}
          className="ml-auto rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          新增 FAQ
        </button>
      </div>

      {newItem && (
        <AdminCard title="新增 FAQ">
          <FaqItemForm
            item={newItem as FaqItem}
            categories={FAQ_CATEGORIES}
            onSave={handleSaveNew}
            onCancel={() => setNewItem(null)}
          />
        </AdminCard>
      )}

      <AdminCard>
        {filtered.length > 0 ? (
          <AdminTable>
            <AdminTableHead>
              <AdminTableHeaderCell>分類</AdminTableHeaderCell>
              <AdminTableHeaderCell>問題</AdminTableHeaderCell>
              <AdminTableHeaderCell>回答</AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-right">操作</AdminTableHeaderCell>
            </AdminTableHead>
            <AdminTableBody>
              {filtered.map((item) =>
                editingId === item.id ? (
                  <AdminTableRow key={item.id}>
                    <AdminTableCell colSpan={4} className="bg-slate-50">
                      <FaqItemForm
                        item={item}
                        categories={FAQ_CATEGORIES}
                        onSave={handleSaveEdit}
                        onCancel={() => setEditingId(null)}
                      />
                    </AdminTableCell>
                  </AdminTableRow>
                ) : (
                  <AdminTableRow key={item.id}>
                    <AdminTableCell>
                      {catMap.get(item.categoryId) ?? item.categoryName ?? item.categoryId}
                    </AdminTableCell>
                    <AdminTableCell className="max-w-[200px]">
                      <span className="line-clamp-2">{item.question}</span>
                    </AdminTableCell>
                    <AdminTableCell className="max-w-[300px]">
                      <span className="line-clamp-2">{item.answer}</span>
                    </AdminTableCell>
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
                        onClick={() => handleDelete(item.id, item.question)}
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
            尚無符合條件的 FAQ
            {items.length === 0 ? "，點擊「新增 FAQ」開始新增" : "，請調整篩選條件"}
          </p>
        )}
        {filtered.length > 0 && (
          <p className="mt-4 text-sm text-slate-500">共 {filtered.length} 筆</p>
        )}
      </AdminCard>
    </div>
  );
}

function FaqItemForm({
  item,
  categories,
  onSave,
  onCancel,
}: {
  item: FaqItem;
  categories: { id: string; name: string }[];
  onSave: (item: FaqItem) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(item);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question.trim()) {
      alert("請填寫問題");
      return;
    }
    onSave({ ...form });
    alert("儲存成功");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">分類</label>
        <select
          value={form.categoryId}
          onChange={(e) => {
            const cat = categories.find((c) => c.id === e.target.value);
            setForm((prev) => ({
              ...prev,
              categoryId: e.target.value,
              categoryName: cat?.name ?? prev.categoryName,
            }));
          }}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">問題 *</label>
        <input
          type="text"
          value={form.question}
          onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">回答</label>
        <textarea
          value={form.answer}
          onChange={(e) => setForm((prev) => ({ ...prev, answer: e.target.value }))}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
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
