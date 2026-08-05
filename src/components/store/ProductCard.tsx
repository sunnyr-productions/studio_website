import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { Product } from "@/lib/products";

const typeLabels: Record<Product["fileType"], string> = {
  stems: "Stems",
  "backing-track": "Backing Track",
  transcription: "Transcription",
  worksheet: "Worksheet",
};

export function ProductCard({ product, accent }: { product: Product; accent: "marigold" | "periwinkle" }) {
  return (
    <Link href={`/store/${product.slug}`}>
      <Card accent={accent} className="h-full">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-periwinkle-700">
          {typeLabels[product.fileType]}
        </p>
        <h2 className="mt-2 font-display text-lg font-semibold text-ink-900">{product.name}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-700">{product.description}</p>
        <p className="mt-4 text-sm font-semibold text-marigold-800">{product.priceDisplay}</p>
      </Card>
    </Link>
  );
}
