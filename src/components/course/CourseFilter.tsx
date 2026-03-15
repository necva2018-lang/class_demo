"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import type { Category } from "@/types";

interface CourseFilterProps {
  categories: Category[];
  currentCategory?: string;
  keyword?: string;
  onKeywordChange?: (keyword: string) => void;
  /** 手機版：是否使用內嵌模式（篩選與搜尋整合在頁面中，不彈出） */
  embedded?: boolean;
}

const CATEGORY_ORDER = [
  "job-preparation",
  "in-service",
  "special-class",
  "certification",
  "promotion",
];

export function CourseFilter({
  categories,
  currentCategory,
  keyword = "",
  onKeywordChange,
  embedded = true,
}: CourseFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [localKeyword, setLocalKeyword] = useState(keyword);

  const sortedCategories = [...categories].sort(
    (a, b) =>
      CATEGORY_ORDER.indexOf(a.slug) - CATEGORY_ORDER.indexOf(b.slug)
  );

  const handleCategoryChange = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug === "all") {
        params.delete("category");
      } else {
        params.set("category", slug);
      }
      const query = params.toString();
      router.push(query ? `/courses?${query}` : "/courses");
      setMobileFilterOpen(false);
    },
    [router, searchParams]
  );

  const handleKeywordInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalKeyword(value);
      onKeywordChange?.(value);
    },
    [onKeywordChange]
  );

  const activeFilterCount = (currentCategory ? 1 : 0) + (localKeyword ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* 關鍵字搜尋 */}
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          type="search"
          placeholder="搜尋課程名稱、關鍵字..."
          value={localKeyword}
          onChange={handleKeywordInput}
          className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          aria-label="搜尋課程"
        />
      </div>

      {/* 手機版：篩選按鈕（可收合） */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700"
          aria-expanded={mobileFilterOpen}
        >
          <span>依分類篩選</span>
          <span className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">
                {activeFilterCount}
              </span>
            )}
            <svg
              className={`h-4 w-4 transition-transform ${mobileFilterOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </button>
        {mobileFilterOpen && (
          <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleCategoryChange("all")}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  !currentCategory
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-slate-700 shadow-sm hover:bg-slate-100"
                }`}
              >
                全部
              </button>
              {sortedCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    currentCategory === cat.slug
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-slate-700 shadow-sm hover:bg-slate-100"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 桌機版：分類篩選（直接顯示） */}
      <div className="hidden lg:block">
        <p className="mb-2 text-sm font-medium text-slate-700">課程分類</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleCategoryChange("all")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              !currentCategory
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            全部課程
          </button>
          {sortedCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.slug)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                currentCategory === cat.slug
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
