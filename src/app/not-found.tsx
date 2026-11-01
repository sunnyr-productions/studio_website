import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Section pattern="dots" space="page">
      <p className="font-semibold tracking-[0.08em] text-marigold-800">404</p>
      <h1
        className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink-900"
      >
        That page isn’t here
      </h1>
      <p
        className="mt-3 max-w-xl leading-relaxed text-ink-700"
      >
        The link may be old, or the page may have moved.
      </p>
      <div
        className="mt-8 flex flex-wrap gap-4"
      >
        <Button href="/">Back to home</Button>
        <Button href="/lessons" variant="secondary">
          See lessons
        </Button>
        <Button href="/studio" variant="secondary">
          See the studio
        </Button>
        <Button href="/contact" variant="ghost">
          Get in touch
        </Button>
      </div>
    </Section>
  );
}
