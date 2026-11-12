import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { BackLink } from "@/components/ui/BackLink";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { lessonPages } from "@/content/lesson-pages";
import { lessonPricing, lessonTypes } from "@/content/lessons";
import type { Mat } from "@/components/ui/Frame";
import { media, type Photo as PhotoData } from "@/content/media";
import { breadcrumbSchema, serviceSchema } from "@/lib/structured-data";

type Params = { slug: string };

/**
 * Keyed by page slug. Wide photos run under the intro, tall ones sit beside it.
 * An instrument gets a tag, which makes it a field-guide print (Frame.tsx).
 */
const pagePhotos: Record<string, { photo: PhotoData; shape: "wide" | "tall"; label?: string; mat?: Mat }> = {
  guitar: {
    photo: media.stratCase,
    shape: "wide",
    label: "My Strat",
  },
  // Its purple light reads as dusk, so a periwinkle mat.
  voice: { photo: media.voiceMic, shape: "tall", mat: "periwinkle" },
};

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
  const pagePhoto = pagePhotos[slug];

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
          <BackLink href="/lessons" className="text-marigold-800">
            Lessons
          </BackLink>
        </nav>
        <div className={pagePhoto?.shape === "tall" ? "grid gap-8 sm:grid-cols-[minmax(0,1fr)_16rem]" : ""}>
          <div>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
              {page.h1}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-700">{page.intro}</p>
          </div>
          {pagePhoto && (
            <Photo
              photo={pagePhoto.photo}
              frame={pagePhoto.label ? "guide" : "print"}
              label={pagePhoto.label}
              mat={pagePhoto.mat}
              aspect={pagePhoto.shape === "tall" ? "aspect-[4/3] sm:aspect-[3/4]" : "aspect-[3/2]"}
              sizes={pagePhoto.shape === "tall" ? "(min-width: 640px) 272px, 100vw" : "(min-width: 816px) 768px, 100vw"}
              preload
              className={pagePhoto.shape === "wide" ? "mt-8" : "sm:mt-4"}
            />
          )}
        </div>
      </Section>

      <Section width="narrow" space="tight">
        <div className="space-y-4 text-lg leading-relaxed text-ink-700">
          {page.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div
          style={{ borderRadius: "var(--radius-sketch)" }}
          className="surface-card card card-marigold mt-12 p-6 sm:p-8"
        >
          <p className="leading-relaxed text-ink-700">{page.closing}</p>
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
