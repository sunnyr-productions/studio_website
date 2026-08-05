import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { ProductCard } from "@/components/store/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Store",
  description: "Stems, backing tracks, transcriptions, and worksheets.",
};

export default function StorePage() {
  return (
    <Section pattern="dots" className="pt-16">
      <h1 className="animate-fade-up font-display text-4xl font-semibold tracking-tight text-ink-900">
        Store
      </h1>
      <p style={{ animationDelay: "80ms" }} className="animate-fade-up mt-3 max-w-xl leading-relaxed text-ink-700">
        <span data-mode-only="lessons">
          Practice material to take home — transcriptions and worksheets to work through between
          lessons, plus stems and backing tracks to play along with. Instant delivery to your
          inbox after checkout.
        </span>
        <span data-mode-only="studio">
          Digital downloads — multitrack stems and backing tracks to remix or practice against,
          plus transcriptions and worksheets. Instant delivery to your inbox after checkout.
        </span>
      </p>

      {/* Products relevant to the current door float to the front (CSS order —
          see globals.css); nothing is hidden, since both doors buy from here. */}
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
    </Section>
  );
}
