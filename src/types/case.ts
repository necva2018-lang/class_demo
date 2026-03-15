export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  courseName?: string;
  year?: number;
  metrics?: { label: string; value: string | number }[];
  publishedAt: string;
}
