import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Section pattern="dots" surface="sky" space="page">
      <p className="animate-fade-up font-semibold tracking-[0.08em] text-marigold-800">404</p>
      <h1
        style={{ animationDelay: "80ms" }}
        className="animate-fade-up mt-3 font-display text-4xl font-semibold tracking-tight text-ink-900"
      >
        That page hit a wrong note
      </h1>
      <p
        style={{ animationDelay: "140ms" }}
        className="animate-fade-up mt-3 max-w-xl leading-relaxed text-ink-700"
      >
        The link may be old, or the page may have moved. Everything on the site is a click away from
        here.
      </p>
      <div
        style={{ animationDelay: "200ms" }}
        className="animate-fade-up mt-8 flex flex-wrap gap-4"
      >
        <Button href="/">Back to home</Button>
        <span data-mode-only="lessons" className="contents">
          <Button href="/lessons" variant="secondary">
            See lessons
          </Button>
        </span>
        <span data-mode-only="studio" className="contents">
          <Button href="/services" variant="secondary">
            See services
          </Button>
        </span>
        <Button href="/contact" variant="ghost">
          Get in touch
        </Button>
      </div>
    </Section>
  );
}
