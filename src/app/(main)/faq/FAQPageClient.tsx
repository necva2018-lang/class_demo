"use client";

import { useState } from "react";
import { CTAButton } from "@/components/shared";
import { FAQItem } from "@/components/shared";
import type { FaqItem, FaqCategory } from "@/lib/data/faq";

interface FAQPageClientProps {
  items: FaqItem[];
  categories: FaqCategory[];
  contactPhone: string;
}

export function FAQPageClient({
  items: initialItems,
  categories: dataCategories,
  contactPhone,
}: FAQPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const categories = [
    { id: "all", name: "全部" },
    ...dataCategories,
  ];
  const items = initialItems.filter(
    (item) => activeCategory === "all" || item.categoryId === activeCategory
  );
  const telHref = contactPhone.replace(/-/g, "");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          常見問題
        </h1>
        <p className="mt-4 text-slate-600">
          關於報名、補助資格、課程的常見疑問，為您一次解答
        </p>
      </header>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <FAQItem
            key={item.id}
            question={item.question}
            answer={item.answer}
            defaultOpen={i === 0}
          />
        ))}
      </div>

      <section className="mt-12 rounded-xl border border-slate-200 bg-indigo-50 p-6 text-center">
        <p className="font-medium text-slate-700">找不到想了解的答案？</p>
        <p className="mt-1 text-sm text-slate-600">
          歡迎來電 {contactPhone} 或至課程頁填寫諮詢表單
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <a
            href={`tel:${telHref}`}
            className="inline-flex items-center justify-center rounded-lg border-2 border-slate-300 px-6 py-3 font-medium text-slate-700 hover:border-indigo-300 hover:bg-white"
          >
            撥打諮詢專線
          </a>
          <CTAButton href="/courses" variant="primary">
            瀏覽課程
          </CTAButton>
        </div>
      </section>
    </div>
  );
}
