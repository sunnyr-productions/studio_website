import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { neurodivergentPage as copy } from "@/content/neurodivergent-page";
import { breadcrumbSchema } from "@/lib/structured-data";

const path = "/lessons/neurodivergent-learners";

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: { canonical: path },
  robots: copy.published ? undefined : { index: false, follow: false },
};

export default function NeurodivergentLearnersPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Lessons", path: "/lessons" },
          { name: "Neurodivergent learners", path },
        ])}
      />

      <Section surface="sky" space="page" width="narrow">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
          <Link href="/lessons" className="inline-block py-2 font-semibold text-marigold-800 hover:underline">
            ← Lessons
          </Link>
        </nav>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          {copy.h1}
        </h1>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-700">
          {copy.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Section>

      <Section width="narrow">
        <SectionHeading title="Who this is for" />
        <p className="mt-4 text-lg leading-relaxed text-ink-700">{copy.whoFor}</p>
        <SectionHeading title="How to find out if it's a fit" className="mt-12" />
        <p className="mt-4 text-lg leading-relaxed text-ink-700">{copy.trial}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href="/lessons#book">Book a trial</Button>
          <Button href="/contact?service=lessons" variant="secondary">
            Ask a question first
          </Button>
        </div>
        <p className="mt-10 text-sm leading-relaxed text-ink-500">{copy.disclaimer}</p>
      </Section>
    </>
  );
}
