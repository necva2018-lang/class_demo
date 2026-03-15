"use client";

import { useState } from "react";
import { FAQItem } from "@/components/shared";
import type { FAQItemData } from "@/components/types";

interface CourseDetailFAQProps {
  items: FAQItemData[];
}

export function CourseDetailFAQ({ items }: CourseDetailFAQProps) {
  const [openId, setOpenId] = useState<string | null>(
    items.length > 0 ? "0" : null
  );

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const id = String(i);
        const isOpen = openId === id;

        return (
          <FAQItem
            key={id}
            question={item.question}
            answer={item.answer}
            isOpen={isOpen}
            onToggle={() => setOpenId(isOpen ? null : id)}
          />
        );
      })}
    </div>
  );
}
