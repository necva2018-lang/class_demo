"use client";

import { useState, useMemo } from "react";
import type { CaseStudy, CaseCategory } from "@/lib/data/cases";
import { CaseCard } from "@/components/shared/CaseCard";
import { FilterTabs } from "@/components/shared/FilterTabs";
import { EmptyState } from "@/components/shared/EmptyState";

const CASE_CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: "employment", label: "就業案例" },
  { value: "entrepreneurship", label: "創業案例" },
  { value: "testimonial", label: "學員心得" },
  { value: "portfolio", label: "作品展示" },
  { value: "other", label: "其他" },
];

interface CasesPageClientProps {
  cases: CaseStudy[];
}

export function CasesPageClient({ cases }: CasesPageClientProps) {
  const [category, setCategory] = useState<string>("");

  const filteredCases = useMemo(() => {
    if (!category) return cases;
    return cases.filter((c) => (c.category as CaseCategory) === category);
  }, [cases, category]);

  return (
    <>
      <FilterTabs
        options={CASE_CATEGORY_OPTIONS}
        value={category}
        onChange={setCategory}
        allLabel="全部"
        className="mb-6"
      />
      <div className="mt-4">
        <p className="mb-4 text-sm text-slate-600">
          共 {filteredCases.length} 則案例
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCases.length > 0 ? (
            filteredCases.map((c) => (
              <CaseCard key={c.id} caseItem={c} />
            ))
          ) : (
            <EmptyState
              description={
                category
                  ? "此分類暫無案例，請試試其他分類"
                  : "目前沒有成果案例"
              }
              action={
                category ? { href: "/cases", label: "檢視全部" } : undefined
              }
              className="col-span-full"
            />
          )}
        </div>
      </div>
    </>
  );
}
