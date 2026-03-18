import faqData from "@/data/faq.json";
import { getAppConfig, resetAppConfig, setAppConfig } from "@/lib/config-store";

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

export const FAQ_FALLBACK_ITEMS: FaqItem[] = Array.isArray(faqData)
  ? (faqData as FaqItem[])
  : ((faqData as { items: FaqItem[] }).items ?? []);
const KEY = "faq";

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

export async function getFaqCategories(): Promise<FaqCategory[]> {
  return deriveCategories(await getFaqItems());
}

export async function getFaqItems(): Promise<FaqItem[]> {
  const items = await getAppConfig<FaqItem[]>(KEY, FAQ_FALLBACK_ITEMS);
  return items
    .map((item, idx) => ({ ...item, order: item.order ?? idx }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getFaqItemsByCategory(categoryId: string): Promise<FaqItem[]> {
  return (await getFaqItems()).filter((i) => i.categoryId === categoryId);
}

export async function setFaqItems(items: FaqItem[]): Promise<void> {
  await setAppConfig(KEY, items);
}

export async function resetFaqDefault(): Promise<void> {
  await resetAppConfig(KEY);
}
