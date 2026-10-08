import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessSchema } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";

const bodyFont = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

const title = `${siteConfig.name} | Music Lessons, Mixing & Mastering`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  openGraph: {
    title,
    description: siteConfig.tagline,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.tagline,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-mode="lessons"
      suppressHydrationWarning
      className={`${bodyFont.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        {/* Runs synchronously during HTML parse, before first paint, so the
            saved theme (or the OS preference when none is saved) and the saved
            studio mode are applied with no flash. try/catch guards
            private-mode localStorage. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;d.setAttribute("data-js","");try{var t=localStorage.getItem("theme");if(!t){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}d.setAttribute("data-theme",t);var m=localStorage.getItem("mode");if(m==="studio"||m==="lessons"){d.setAttribute("data-mode",m);}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col font-sans text-ink-900">
        <JsonLd data={localBusinessSchema()} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
