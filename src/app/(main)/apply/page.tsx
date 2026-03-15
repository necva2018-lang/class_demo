import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";

interface ApplyPageProps {
  searchParams: Promise<{ courseId?: string }>;
}

export const metadata: Metadata = createMetadata({
  title: "線上報名",
  description:
    "填寫課程報名表單，我們將於 2 個工作天內與您聯絡。政府補助課程請備妥相關證明文件。",
  path: "/apply",
});

export default async function ApplyPage({ searchParams }: ApplyPageProps) {
  const params = await searchParams;
  const courseId = params.courseId;

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">線上報名</h1>
      <p className="mt-2 text-slate-600">
        {courseId
          ? "您選擇的課程報名表單將於此顯示"
          : "請先選擇要報名的課程"}
      </p>
      {!courseId && (
        <Link
          href="/courses"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-500"
        >
          前往選擇課程
        </Link>
      )}
      {courseId && (
        <p className="mt-6 text-sm text-slate-500">
          報名表單功能開發中，課程 ID：{courseId}
        </p>
      )}
    </div>
  );
}
