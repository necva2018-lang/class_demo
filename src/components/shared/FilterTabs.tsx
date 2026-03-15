"use client";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterTabsProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  allLabel?: string;
  className?: string;
}

export function FilterTabs({
  options,
  value,
  onChange,
  allLabel = "全部",
  className,
}: FilterTabsProps) {
  return (
    <div
      className={`flex flex-wrap gap-2 ${className ?? ""}`}
      role="tablist"
    >
      <button
        type="button"
        role="tab"
        onClick={() => onChange("")}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          value === ""
            ? "bg-indigo-600 text-white"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
        }`}
      >
        {allLabel}
      </button>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          onClick={() => onChange(opt.value)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            value === opt.value
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
