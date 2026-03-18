import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { getAboutConfig } from "@/lib/data/about";
import { getSiteSettings } from "@/lib/data/settings";
import { SectionTitle, CTAButton } from "@/components/shared";

export const metadata: Metadata = createMetadata({
  title: "關於我們",
  description: getAboutConfig().intro,
  path: "/about",
});

const FEATURE_ICONS = ["📋", "💰", "📝", "📞"];

export default async function AboutPage() {
  const about = getAboutConfig();
  const settings = await getSiteSettings();
  const contact = about.contact ?? settings.contact;

  const features = about.coreFeatures.map((text, idx) => {
    const [title, desc] = text.includes("：") ? text.split("：") : [text, ""];
    return { title, desc, icon: FEATURE_ICONS[idx] ?? "📌" };
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Hero */}
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          關於我們
        </h1>
        <p className="mt-4 text-lg text-slate-600">{about.associationName}</p>
      </header>

      {/* 機構介紹 */}
      <section className="mb-12">
        <SectionTitle
          title="我們的使命"
          subtitle="讓職訓資訊更透明、報名更簡單"
        />
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="leading-relaxed text-slate-700">{about.intro}</p>
          <p className="mt-4 leading-relaxed text-slate-700">{about.mission}</p>
        </div>
      </section>

      {/* 服務特色 */}
      {features.length > 0 && (
        <section className="mb-12">
          <SectionTitle title="服務特色" />
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {features.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="text-2xl" aria-hidden>
                  {item.icon}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 聯絡資訊 */}
      <section className="mb-12 rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <SectionTitle title="聯絡我們" />
        <dl className="mt-6 space-y-4">
          <div>
            <dt className="text-sm font-medium text-slate-500">客服專線</dt>
            <dd className="mt-1 text-slate-900">{contact.phone}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">服務時間</dt>
            <dd className="mt-1 text-slate-900">
              {contact.serviceHours ?? "週一至週五 09:00-18:00"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Email</dt>
            <dd className="mt-1 text-slate-900">{contact.email}</dd>
          </div>
        </dl>
      </section>

      {/* CTA */}
      <section className="text-center">
        <p className="text-slate-600">準備好開始學習了嗎？</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <CTAButton
            href={about.cta?.href ?? "/courses"}
            variant="primary"
            size="lg"
          >
            {about.cta?.text ?? "瀏覽課程"}
          </CTAButton>
          <CTAButton href="/apply" variant="outline" size="lg">
            線上報名
          </CTAButton>
        </div>
      </section>
    </div>
  );
}
