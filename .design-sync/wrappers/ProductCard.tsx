// design-sync-only variant of src/components/store/ProductCard.tsx.
// Only change: plain <a> instead of next/link's <Link> (next/link pulls in
// Next.js internals that crash when bundled standalone). Everything else is
// identical to production.
import { Card } from "./Card";
import type { Product } from "../../src/lib/products";

const typeLabels: Record<Product["fileType"], string> = {
  stems: "Stems",
  "backing-track": "Backing Track",
  transcription: "Transcription",
  worksheet: "Worksheet",
};

export function ProductCard({ product, accent }: { product: Product; accent: "marigold" | "periwinkle" }) {
  return (
    <a href={`/store/${product.slug}`}>
      <Card accent={accent} className="h-full transition-shadow hover:shadow-md">
        <p className="text-xs font-semibold uppercase tracking-wide text-periwinkle-700">
          {typeLabels[product.fileType]}
        </p>
        <h2 className="mt-2 font-display text-lg font-semibold text-ink-900">{product.name}</h2>
        <p className="mt-2 text-sm text-ink-700">{product.description}</p>
        <p className="mt-4 text-sm font-semibold text-marigold-800">{product.priceDisplay}</p>
      </Card>
    </a>
  );
}
