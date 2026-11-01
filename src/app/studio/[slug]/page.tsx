import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { Section } from "@/components/ui/Section";
import { servicePages } from "@/content/service-pages";
import { services } from "@/content/services";
import { breadcrumbSchema, faqPageSchema, serviceSchema } from "@/lib/structured-data";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return services.filter((s) => servicePages[s.slug]).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const page = servicePages[slug];
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/studio/${slug}` },
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

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  const page = servicePages[slug];
  if (!service || !page) notFound();

  const path = `/studio/${slug}`;
  const quoteHref = `/contact?service=${slug}`;

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: service.name,
            description: page.metaDescription,
            path,
            minPrice: page.minPrice,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Studio", path: "/studio" },
            { name: service.name, path },
          ]),
          ...(page.faqs.length > 0 ? [faqPageSchema(page.faqs)] : []),
        ]}
      />

      <Section space="page">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
          <Link href="/studio" className="inline-block py-2 font-semibold text-periwinkle-700 hover:underline">
            ← Studio
          </Link>
        </nav>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          {page.h1}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-700">{page.intro}</p>
        <p className="mt-4 font-display text-xl font-semibold text-marigold-800">
          {service.startingPrice}
        </p>
      </Section>

      <Section>
        <div className="grid gap-6 sm:grid-cols-2">
          <Card accent="periwinkle" className="h-full">
            <h2 className="font-display text-xl font-semibold text-ink-900">{page.needTitle}</h2>
            <Bullets items={page.need} />
          </Card>
          <Card accent="marigold" className="h-full">
            <h2 className="font-display text-xl font-semibold text-ink-900">{page.getTitle}</h2>
            <Bullets items={page.get} />
          </Card>
        </div>
        <p className="mt-10 max-w-3xl text-lg leading-relaxed text-ink-700">{page.howItRuns}</p>

        {page.sections.length > 0 && (
          <div className="mt-12 max-w-3xl">
            {page.sections.map((section) => (
              <div key={section.title} className="mt-8 first:mt-0">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">{section.title}</h2>
                <p className="mt-2 text-lg leading-relaxed text-ink-700">{section.body}</p>
              </div>
            ))}
          </div>
        )}

        {page.faqs.length > 0 && (
          <div className="mt-12 max-w-3xl">
            {page.faqs.map((faq) => (
              <div key={faq.q} className="mt-6">
                <h2 className="font-display text-xl font-semibold text-ink-900">{faq.q}</h2>
                <p className="mt-2 leading-relaxed text-ink-700">{faq.a}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section space="tight">
        <CtaPanel title={page.closingTitle} body={page.closingBody}>
          <Button href={quoteHref}>{page.ctaLabel}</Button>
          <Button href="/studio" variant="secondary">
            See everything I do
          </Button>
        </CtaPanel>
      </Section>
    </>
  );
}
