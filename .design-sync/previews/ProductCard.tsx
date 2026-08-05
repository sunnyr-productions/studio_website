import { ProductCard } from "../wrappers/ProductCard";

const stems = {
  slug: "midnight-drive-stems",
  name: '"Midnight Drive" Full Stems',
  description:
    "Complete multitrack stems from the placeholder release — drums, bass, guitars, synths, and vocals, ready to remix.",
  priceId: "price_1TqlGGRrQoG9xQUmmMjxGNkN",
  priceDisplay: "$25.00",
  fileKey: "products/midnight-drive-stems.zip",
  fileType: "stems" as const,
};

const worksheet = {
  slug: "home-studio-gain-staging-worksheet",
  name: "Home Studio Gain-Staging Worksheet",
  description: "A one-page printable worksheet for dialing in clean input levels before you ever hit record.",
  priceId: "price_1TqlGHRrQoG9xQUmWJt5Vw0l",
  priceDisplay: "$3.00",
  fileKey: "products/gain-staging-worksheet.pdf",
  fileType: "worksheet" as const,
};

export function Marigold() {
  return (
    <div className="max-w-xs">
      <ProductCard product={stems} accent="marigold" />
    </div>
  );
}

export function Periwinkle() {
  return (
    <div className="max-w-xs">
      <ProductCard product={worksheet} accent="periwinkle" />
    </div>
  );
}
