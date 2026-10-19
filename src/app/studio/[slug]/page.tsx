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
import { servicePages } from "@/content/service-pages";
import { services } from "@/content/services";
import { siteConfig } from "@/lib/site-config";
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
  const others = services.filter((s) => s.slug !== slug && servicePages[s.slug]);

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
          faqPageSchema(page.faqs),
        ]}
      />

      <Section pattern="dots" surface="sky" space="page">
        <nav aria-label="Breadcrumb" className="animate-fade-up text-sm text-ink-500">
          <Link href="/studio" className="font-semibold text-periwinkle-700 hover:underline">
            ← Studio
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
          {service.startingPrice}
        </p>
        <div
          style={{ animationDelay: "260ms" }}
          className="animate-fade-up mt-8 flex flex-wrap gap-4"
        >
          <Button href={`/contact?service=${page.formValue}`}>Get a quote</Button>
          <Button href="/studio" variant="secondary">
            All services
          </Button>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 sm:grid-cols-2">
          <Reveal>
            <Card accent="periwinkle" className="h-full">
              <h2 className="font-display text-xl font-semibold text-ink-900">What you send</h2>
              <Bullets items={page.youSend} />
            </Card>
          </Reveal>
          <Reveal delay={80}>
            <Card accent="marigold" className="h-full">
              <h2 className="font-display text-xl font-semibold text-ink-900">What you get</h2>
              <Bullets items={page.youGet} />
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section surface="ink">
        <Reveal>
          <SectionHeading title="How it works" lede="Quotes are free, and asking for one doesn’t commit you to anything." />
        </Reveal>
        <ol className="mt-10 grid gap-8 sm:grid-cols-3">
          {page.process.map((step, i) => (
            <Reveal key={step.title} delay={i * 90}>
              <li>
                <span
                  aria-hidden="true"
                  style={{ borderRadius: "var(--radius-sketch-sm)" }}
                  className="flex h-11 w-11 items-center justify-center border-[1.5px] border-[color:var(--color-ink-fixed)] bg-periwinkle-500 font-display text-lg font-semibold text-[color:var(--color-ink-fixed)] shadow-[2px_3px_0_0_var(--color-ink-fixed)]"
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-700">{step.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
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
          title={`Ready for ${service.name.toLowerCase()}?`}
          body={`Tell me about your project. I’ll send a fixed quote within ${siteConfig.responseTime.studio}.`}
        >
          <Button href={`/contact?service=${page.formValue}`}>Get a quote</Button>
        </CtaPanel>
        <p className="mt-8 text-center text-sm text-ink-500">
          Also:{" "}
          {others.map((o, i) => (
            <span key={o.slug}>
              {i > 0 && " · "}
              <Link
                href={`/studio/${o.slug}`}
                className="font-semibold text-periwinkle-700 underline decoration-periwinkle-300 underline-offset-2 hover:text-periwinkle-600"
              >
                {o.name}
              </Link>
            </span>
          ))}
        </p>
      </Section>
    </>
  );
}
