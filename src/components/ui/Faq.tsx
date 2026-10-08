import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ModeContent } from "@/content/modes";

/**
 * FAQ accordion — native <details>/<summary>, no client JS needed. Cuts
 * pre-contact friction and gives crawlers real Q&A text. Heading on the left,
 * questions on the right. Rendered per door; CSS shows the active one.
 */
export function Faq({ mode }: { mode: ModeContent }) {
  return (
    <div data-mode-only={mode.id} className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
      <Reveal>
        <SectionHeading
          title="Questions people ask"
          lede={
            <>
              Don&apos;t see yours?{" "}
              <Link
                href="/contact"
                className="font-semibold text-marigold-800 underline decoration-marigold-300 underline-offset-2 transition-colors hover:text-marigold-600"
              >
                Ask me directly
              </Link>
              .
            </>
          }
        />
      </Reveal>
      <div className="flex flex-col gap-3">
        {mode.faqs.map((faq, i) => (
          <Reveal key={faq.q} delay={i * 60}>
            <details
              style={{ borderRadius: "var(--radius-sketch-sm)" }}
              className="surface-card group border-[1.5px] border-ink-900/20 px-5 py-4 shadow-[2px_3px_0_0_var(--sketch-shadow)] transition-shadow open:shadow-[3px_4px_0_0_var(--sketch-shadow)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold text-ink-900 [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-marigold-600 transition-transform duration-300 group-open:rotate-45"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M9 3v12M3 9h12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-ink-700">{faq.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
