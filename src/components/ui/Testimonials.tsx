import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/content/testimonials";

/** The testimonial cards. The caller renders the section only when there are some. */
export function Testimonials() {
  return (
    <>
      <Reveal>
        <SectionHeading title="What people say" />
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 100}>
            <Card className="relative overflow-hidden">
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute -left-2 -top-6 font-display text-8xl ${
                  t.accent === "periwinkle" ? "text-periwinkle-200" : "text-marigold-200"
                }`}
              >
                &ldquo;
              </span>
              <p className="relative leading-relaxed text-ink-700">{t.quote}</p>
              <p className="relative mt-4 text-sm font-semibold text-ink-900">
                — {t.name}
                {t.role ? `, ${t.role}` : ""}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
    </>
  );
}
