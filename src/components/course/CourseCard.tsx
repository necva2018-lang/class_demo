import Link from "next/link";
import type { Course } from "@/types";
import { SUB_CATEGORY_LABELS } from "@/types/course";
import { CTAButton } from "@/components/shared";

interface CourseCardProps {
  course: Course;
}

/** 格式化費用顯示 */
function formatFee(fee: number, subsidy?: number | null): string {
  const f = fee ?? 0;
  const s = subsidy ?? 0;
  if (f === 0) return "政府補助";
  if (s > 0) return `NT$${(f - s).toLocaleString()} 起`;
  return `NT$${f.toLocaleString()}`;
}

export function CourseCard({ course }: CourseCardProps) {
  const targetAudienceText =
    course.targetAudience?.length > 0
      ? course.targetAudience.slice(0, 2).join("、")
      : null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md group-hover:border-indigo-200">
      <Link href={`/courses/${course.id}`} className="flex flex-1 flex-col">
        {/* Cover Image - placeholder */}
        <div className="aspect-[16/10] flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
          <span className="text-sm text-slate-500">課程圖片</span>
        </div>

        <div className="flex flex-1 flex-col p-4">
          {/* 課程類型標籤 */}
          <span className="mb-2 inline-flex w-fit rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
            {SUB_CATEGORY_LABELS[course.subCategory]}
          </span>

          <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-indigo-600">
            {course.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
            {course.summary}
          </p>

          {/* 課程資訊：地點、時數、適合對象 */}
          <ul className="mt-4 flex-1 space-y-1.5 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="shrink-0 font-medium text-slate-500">地點</span>
              <span>{course.location}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="shrink-0 font-medium text-slate-500">時數</span>
              <span>{course.hours} 小時</span>
            </li>
            {targetAudienceText && (
              <li className="flex items-start gap-2">
                <span className="shrink-0 font-medium text-slate-500">適合</span>
                <span>{targetAudienceText}</span>
              </li>
            )}
          </ul>

          {/* 費用 */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="font-semibold text-indigo-600">
              {formatFee(course.fee ?? 0, course.subsidy)}
            </span>
            <span className="text-xs text-slate-500">開課 {course.startDate}</span>
          </div>
        </div>
      </Link>

      {/* CTA 區塊：獨立於 Link 外，避免巢狀 */}
      <div className="border-t border-slate-100 p-4 pt-0">
        <CTAButton
          href={course.applyUrl || `/courses/${course.id}`}
          variant="primary"
          size="sm"
          fullWidth
        >
          查看詳情並報名
        </CTAButton>
      </div>
    </article>
  );
}
