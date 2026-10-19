import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { neurodivergentPage as copy } from "@/content/neurodivergent-page";
import { siteConfig } from "@/lib/site-config";
import { breadcrumbSchema, faqPageSchema } from "@/lib/structured-data";

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
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Lessons", path: "/lessons" },
            { name: "Neurodivergent learners", path },
          ]),
          faqPageSchema([...copy.faqs]),
        ]}
      />

      <Section pattern="dots" surface="sky" space="page">
        <nav aria-label="Breadcrumb" className="animate-fade-up text-sm text-ink-500">
          <Link href="/lessons" className="font-semibold text-marigold-800 hover:underline">
            ← Lessons
          </Link>
        </nav>
        <h1
          style={{ animationDelay: "80ms" }}
          className="animate-fade-up mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl"
        >
          {copy.h1}
        </h1>
        <p
          style={{ animationDelay: "140ms" }}
          className="animate-fade-up mt-5 max-w-2xl text-lg leading-relaxed text-ink-700"
        >
          {copy.intro}
        </p>
        <div
          style={{ animationDelay: "200ms" }}
          className="animate-fade-up mt-8 flex flex-wrap gap-4"
        >
          <Button href="/lessons#book">Book a trial</Button>
          <Button href="/contact?service=lessons" variant="secondary">
            Ask a question first
          </Button>
        </div>
      </Section>

      <Section>
        <Reveal>
          <SectionHeading title={copy.story.title} />
          <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-ink-700">
            {copy.story.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section surface="sun">
        <Reveal>
          <SectionHeading title="What’s different in a lesson" />
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {copy.differences.map((d, i) => (
            <Reveal key={d.title} delay={i * 70}>
              <Card accent={i % 2 === 0 ? "marigold" : "periwinkle"} className="h-full">
                <h3 className="font-display text-xl font-semibold text-ink-900">{d.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-700">{d.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading title={copy.whoFor.title} />
            <p className="mt-4 leading-relaxed text-ink-700">{copy.whoFor.body}</p>
          </Reveal>
          <Reveal delay={100}>
            <SectionHeading title={copy.trial.title} />
            <ol className="mt-4 list-decimal space-y-3 pl-5 leading-relaxed text-ink-700">
              {copy.trial.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </Reveal>
        </div>
        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-ink-500">{copy.disclaimer}</p>
      </Section>

      <Section surface="tint">
        <Reveal>
          <SectionHeading title="Questions people ask" />
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {copy.faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 60}>
              <Card className="h-full">
                <h3 className="font-display text-lg font-semibold text-ink-900">{faq.q}</h3>
                <p className="mt-2 leading-relaxed text-ink-700">{faq.a}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section space="tight">
        <CtaPanel
          title="Want to see if it’s a fit?"
          body={`Book a trial, or message me first. I’ll write back myself within ${siteConfig.responseTime.lessons}.`}
        >
          <Button href="/lessons#book">Book a trial</Button>
          <Button href="/contact?service=lessons" variant="secondary">
            Ask a question
          </Button>
        </CtaPanel>
      </Section>
    </>
  );
}
