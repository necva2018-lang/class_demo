import type { Metadata } from "next";
import {
  getFeaturedCourses,
  getCategories,
} from "@/lib/data/courses";
import { getHomeConfig } from "@/lib/data/home";
import { createMetadata, getEffectiveSeoConfig } from "@/lib/seo";
import { CourseCard } from "@/components/course";
import {
  SectionTitle,
  CategoryCard,
  CTAButton,
  EmptyState,
} from "@/components/shared";

export const metadata: Metadata = createMetadata({
  title: getEffectiveSeoConfig().defaultTitle,
  description: getEffectiveSeoConfig().defaultDescription,
  path: "/",
});

export default function HomePage() {
  const home = getHomeConfig();
  const featured = getFeaturedCourses();
  const limit = home.featuredCourses?.limit ?? 6;
  const featuredCourses = featured.slice(0, limit);
  const categories = getCategories();
  const governmentCats = categories.filter((c) => c.parent === "government");
  const paidCats = categories.filter((c) => c.parent === "paid");

  const heroTitleParts = home.hero.title.split(" ");
  const heroLine1 = heroTitleParts[0] ?? home.hero.title;
  const heroLine2 = heroTitleParts.slice(1).join(" ") || null;

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 px-4 py-16 text-white sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {heroLine2 ? (
              <>
                {heroLine1}
                <br />
                <span className="text-indigo-400">{heroLine2}</span>
              </>
            ) : (
              heroLine1
            )}
          </h1>
          <p className="mt-4 text-lg text-slate-300">{home.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <CTAButton
              href={home.hero.primaryCta.href}
              variant="white"
              size="lg"
              className="mt-0"
            >
              {home.hero.primaryCta.label}
            </CTAButton>
            {home.hero.secondaryCta && (
              <CTAButton
                href={home.hero.secondaryCta.href}
                variant="outline"
                size="lg"
                className="mt-0 border-white/40 text-white hover:bg-white/10"
              >
                {home.hero.secondaryCta.label}
              </CTAButton>
            )}
          </div>
        </div>
      </section>

      {/* Quick Entry - Course Categories */}
      {home.categoryEntry && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <SectionTitle
            title="選擇課程類型"
            subtitle="政府補助課程多數可免費參訓，自費課程彈性多元"
            align="center"
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <CategoryCard
              title={home.categoryEntry.government.title}
              description={home.categoryEntry.government.description}
              href={home.categoryEntry.government.href}
              tags={governmentCats.map((c) => c.name)}
            />
            <CategoryCard
              title={home.categoryEntry.paid.title}
              description={home.categoryEntry.paid.description}
              href={home.categoryEntry.paid.href}
              tags={paidCats.map((c) => c.name)}
            />
          </div>
        </section>
      )}

      {/* Featured Courses */}
      <section className="bg-slate-50 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            title={home.featuredCourses?.title ?? "熱門推薦課程"}
            subtitle={home.featuredCourses?.subtitle ?? "精選熱門課程，立即了解並報名"}
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
          <h2 className="text-2xl font-bold">{home.cta.title}</h2>
          <p className="mt-2 text-indigo-100">{home.cta.subtitle}</p>
          <CTAButton
            href={home.cta.buttonHref}
            variant="white"
            size="lg"
            className="mt-6"
          >
            {home.cta.buttonLabel}
          </CTAButton>
        </div>
      </section>
    </div>
  );
}
