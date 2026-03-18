import type { Metadata } from "next";
import "@/app/globals.css";
import { getEffectiveSeoConfigAsync } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getEffectiveSeoConfigAsync();
  return {
    metadataBase: new URL(config.baseUrl),
    title: {
      default: `${config.siteName} | ${config.defaultTitle}`,
      template: `%s | ${config.siteName}`,
    },
    description: config.defaultDescription,
    keywords: config.keywords,
    authors: [{ name: config.siteName }],
    openGraph: {
      type: "website",
      siteName: config.siteName,
      locale: "zh_TW",
      url: config.baseUrl,
      images: [
        {
          url: config.defaultOgImage,
          width: 1200,
          height: 630,
          alt: config.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
