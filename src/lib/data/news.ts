import newsData from "@/data/news.json";

export interface News {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  type: string;
  publishedAt: string;
}

export function getNews(): News[] {
  return (newsData as News[]).sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getNewsById(id: string): News | undefined {
  return (newsData as News[]).find((n) => n.id === id || n.slug === id);
}

export function getLatestNews(limit = 5): News[] {
  return getNews().slice(0, limit);
}
