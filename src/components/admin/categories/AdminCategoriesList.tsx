"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Category } from "@/types";
import { AdminCard, AdminTable, AdminTableHead, AdminTableHeaderCell, AdminTableBody, AdminTableRow, AdminTableCell } from "@/components/admin";

const PARENT_LABELS: Record<string, string> = {
  government: "政府補助課程",
  paid: "自費課程",
};

interface AdminCategoriesListProps {
  categories: Category[];
}

export function AdminCategoriesList({ categories: initialCategories }: AdminCategoriesListProps) {
  const [keyword, setKeyword] = useState("");
  const [parent, setParent] = useState<string>("");
  const [categories, setCategories] = useState(initialCategories);

  const filtered = useMemo(() => {
    return categories.filter((c) => {
      if (keyword) {
        const k = keyword.toLowerCase();
        if (!c.name.toLowerCase().includes(k) && !(c.description ?? "").toLowerCase().includes(k))
          return false;
      }
      if (parent && c.parent !== parent) return false;
      return true;
    });
  }, [categories, keyword, parent]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`確定要刪除「${name}」嗎？此操作在 mock 階段僅從列表移除。`)) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
        <input
          type="search"
          placeholder="搜尋分類名稱..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full min-w-[200px] max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={parent}
          onChange={(e) => setParent(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">全部主分類</option>
          <option value="government">{PARENT_LABELS.government}</option>
          <option value="paid">{PARENT_LABELS.paid}</option>
        </select>
        <button
          type="button"
          onClick={() => { setKeyword(""); setParent(""); }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          清除篩選
        </button>
      </div>

      <AdminCard>
        {filtered.length > 0 ? (
          <AdminTable>
            <AdminTableHead>
              <AdminTableHeaderCell>名稱</AdminTableHeaderCell>
              <AdminTableHeaderCell>主分類</AdminTableHeaderCell>
              <AdminTableHeaderCell>順序</AdminTableHeaderCell>
              <AdminTableHeaderCell>描述</AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-right">操作</AdminTableHeaderCell>
            </AdminTableHead>
            <AdminTableBody>
              {filtered.map((cat) => (
                <AdminTableRow key={cat.id}>
                  <AdminTableCell className="font-medium">{cat.name}</AdminTableCell>
                  <AdminTableCell>{PARENT_LABELS[cat.parent] ?? cat.parent}</AdminTableCell>
                  <AdminTableCell>{cat.order}</AdminTableCell>
                  <AdminTableCell className="max-w-xs truncate">{cat.description ?? "—"}</AdminTableCell>
                  <AdminTableCell className="text-right">
                    <Link href={`/admin/categories?edit=${cat.id}`} className="text-primary-600 hover:underline">
                      編輯
                    </Link>
                    <span className="mx-2 text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="text-red-600 hover:underline"
                    >
                      刪除
                    </button>
                  </AdminTableCell>
                </AdminTableRow>
              ))}
            </AdminTableBody>
          </AdminTable>
        ) : (
          <p className="py-12 text-center text-slate-500">尚無符合條件的分類</p>
        )}
        {filtered.length > 0 && <p className="mt-4 text-sm text-slate-500">共 {filtered.length} 筆</p>}
      </AdminCard>
    </div>
  );
}
