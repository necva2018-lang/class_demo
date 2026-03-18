import type { Metadata } from "next";
import { getCases } from "@/lib/data/cases";
import { PageHero } from "@/components/shared/PageHero";
import { CasesPageClient } from "./CasesPageClient";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "成果案例",
  description: "學員成果與就業案例",
  path: "/cases",
});

export default async function CasesPage() {
  const cases = await getCases();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <PageHero
        title="成果案例"
        description="瀏覽學員就業、創業與證照成果，了解職訓課程實際成效"
      />
      <CasesPageClient cases={cases} />
    </div>
  );
}
