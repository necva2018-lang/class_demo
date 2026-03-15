import type { Metadata } from "next";
import { getFeaturedCourses, getCategories } from "@/lib/data/courses";
import { createMetadata, SEO_CONFIG } from "@/lib/seo";
import { CourseCard } from "@/components/course";
import {
  SectionTitle,
  CategoryCard,
  CTAButton,
  EmptyState,
} from "@/components/shared";

export const metadata: Metadata = createMetadata({
  title: SEO_CONFIG.defaultTitle,
  description: SEO_CONFIG.defaultDescription,
  path: "/",
});

export default function HomePage() {
  const featuredCourses = getFeaturedCourses();
  const categories = getCategories();
  const governmentCats = categories.filter((c) => c.parent === "government");
  const paidCats = categories.filter((c) => c.parent === "paid");

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 px-4 py-16 text-white sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            找到適合的職訓課程
            <br />
            <span className="text-indigo-400">開啟職涯新篇章</span>
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            政府補助與自費課程一次彙整，協助待業者、轉職者、在職進修者提升技能，順利就業
          </p>
          <CTAButton
            href="/courses"
            variant="white"
            size="lg"
            className="mt-8"
          >
            立即找課程
          </CTAButton>
        </div>
      </section>

      {/* Quick Entry - Course Categories */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionTitle
          title="選擇課程類型"
          subtitle="政府補助課程多數可免費參訓，自費課程彈性多元"
          align="center"
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <CategoryCard
            title="政府補助課程"
            description="職前訓練、在職訓練、專班課程，符合資格可享補助"
            href="/courses?category=job-preparation"
            tags={governmentCats.map((c) => c.name)}
          />
          <CategoryCard
            title="自費課程"
            description="證照課程、推廣課程，彈性進修、自主學習"
            href="/courses?category=certification"
            tags={paidCats.map((c) => c.name)}
          />
        </div>
      </section>

      {/* Featured Courses */}
      <section className="bg-slate-50 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            title="熱門推薦課程"
            subtitle="精選熱門課程，立即了解並報名"
          />
          {featuredCourses.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <EmptyState
              description="目前沒有精選課程"
              action={{ href: "/courses", label: "瀏覽全部課程" }}
              className="mt-8"
            />
          )}
          <div className="mt-8 text-center">
            <CTAButton href="/courses" variant="outline">
              瀏覽全部課程
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">500+</p>
              <p className="mt-1 text-sm text-slate-600">結訓學員</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">85%</p>
              <p className="mt-1 text-sm text-slate-600">就業率</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">50+</p>
              <p className="mt-1 text-sm text-slate-600">合作企業</p>
            </div>
            <div className="col-span-2 text-center md:col-span-1">
              <p className="text-3xl font-bold text-indigo-600">100+</p>
              <p className="mt-1 text-sm text-slate-600">開設課程</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 px-4 py-12 text-white sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold">準備好開始學習了嗎？</h2>
          <p className="mt-2 text-indigo-100">
            立即瀏覽課程、了解補助資格，找到最適合您的培訓方案
          </p>
          <CTAButton
            href="/courses"
            variant="white"
            size="lg"
            className="mt-6"
          >
            立即找課程
          </CTAButton>
        </div>
      </section>
    </div>
  );
}
