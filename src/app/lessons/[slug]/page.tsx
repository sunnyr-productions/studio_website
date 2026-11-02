import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { lessonPages } from "@/content/lesson-pages";
import { lessonPricing, lessonTypes, trialPhrase } from "@/content/lessons";
import { breadcrumbSchema, serviceSchema } from "@/lib/structured-data";

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

export default async function LessonPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const entry = entries.find((e) => e.page.pageSlug === slug);
  if (!entry) notFound();
  const { lesson, page } = entry;

  const path = `/lessons/${slug}`;

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
        ]}
      />

      <Section space="page" width="narrow">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
          <Link href="/lessons" className="inline-block py-2 font-semibold text-marigold-800 hover:underline">
            ← Lessons
          </Link>
        </nav>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          {page.h1}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-700">{page.intro}</p>
      </Section>

      <Section width="narrow" space="tight">
        {page.sections.map((section) => (
          <div key={section.title} className="mt-10 first:mt-0">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
              {section.title}
            </h2>
            <p className="mt-2 text-lg leading-relaxed text-ink-700">{section.body}</p>
          </div>
        ))}
        <div
          style={{ borderRadius: "var(--radius-sketch)" }}
          className="surface-card mt-12 border-[1.5px] border-ink-900/80 p-6 sm:p-8"
        >
          <p className="leading-relaxed text-ink-700">{page.practical}</p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Lessons are ${lessonPricing.hourlyRate} an hour, and you can start with {trialPhrase},
            which is mostly a conversation.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button href="/lessons#book">Book a trial</Button>
            <Button href="/contact?service=lessons" variant="secondary">
              Ask a question
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
