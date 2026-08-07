import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { CheckoutButton } from "@/components/store/CheckoutButton";
import { WaveformPlayer } from "@/components/audio/WaveformPlayer";
import { getProductBySlug, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ productSlug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}): Promise<Metadata> {
  const { productSlug } = await params;
  const product = getProductBySlug(productSlug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/store/${product.slug}` },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const { productSlug } = await params;
  const product = getProductBySlug(productSlug);

  if (!product) {
    notFound();
  }

  return (
    <Section pattern="waveform" className="pt-16">
      <div className="max-w-xl">
        <h1 className="animate-fade-up font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          {product.name}
        </h1>
        <p style={{ animationDelay: "80ms" }} className="animate-fade-up mt-4 leading-relaxed text-ink-700">
          {product.description}
        </p>
        <p style={{ animationDelay: "140ms" }} className="animate-fade-up mt-6 text-2xl font-semibold text-marigold-700">
          {product.priceDisplay}
        </p>

        {product.previewAudioUrl && (
          <div style={{ animationDelay: "200ms" }} className="animate-fade-up mt-6">
            <WaveformPlayer title="Preview" subtitle={product.name} audioUrl={product.previewAudioUrl} />
          </div>
        )}

        <div style={{ animationDelay: "260ms" }} className="animate-fade-up mt-8">
          <CheckoutButton productSlug={product.slug} />
        </div>
      </div>
    </Section>
  );
}
