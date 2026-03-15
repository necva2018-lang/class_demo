"use client";

import Link from "next/link";
import type { Course } from "@/types";

interface CourseDetailCTAProps {
  course: Course;
  /** 手機版緊湊樣式：只顯示按鈕 */
  variant?: "default" | "compact";
}

function formatFee(fee: number, subsidy?: number | null): string {
  if (fee === 0) return "政府全額補助";
  if (subsidy && subsidy > 0)
    return `NT$${(fee - subsidy).toLocaleString()} 起`;
  return `NT$${fee.toLocaleString()}`;
}

export function CourseDetailCTA({
  course,
  variant = "default",
}: CourseDetailCTAProps) {
  const spotsLeft = course.quota - (course.enrolled ?? 0);

  if (variant === "compact") {
    return (
      <div className="flex gap-3">
        <Link
          href={course.applyUrl || `/apply?courseId=${course.id}`}
          className="flex-1 rounded-xl bg-indigo-600 py-3.5 text-center font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          立即報名
        </Link>
        <a
          href="tel:0800000000"
          className="flex shrink-0 rounded-xl border-2 border-slate-300 px-4 py-3 font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:bg-slate-50"
          aria-label="課程諮詢"
        >
          <svg
            className="inline-block h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
      <div className="mb-4">
        <p className="text-2xl font-bold text-indigo-600">
          {formatFee(course.fee ?? 0, course.subsidy)}
        </p>
        {course.subsidyNote && (
          <p className="mt-1 text-sm text-slate-600">{course.subsidyNote}</p>
        )}
      </div>

      <div className="space-y-3 border-t border-slate-100 pt-4 text-sm text-slate-700">
        <div className="flex justify-between">
          <span className="text-slate-500">開課日期</span>
          <span className="font-medium">{course.startDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">上課時段</span>
          <span className="font-medium">{course.schedule ?? "依課程公告"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">上課地點</span>
          <span className="font-medium">{course.location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">剩餘名額</span>
          <span className="font-medium">
            {spotsLeft} 人
            {spotsLeft <= 5 && spotsLeft > 0 && (
              <span className="ml-1 text-amber-600">即將額滿</span>
            )}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Link
          href={course.applyUrl || `/apply?courseId=${course.id}`}
          className="block w-full rounded-xl bg-indigo-600 py-3.5 text-center font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          立即報名
        </Link>
        <a
          href="tel:0800000000"
          className="block w-full rounded-xl border-2 border-slate-300 py-3 text-center font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:bg-slate-50"
        >
          課程諮詢
        </a>
      </div>
    </div>
  );
}
