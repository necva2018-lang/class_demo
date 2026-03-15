export interface News {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  type: "announcement" | "course" | "event" | "other";
  publishedAt: string;
  createdAt?: string;
}
