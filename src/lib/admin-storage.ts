/**
 * Admin mock data 的 localStorage 持久化工具
 * 供各資料模組共用，提供 get / set / reset
 */

const PREFIX = "admin:";

export interface StorageStore<T> {
  /** 取得資料（優先 localStorage，無則回傳 default） */
  get: () => T;
  /** 寫入資料並同步到 localStorage */
  set: (value: T) => void;
  /** 清除 localStorage，之後 get 會回傳 default */
  reset: () => void;
  /** 預設值（JSON 來源） */
  defaultValue: T;
}

function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * 建立可重用 localStorage store
 * @param key - localStorage key（會加上 admin: 前綴）
 * @param defaultValue - 預設值，localStorage 無資料時使用
 */
export function createStorageStore<T>(key: string, defaultValue: T): StorageStore<T> {
  const storageKey = PREFIX + key;

  function get(): T {
    if (!isClient()) return defaultValue;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as T;
        return parsed;
      }
    } catch {
      // ignore parse error
    }
    return defaultValue;
  }

  function set(value: T): void {
    if (!isClient()) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // ignore quota exceeded, etc.
    }
  }

  function reset(): void {
    if (!isClient()) return;
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }

  return {
    get,
    set,
    reset,
    defaultValue,
  };
}
