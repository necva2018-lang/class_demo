import { CTAButton } from "../CTAButton";
import type { EmptyStateProps } from "@/components/types";

export function EmptyState({
  title,
  description,
  action,
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-16 text-center ${className}`}
    >
      {icon && <div className="mb-4 text-slate-400">{icon}</div>}
      {title && <p className="font-medium text-slate-700">{title}</p>}
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {action && (
        <div className="mt-6">
          <CTAButton href={action.href} variant="outline">
            {action.label}
          </CTAButton>
        </div>
      )}
    </div>
  );
}
