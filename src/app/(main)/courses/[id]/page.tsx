import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourseById, getCoursesByCategory } from "@/lib/data/courses";
import { CourseDetailCTA } from "@/components/course/CourseDetailCTA";
import { CourseDetailFAQ } from "@/components/course/CourseDetailFAQ";
import { createMetadata, createCourseDescription } from "@/lib/seo";
import type { Course } from "@/types";
import { SUB_CATEGORY_LABELS } from "@/types/course";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  const { getCourses } = require("@/lib/data/courses");
  return getCourses().map((c: { id: string }) => ({ id: c.id }));
}

const DEFAULT_FAQ = [
  {
    question: "如何報名此課程？",
    answer:
      "請點選「立即報名」填寫表單，我們將於 2 個工作天內與您聯絡，確認資格與開課事宜。",
  },
  {
    question: "政府補助資格如何認定？",
    answer:
      "職前訓練一般適用待業者；在職訓練適用於在職勞工。報名時我們會協助您檢視資格，必要時提供證明文件指引。",
  },
  {
    question: "可以試聽或退費嗎？",
    answer:
      "開課前可預約諮詢了解課程內容。退費辦法依各課程規定，報名時將於確認信中說明。",
  },
  {
    question: "上課地點與交通資訊？",
    answer:
      "各課程開課地點不同，報名成功後將提供詳細地址與交通方式。部分課程支援線上授課。",
  },
];

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const course = getCourseById(id);
  if (!course) return { title: "課程不存在" };
  return createMetadata({
    title: course.title,
    description: createCourseDescription({
      summary: course.summary,
      location: course.location,
      hours: course.hours,
      startDate: course.startDate,
      subCategory: course.subCategory,
    }),
    path: `/courses/${id}`,
    type: "article",
  });
}

function formatFee(fee: number, subsidy?: number | null): string {
  if (fee === 0) return "政府全額補助";
  if (subsidy && subsidy > 0)
    return `補助後 NT$${(fee - subsidy).toLocaleString()} 起`;
  return `NT$${fee.toLocaleString()}`;
}

/** 課程特色：優先使用 features，否則從 outline 衍生 */
function getHighlights(course: Course): string[] {
  if (course.features && course.features.length > 0) {
    return course.features;
  }
  return (
    course.outline?.map((o) => `${o.title}：${o.content}`) ?? [
      "實務導向教學",
      "業界講師授課",
      "結訓可取得證書",
    ]
  );
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { id } = await params;
  const course = getCourseById(id);
  if (!course) notFound();

  const relatedCourses = getCoursesByCategory(course.subCategory)
    .filter((c) => c.id !== course.id)
    .slice(0, 3);

  const highlights = getHighlights(course);
  const faqItems = course.faq && course.faq.length > 0 ? course.faq : DEFAULT_FAQ;
  const remainingSlots = Math.max(0, course.quota - (course.enrolled ?? 0));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-700">
          首頁
        </Link>
        <span className="mx-2">/</span>
        <Link href="/courses" className="hover:text-slate-700">
          課程總覽
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{course.title}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-10">
        {/* 主內容區 */}
        <article>
          {/* 1. 課程名稱與關鍵資訊摘要 */}
          <header className="mb-10">
            <div className="flex flex-wrap gap-2">
              {course.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700"
                >
                  {tag}
                </span>
              ))}
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                {SUB_CATEGORY_LABELS[course.subCategory]}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
              {course.title}
            </h1>
            <p className="mt-4 text-lg text-slate-600">{course.summary}</p>

            <div className="mt-6 flex flex-wrap gap-4 rounded-xl bg-slate-50 p-4 sm:gap-6 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-medium text-slate-500">開課日期</p>
                  <p className="font-semibold text-slate-900">{course.startDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-medium text-slate-500">總時數</p>
                  <p className="font-semibold text-slate-900">{course.hours} 小時</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-medium text-slate-500">上課地點</p>
                  <p className="font-semibold text-slate-900">{course.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-medium text-slate-500">費用</p>
                  <p className="font-semibold text-indigo-600">
                    {formatFee(course.fee ?? 0, course.subsidy)}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* 封面 / 學員成果預留 */}
          <section className="mb-10">
            <div className="aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300">
              <div className="flex h-full items-center justify-center text-slate-500">
                <span>課程封面 / 學員成果圖片</span>
              </div>
            </div>
          </section>

          {/* 2. 課程簡介 */}
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
              課程簡介
            </h2>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="whitespace-pre-wrap leading-relaxed text-slate-700">
                {course.description}
              </p>
            </div>
          </section>

          {/* 3. 適合對象 */}
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
              適合對象
            </h2>
            <div className="flex flex-wrap gap-3">
              {course.targetAudience?.length > 0 ? (
                course.targetAudience.map((audience) => (
                  <span
                    key={audience}
                    className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700"
                  >
                    {audience}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                  對本課程有興趣者均可報名
                </span>
              )}
            </div>
          </section>

          {/* 4. 課程特色 */}
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </span>
              課程特色
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                    {i + 1}
                  </span>
                  <p className="text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. 課程大綱 */}
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
              課程大綱
            </h2>
            <div className="space-y-3">
              {course.outline?.map((item) => (
                <div
                  key={item.unit}
                  className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                    {item.unit}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. 師資介紹 */}
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              師資介紹
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {course.instructors?.map((inst) => (
                <div
                  key={inst.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600">
                      {inst.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{inst.name}</h3>
                      <p className="text-sm font-medium text-indigo-600">{inst.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{inst.bio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 7. 學員成果 / 相關圖片預留區 */}
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              學員成果
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-slate-100 flex items-center justify-center text-sm text-slate-400"
                >
                  圖片預留
                </div>
              ))}
            </div>
          </section>

          {/* 8. 常見問題 */}
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              常見問題
            </h2>
            <CourseDetailFAQ items={faqItems} />
          </section>

          {/* 相關課程 */}
          {relatedCourses.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-xl font-bold text-slate-900">您可能也感興趣</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedCourses.map((c) => (
                  <Link
                    key={c.id}
                    href={`/courses/${c.id}`}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
                  >
                    <h3 className="font-semibold text-slate-900">{c.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{SUB_CATEGORY_LABELS[c.subCategory]}</p>
                    <p className="mt-2 text-sm font-medium text-indigo-600">查看詳情 →</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* 9. 右側固定 CTA（桌機） */}
        <aside className="relative">
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <CourseDetailCTA course={course} />
            </div>
          </div>
        </aside>
      </div>

      {/* 10. 手機版：底部固定 CTA 區塊 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] lg:hidden">
        <CourseDetailCTA course={course} variant="compact" />
      </div>

      {/* 手機版底部 CTA 佔位，避免內容被遮擋 */}
      <div className="h-24 lg:hidden" aria-hidden="true" />
    </div>
  );
}
