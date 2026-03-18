import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { getFaqItems, getFaqCategories } from "@/lib/data/faq";
import { getSiteSettings } from "@/lib/data/settings";
import { FAQPageClient } from "./FAQPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "常見問題",
  description: "關於報名、補助資格、課程的常見疑問，為您一次解答",
  path: "/faq",
});

export default async function FAQPage() {
  const items = await getFaqItems();
  const categories = await getFaqCategories();
  const settings = await getSiteSettings();

  return (
    <FAQPageClient
      items={items}
      categories={categories}
      contactPhone={settings.contact.phone}
    />
  );
}
