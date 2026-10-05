export type ProductType = "stems" | "backing-track" | "transcription" | "worksheet";

export type Product = {
  slug: string;
  name: string;
  description: string;
  /** Stripe Price ID created in the Stripe Dashboard — required before checkout can work. */
  priceId: string;
  priceDisplay: string;
  /** Path/key of the file in private storage — never a public URL. */
  fileKey: string;
  fileType: ProductType;
  previewAudioUrl?: string;
};

/**
 * Real products only. The store shows a "coming soon" state while this is
 * empty (see app/store/page.tsx), and the Stripe checkout / webhook / blob
 * delivery paths stay fully wired for when a real product is added here.
 *
 * The placeholder catalog (with its live Stripe price IDs and blob file keys)
 * is preserved in the template below — uncomment and edit to relaunch the
 * store, or replace with genuinely new products.
 */
export const products: Product[] = [];

/* Placeholder catalog — kept for reference / quick relaunch:
[
  {
    slug: "midnight-drive-stems",
    name: "\"Midnight Drive\" Full Stems",
    description:
      "Complete multitrack stems from the placeholder release — drums, bass, guitars, synths, and vocals, ready to remix.",
    priceId: "price_1TqlGGRrQoG9xQUmmMjxGNkN",
    priceDisplay: "$25.00",
    fileKey: "products/midnight-drive-stems-UdIxu9TQJzXFra0cYYYfwmg58nqZED.zip",
    fileType: "stems",
    previewAudioUrl: "/audio/sample-mix-01.wav",
  },
  {
    slug: "midnight-drive-backing-track",
    name: "\"Midnight Drive\" Backing Track",
    description: "Instrumental backing track, mixed and ready for a live vocalist or cover.",
    priceId: "price_1TqlGGRrQoG9xQUmoqgUBScx",
    priceDisplay: "$8.00",
    fileKey: "products/midnight-drive-backing.wav",
    fileType: "backing-track",
    previewAudioUrl: "/audio/sample-master-02.wav",
  },
  {
    slug: "midnight-drive-transcription",
    name: "\"Midnight Drive\" Full Transcription",
    description: "Note-for-note transcription (PDF) covering guitar, bass, and vocal melody.",
    priceId: "price_1TqlGHRrQoG9xQUmrQfC1jvW",
    priceDisplay: "$6.00",
    fileKey: "products/midnight-drive-transcription.pdf",
    fileType: "transcription",
  },
  {
    slug: "home-studio-gain-staging-worksheet",
    name: "Home Studio Gain-Staging Worksheet",
    description:
      "A one-page printable worksheet for dialing in clean input levels before you ever hit record.",
    priceId: "price_1TqlGHRrQoG9xQUmWJt5Vw0l",
    priceDisplay: "$3.00",
    fileKey: "products/gain-staging-worksheet.pdf",
    fileType: "worksheet",
  },
]
*/

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
