import type { Metadata } from "next";
import "@/app/globals.css";
import { SEO_CONFIG, createMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.baseUrl),
  title: {
    default: `${SEO_CONFIG.siteName} | ${SEO_CONFIG.defaultTitle}`,
    template: `%s | ${SEO_CONFIG.siteName}`,
  },
  description: SEO_CONFIG.defaultDescription,
  keywords: [...SEO_CONFIG.keywords],
  authors: [{ name: SEO_CONFIG.siteName }],
  openGraph: {
    type: "website",
    siteName: SEO_CONFIG.siteName,
    locale: "zh_TW",
    url: SEO_CONFIG.baseUrl,
    images: [
      {
        url: SEO_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: SEO_CONFIG.siteName,
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
