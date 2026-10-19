import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { lessonPages } from "@/content/lesson-pages";
import { lessonPricing, lessonTypes, trialPhrase } from "@/content/lessons";
import { siteConfig } from "@/lib/site-config";
import { breadcrumbSchema, faqPageSchema, serviceSchema } from "@/lib/structured-data";

type Params = { slug: string };

const entries = lessonTypes
  .filter((l) => lessonPages[l.slug])
  .map((lesson) => ({ lesson, page: lessonPages[lesson.slug] }));

export function generateStaticParams(): Params[] {
  return entries.map(({ page }) => ({ slug: page.pageSlug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = entries.find((e) => e.page.pageSlug === slug);
  if (!entry) return {};
  return {
    title: entry.page.metaTitle,
    description: entry.page.metaDescription,
    alternates: { canonical: `/lessons/${slug}` },
  };
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2 text-ink-700">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden="true" className="text-marigold-600">
            &bull;
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function LessonPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const entry = entries.find((e) => e.page.pageSlug === slug);
  if (!entry) notFound();
  const { lesson, page } = entry;

  const path = `/lessons/${slug}`;
  const others = entries.filter((e) => e.page.pageSlug !== slug);

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: lesson.name,
            description: page.metaDescription,
            path,
            minPrice: lessonPricing.trial.price,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Lessons", path: "/lessons" },
            { name: lesson.name, path },
          ]),
          faqPageSchema(page.faqs),
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
          {page.h1}
        </h1>
        <p
          style={{ animationDelay: "140ms" }}
          className="animate-fade-up mt-5 max-w-2xl text-lg leading-relaxed text-ink-700"
        >
          {page.intro}
        </p>
        <p
          style={{ animationDelay: "200ms" }}
          className="animate-fade-up mt-4 font-display text-xl font-semibold text-marigold-800"
        >
          ${lessonPricing.hourlyRate} an hour · {trialPhrase}
        </p>
        <div
          style={{ animationDelay: "260ms" }}
          className="animate-fade-up mt-8 flex flex-wrap gap-4"
        >
          <Button href="/lessons#book">Book a trial</Button>
          <Button href={`/contact?service=lessons`} variant="secondary">
            Ask a question
          </Button>
        </div>
      </Section>

      <Section>
        <Reveal>
          <SectionHeading title="Who it’s for" />
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-700">{page.whoFor}</p>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Reveal>
            <Card accent={lesson.accent} className="h-full">
              <h2 className="font-display text-xl font-semibold text-ink-900">
                What a first lesson looks like
              </h2>
              <Bullets items={page.firstLesson} />
            </Card>
          </Reveal>
          <Reveal delay={80}>
            <Card accent="marigold" className="h-full">
              <h2 className="font-display text-xl font-semibold text-ink-900">What to bring</h2>
              <Bullets items={page.bring} />
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section surface="sun">
        <Reveal>
          <SectionHeading title="In person or online" />
          <p className="mt-4 max-w-3xl leading-relaxed text-ink-700">{page.format}</p>
          <p className="mt-3 max-w-3xl leading-relaxed text-ink-700">
            Prices, packs, and the cancellation policy are on the{" "}
            <Link
              href="/lessons#pricing"
              className="font-semibold text-marigold-800 underline decoration-marigold-300 underline-offset-2 hover:text-marigold-600"
            >
              lessons page
            </Link>
            .
          </p>
        </Reveal>
      </Section>

      <Section surface="tint">
        <Reveal>
          <SectionHeading title="Questions people ask" />
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {page.faqs.map((faq, i) => (
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
          title={`Try ${lesson.name.toLowerCase()}`}
          body={`Book ${trialPhrase} lesson, or send a question first. I’ll write back myself within ${siteConfig.responseTime.lessons}.`}
        >
          <Button href="/lessons#book">Book a trial</Button>
          <Button href="/contact?service=lessons" variant="secondary">
            Ask a question
          </Button>
        </CtaPanel>
        <p className="mt-8 text-center text-sm text-ink-500">
          Also:{" "}
          {others.map((o, i) => (
            <span key={o.page.pageSlug}>
              {i > 0 && " · "}
              <Link
                href={`/lessons/${o.page.pageSlug}`}
                className="font-semibold text-marigold-800 underline decoration-marigold-300 underline-offset-2 hover:text-marigold-600"
              >
                {o.lesson.name}
              </Link>
            </span>
          ))}
        </p>
      </Section>
    </>
  );
}
