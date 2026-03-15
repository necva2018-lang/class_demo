"use client";

import { useState, useEffect } from "react";
import type { HomePageConfig } from "@/types/home";
import {
  getHomeConfig,
  setHomeConfigLocal,
  resetHomeConfigDefault,
} from "@/lib/data/home";
import { AdminHomeForm, AdminResetButton } from "@/components/admin";

export function AdminHomePageClient() {
  const [config, setConfig] = useState<HomePageConfig | null>(null);

  useEffect(() => {
    setConfig(getHomeConfig());
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
          onReset={() => {
            resetHomeConfigDefault();
            setConfig(getHomeConfig());
          }}
        />
      </div>
      <AdminHomeForm
        initialData={config}
        onSave={(c) => {
          setHomeConfigLocal(c);
          setConfig(c);
          alert("儲存成功");
        }}
      />
    </div>
  );
}
