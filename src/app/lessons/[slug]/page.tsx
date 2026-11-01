import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { Section } from "@/components/ui/Section";
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

function Part({ title, children }: { title: string; children: string }) {
  return (
    <div className="mt-8 first:mt-0">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">{title}</h2>
      <p className="mt-2 text-lg leading-relaxed text-ink-700">{children}</p>
    </div>
  );
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
          faqPageSchema(page.faqs),
        ]}
      />

      <Section surface="sky" space="page" width="narrow">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
          <Link href="/lessons" className="inline-block py-2 font-semibold text-marigold-800 hover:underline">
            ← Lessons
          </Link>
        </nav>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          {page.h1}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-700">{page.intro}</p>
        <p className="mt-4 font-semibold text-marigold-800">
          ${lessonPricing.hourlyRate} an hour. Start with {trialPhrase}.
        </p>
      </Section>

      <Section width="narrow">
        {page.sections.map((section) => (
          <Part key={section.title} title={section.title}>
            {section.body}
          </Part>
        ))}
        <Part title="Who it’s for">{page.whoFor}</Part>
        <Part title="The first lesson">{page.firstLesson}</Part>
        <Part title="What to bring">{page.bring}</Part>
        <Part title="In person or online">{page.format}</Part>
        {page.faqs.map((faq) => (
          <Part key={faq.q} title={faq.q}>
            {faq.a}
          </Part>
        ))}
      </Section>

      <Section space="tight">
        <CtaPanel
          title={page.closingTitle}
          body={`Book a trial, or send me a question first. I’ll write back within ${siteConfig.responseTime.lessons}.`}
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
