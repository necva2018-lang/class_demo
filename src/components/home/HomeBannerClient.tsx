"use client";

import { useEffect, useState } from "react";
import type { HomePageConfig } from "@/types/home";
import type { Banner } from "@/types/banner";
import { CTAButton } from "@/components/shared";
import { withBasePath } from "@/lib/routes";

interface HomeBannerClientProps {
  home: HomePageConfig;
}

export function HomeBannerClient({ home }: HomeBannerClientProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(withBasePath("/api/banners"), { cache: "no-store" });
        if (!res.ok) return;
        const all = (await res.json()) as any[];
        const active = all.filter((b) => Boolean(b.active));
        if (cancelled) return;
        setBanners(
          active.map((b) => ({
            id: String(b.id),
            title: String(b.title ?? ""),
            subtitle: String(b.subtitle ?? ""),
            backgroundImage: String(b.backgroundImage ?? ""),
            primaryCta: {
              label: String(b.primaryCtaLabel ?? "立即找課程"),
              href: String(b.primaryCtaHref ?? "/courses"),
            },
            secondaryCta:
              b.secondaryCtaLabel && b.secondaryCtaHref
                ? {
                    label: String(b.secondaryCtaLabel),
                    href: String(b.secondaryCtaHref),
                  }
                : undefined,
            order: Number(b.order ?? 0),
            active: Boolean(b.active),
            isDefault: Boolean(b.isDefault),
          }))
        );
        setCurrentIndex(0);
      } catch {
        // ignore
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const current = banners[currentIndex] ?? null;

  const heroTitleParts = home.hero.title.split(" ");
  const heroLine1 = heroTitleParts[0] ?? home.hero.title;
  const heroLine2 = heroTitleParts.slice(1).join(" ") || null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 px-4 py-16 text-white sm:px-6 sm:py-24">
      {current?.backgroundImage && (
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url(${current.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      <div className="relative mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {current?.title ||
            (heroLine2 ? (
              <>
                {heroLine1}
                <br />
                <span className="text-indigo-400">{heroLine2}</span>
              </>
            ) : (
              heroLine1
            ))}
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          {current?.subtitle || home.hero.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <CTAButton
            href={current?.primaryCta.href ?? home.hero.primaryCta.href}
            variant="white"
            size="lg"
            className="mt-0"
          >
            {current?.primaryCta.label ?? home.hero.primaryCta.label}
          </CTAButton>
          {(current?.secondaryCta || home.hero.secondaryCta) && (
            <CTAButton
              href={
                current?.secondaryCta?.href ??
                home.hero.secondaryCta?.href ??
                "#"
              }
              variant="outline"
              size="lg"
              className="mt-0 border-white/40 text-white hover:bg-white/10"
            >
              {current?.secondaryCta?.label ??
                home.hero.secondaryCta?.label ??
                ""}
            </CTAButton>
          )}
        </div>
        {banners.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === 0 ? banners.length - 1 : prev - 1
                )
              }
              className="rounded-full border border-white/30 px-3 py-1 text-sm text-white hover:bg-white/10"
            >
              上一則
            </button>
            <div className="flex items-center gap-2">
              {banners.map((b, idx) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 w-2 rounded-full ${
                    idx === currentIndex
                      ? "bg-white"
                      : "bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`切換至第 ${idx + 1} 則 Banner`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % banners.length)
              }
              className="rounded-full border border-white/30 px-3 py-1 text-sm text-white hover:bg-white/10"
            >
              下一則
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
