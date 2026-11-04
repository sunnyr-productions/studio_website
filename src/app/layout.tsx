import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/layout/Header";
import { Sky } from "@/components/layout/Sky";
import { Scenery } from "@/components/layout/Scenery";
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

const title = `Music Lessons & Mixing in Corvallis, OR | ${siteConfig.name}`;

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
      className={`${bodyFont.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans text-ink-900">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10000] focus:rounded-md focus:bg-marigold-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-[color:var(--color-ink-fixed)]"
        >
          Skip to content
        </a>
        <JsonLd data={localBusinessSchema()} />
        <Sky />
        <Header />
        {/* The scenery sticks to the bottom of the screen within this box, which ends
            where the river goes over the edge in the footer, so that's where it
            comes to rest. */}
        <div className="flex flex-1 flex-col">
          <main id="main" className="relative flex-1">
            {children}
          </main>
          <Scenery />
        </div>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
