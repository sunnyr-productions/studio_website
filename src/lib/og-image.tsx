import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

type Accent = "marigold" | "periwinkle";

const accents: Record<Accent, { bar: string; eyebrow: string }> = {
  marigold: { bar: "#f5a623", eyebrow: "#8a5a00" },
  periwinkle: { bar: "#7b8fde", eyebrow: "#3d4ca3" },
};

/**
 * The shared social card: brand gradient, the page's title, and the site name.
 * Used by opengraph-image.tsx files so every route shares one design.
 */
export function renderOgImage({
  eyebrow,
  title,
  accent = "marigold",
}: {
  eyebrow: string;
  title: string;
  accent?: Accent;
}) {
  const colors = accents[accent];
  // Long titles (blog posts) step down so they never overflow the card.
  const fontSize = title.length > 70 ? 56 : title.length > 40 ? 68 : 84;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #e5e8fa 0%, #fde3dc 55%, #feeacb 100%)",
          color: "#1f2430",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              width: 96,
              height: 10,
              borderRadius: 5,
              background: colors.bar,
              marginBottom: 28,
            }}
          />
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 2, color: colors.eyebrow }}>
            {eyebrow}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -1.5,
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 32, fontWeight: 700 }}>
          The sunny*r Studio · Corvallis, OR
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
