/**
 * FAQ 資料取得層
 * 供前台與後台共用，支援 localStorage 持久化
 */

import faqData from "@/data/faq.json";
import { createStorageStore } from "@/lib/admin-storage";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  categoryName?: string;
  order?: number;
}

export interface FaqCategory {
  id: string;
  name: string;
  order: number;
}

const defaultItems: FaqItem[] = Array.isArray(faqData)
  ? (faqData as FaqItem[])
  : ((faqData as { items: FaqItem[] }).items ?? []);

const store = createStorageStore<FaqItem[]>("faq", defaultItems);

function deriveCategories(items: FaqItem[]): FaqCategory[] {
  const categoryMap = new Map<string, FaqCategory>();
  items.forEach((item) => {
    if (item.categoryId && !categoryMap.has(item.categoryId)) {
      categoryMap.set(item.categoryId, {
        id: item.categoryId,
        name: (item as { categoryName?: string }).categoryName ?? item.categoryId,
        order: categoryMap.size,
      });
    }
  });
  return Array.from(categoryMap.values()).sort((a, b) => a.order - b.order);
}

export function getFaqCategories(): FaqCategory[] {
  return deriveCategories(getFaqItems());
}

export function getFaqItems(): FaqItem[] {
  return store
    .get()
    .map((item, idx) => ({ ...item, order: item.order ?? idx }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getFaqItemsByCategory(categoryId: string): FaqItem[] {
  return getFaqItems().filter((i) => i.categoryId === categoryId);
}

/** 後台 mock 儲存用，同步寫入 localStorage */
export function setFaqItemsLocal(items: FaqItem[]): void {
  store.set(items);
}

/** 還原為預設值 */
export function resetFaqDefault(): void {
  store.reset();
}
