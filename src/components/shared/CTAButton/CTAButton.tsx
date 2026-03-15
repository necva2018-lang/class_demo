import Link from "next/link";
import type { CTAButtonProps } from "@/components/types";

const variantStyles = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
  secondary:
    "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
  outline:
    "border-2 border-slate-300 text-slate-700 hover:border-indigo-300 hover:bg-slate-50 focus:ring-slate-400",
  white:
    "bg-white text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-3.5 text-base",
};

export function CTAButton({
  href,
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  external = false,
  className = "",
}: CTAButtonProps) {
  const baseClass =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const classes = `${baseClass} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`.trim();

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
