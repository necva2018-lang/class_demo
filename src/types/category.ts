export interface Category {
  id: string;
  slug: string;
  name: string;
  parent: "government" | "paid";
  description?: string;
  order: number;
}
