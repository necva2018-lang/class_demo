import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { SectionTitle, CTAButton } from "@/components/shared";

export const metadata: Metadata = createMetadata({
  title: "關於我們",
  description:
    "職訓課程招生網致力於協助待業者、轉職者、在職進修者找到適合的職業訓練課程，政府補助與自費課程一次彙整。",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Hero */}
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          關於我們
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          協助您找到適合的職訓課程，開啟職涯新篇章
        </p>
      </header>

      {/* 機構介紹 */}
      <section className="mb-12">
        <SectionTitle
          title="我們的使命"
          subtitle="讓職訓資訊更透明、報名更簡單"
        />
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="leading-relaxed text-slate-700">
            職訓課程招生網整合政府補助與自費職業訓練課程，提供待業者、轉職者、二度就業者、在職進修者與青年培訓對象，一個清晰、易用的課程查詢與報名平台。
          </p>
          <p className="mt-4 leading-relaxed text-slate-700">
            我們相信，每個人都值得透過適合的培訓提升技能、創造更好的職涯發展。我們致力於將複雜的補助資格與課程資訊化繁為簡，讓您快速找到符合需求的課程並完成報名。
          </p>
        </div>
      </section>

      {/* 服務特色 */}
      <section className="mb-12">
        <SectionTitle title="服務特色" />
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {[
            {
              title: "課程資訊彙整",
              desc: "政府補助與自費課程一次瀏覽，依分類快速篩選",
              icon: "📋",
            },
            {
              title: "補助資格說明",
              desc: "職前、在職、專班等補助條件清楚標示，降低報名疑慮",
              icon: "💰",
            },
            {
              title: "線上報名便利",
              desc: "一鍵進入報名流程，我們將於 2 個工作天內與您聯絡",
              icon: "📝",
            },
            {
              title: "專業諮詢服務",
              desc: "客服專線 0800-000-000，週一至週五 09:00-18:00",
              icon: "📞",
            },
          ].map((item) => (
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

      {/* 聯絡資訊 */}
      <section className="mb-12 rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <SectionTitle title="聯絡我們" />
        <dl className="mt-6 space-y-4">
          <div>
            <dt className="text-sm font-medium text-slate-500">客服專線</dt>
            <dd className="mt-1 text-slate-900">0800-000-000</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">服務時間</dt>
            <dd className="mt-1 text-slate-900">週一至週五 09:00-18:00</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Email</dt>
            <dd className="mt-1 text-slate-900">service@training.example.com</dd>
          </div>
        </dl>
      </section>

      {/* CTA */}
      <section className="text-center">
        <p className="text-slate-600">準備好開始學習了嗎？</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <CTAButton href="/courses" variant="primary" size="lg">
            瀏覽課程
          </CTAButton>
          <CTAButton href="/apply" variant="outline" size="lg">
            線上報名
          </CTAButton>
        </div>
      </section>
    </div>
  );
}
