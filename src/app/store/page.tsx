import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/store/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Store",
  description: "Stems, backing tracks, transcriptions, and worksheets.",
  alternates: { canonical: "/store" },
};

export default function StorePage() {
  const hasProducts = products.length > 0;

  return (
    <Section pattern="dots" space="page">
      <h1 className="animate-fade-up font-display text-4xl font-semibold tracking-tight text-ink-900">
        Store
      </h1>
      <p
        style={{ animationDelay: "80ms" }}
        className="animate-fade-up mt-3 max-w-xl leading-relaxed text-ink-700"
      >
        {hasProducts ? (
          <>
            <span data-mode-only="lessons">
              Practice material to take home: transcriptions and worksheets to work through between
              lessons, plus stems and backing tracks to play along with. Instant delivery to your
              inbox after checkout.
            </span>
            <span data-mode-only="studio">
              Digital downloads: multitrack stems and backing tracks to remix or practice against,
              plus transcriptions and worksheets. Instant delivery to your inbox after checkout.
            </span>
          </>
        ) : (
          "Downloadable practice material and stems are on the way: transcriptions, worksheets, backing tracks, and multitracks, delivered straight to your inbox."
        )}
      </p>

      {hasProducts ? (
        /* Products relevant to the current door float to the front (CSS order —
           see globals.css); nothing is hidden, since both doors buy from here. */
        <div className="store-grid mt-10 grid gap-6 sm:grid-cols-2">
          {products.map((product, i) => (
            <Reveal
              key={product.slug}
              delay={i * 70}
              data-audience={
                product.fileType === "stems" || product.fileType === "backing-track"
                  ? "studio"
                  : "lessons"
              }
            >
              <ProductCard product={product} accent={i % 2 === 0 ? "marigold" : "periwinkle"} />
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal delay={140} className="mt-10 max-w-2xl">
          <Card accent="marigold">
            <p className="leading-relaxed text-ink-700">
              The shop is being stocked. If there’s something specific you’re after, like
              stems to remix, a backing track, or practice worksheets, let me know and I’ll
              point you in the right direction.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <Button href="/contact">Ask about material</Button>
              <Button href="/lessons" variant="secondary">
                Book a lesson
              </Button>
            </div>
          </Card>
        </Reveal>
      )}
    </Section>
  );
}
