"use client";

interface AdminResetButtonProps {
  onReset: () => void;
  label?: string;
  confirmMessage?: string;
  className?: string;
}

/**
 * 共用「還原為預設值」按鈕
 * 點擊時要求確認，確認後執行 onReset
 */
export function AdminResetButton({
  onReset,
  label = "還原為預設值",
  confirmMessage = "確定要還原為預設值嗎？已儲存的變更將會遺失。",
  className,
}: AdminResetButtonProps) {
  const handleClick = () => {
    if (window.confirm(confirmMessage)) {
      onReset();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ??
        "rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100"
      }
    >
      {label}
    </button>
  );
}
