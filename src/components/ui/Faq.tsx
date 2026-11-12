import Link from "next/link";
import { PlusMinus } from "@/components/ui/PlusMinus";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * FAQ accordion — native <details>/<summary>, no client JS needed. Cuts
 * pre-contact friction and gives crawlers real Q&A text. Heading on the left,
 * questions on the right. Each is a drawn card that lifts as you point at it;
 * its answer unfolds and the plus folds into a minus (.unfold in globals.css).
 */
export function Faq({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
      <SectionHeading
        title="Questions"
        lede={
          <>
            Don’t see yours?{" "}
            <Link href="/contact" className="link-drawn">
              Ask me directly
            </Link>
            .
          </>
        }
      />
      <div className="flex flex-col gap-3">
        {faqs.map((faq) => (
          <div key={faq.q}>
            <details
              style={{ borderRadius: "var(--radius-sketch-sm)" }}
              className="unfold surface-card card card-lift px-5 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold text-ink-900 [&::-webkit-details-marker]:hidden">
                {faq.q}
                <PlusMinus />
              </summary>
              <p className="unfold-body mt-3 leading-relaxed text-ink-700">{faq.a}</p>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
