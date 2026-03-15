import casesData from "@/data/cases.json";

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

export function getCases(): CaseStudy[] {
  return (casesData as CaseStudy[]).sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getCaseById(id: string): CaseStudy | undefined {
  return (casesData as CaseStudy[]).find((c) => c.id === id || c.slug === id);
}
