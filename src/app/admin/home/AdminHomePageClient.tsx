"use client";

import { useState, useEffect } from "react";
import type { HomePageConfig } from "@/types/home";
// legacy (localStorage) removed: now use API
import { AdminHomeForm, AdminResetButton } from "@/components/admin";

export function AdminHomePageClient() {
  const [config, setConfig] = useState<HomePageConfig | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch("/api/config/home", { cache: "no-store" });
      const json = (await res.json()) as { value: HomePageConfig | null };
      if (cancelled) return;
      if (json.value) setConfig(json.value);
      else {
        // fallback to existing default via server-rendered JSON module
        const fallback = await (await import("@/data/home-config.json")).default;
        setConfig(fallback as HomePageConfig);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!config) {
    return (
      <div className="mx-auto max-w-4xl py-12 text-center text-slate-500">
        載入中...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900">首頁內容管理</h2>
        <AdminResetButton
          onReset={async () => {
            await fetch("/api/config/home", { method: "DELETE" });
            const fallback = await (await import("@/data/home-config.json")).default;
            setConfig(fallback as HomePageConfig);
          }}
        />
      </div>
      <AdminHomeForm
        initialData={config}
        onSave={async (c) => {
          const res = await fetch("/api/config/home", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: c }),
          });
          if (!res.ok) {
            alert("儲存失敗");
            return;
          }
          setConfig(c);
          alert("儲存成功");
        }}
      />
    </div>
  );
}
