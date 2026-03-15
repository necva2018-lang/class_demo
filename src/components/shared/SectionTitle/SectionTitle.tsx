import type { SectionTitleProps } from "@/components/types";

export function SectionTitle({
  title,
  subtitle,
  icon,
  align = "left",
}: SectionTitleProps) {
  const alignClass =
    align === "center"
      ? "text-center"
      : align === "right"
        ? "text-right"
        : "text-left";

  return (
    <div className={alignClass}>
      {icon && (
        <span className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
          {icon}
        </span>
      )}
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
    </div>
  );
}
