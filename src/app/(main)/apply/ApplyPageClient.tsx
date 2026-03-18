"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function ApplyPageClient() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") ?? undefined;

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
