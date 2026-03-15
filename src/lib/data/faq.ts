import faqData from "@/data/faq.json";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  order: number;
}

export interface FaqCategory {
  id: string;
  name: string;
  order: number;
}

const faq = faqData as {
  categories: FaqCategory[];
  items: FaqItem[];
};

export function getFaqCategories(): FaqCategory[] {
  return faq.categories.sort((a, b) => a.order - b.order);
}

export function getFaqItems(): FaqItem[] {
  return faq.items.sort((a, b) => a.order - b.order);
}

export function getFaqItemsByCategory(categoryId: string): FaqItem[] {
  return getFaqItems().filter((i) => i.categoryId === categoryId);
}
