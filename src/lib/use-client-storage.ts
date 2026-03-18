"use client";

import { useState, useEffect } from "react";

/**
 * Hydration-safe hook for reading localStorage-backed data.
 * Returns data only after client mount to avoid SSR/client mismatch.
 *
 * 若 client component 需直接讀取 createStorageStore 的資料，
 * 使用此 hook 可避免 hydration mismatch（SSR 用 JSON、client 用 localStorage 時資料不同）。
 */
export function useClientStorage<T>(getter: () => T): {
  data: T;
  isReady: boolean;
} {
  const [state, setState] = useState<{ data: T; isReady: boolean }>({
    data: getter(),
    isReady: false,
  });

  useEffect(() => {
    setState({ data: getter(), isReady: true });
  }, [getter]);

  return state;
}
