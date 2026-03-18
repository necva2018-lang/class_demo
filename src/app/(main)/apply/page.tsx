import type { Metadata } from "next";
import { Suspense } from "react";
import { createMetadata } from "@/lib/seo";
import { ApplyPageClient } from "./ApplyPageClient";

export const metadata: Metadata = createMetadata({
  title: "線上報名",
  description:
    "填寫課程報名表單，我們將於 2 個工作天內與您聯絡。政府補助課程請備妥相關證明文件。",
  path: "/apply",
});

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl px-4 py-12 text-slate-500">載入中...</div>}>
      <ApplyPageClient />
    </Suspense>
  );
}
