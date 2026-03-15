"use client";

import { useState } from "react";
import type { FAQItemProps } from "@/components/types";

export function FAQItem({
  question,
  answer,
  isOpen: controlledIsOpen,
  onToggle,
  defaultOpen = false,
  className = "",
}: FAQItemProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isControlled = controlledIsOpen !== undefined && onToggle !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalOpen;

  const handleClick = () => {
    if (isControlled) {
      onToggle?.();
    } else {
      setInternalOpen(!internalOpen);
    }
  };

  return (
    <div
      className={`overflow-hidden rounded-xl border border-slate-200 bg-white ${className}`}
    >
      <button
        type="button"
        onClick={handleClick}
        className="flex w-full items-center justify-between px-4 py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-slate-900">{question}</span>
        <svg
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-2">
          <p className="text-slate-600">{answer}</p>
        </div>
      )}
    </div>
  );
}
