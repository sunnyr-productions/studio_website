import Link from "next/link";
import type { ReactNode } from "react";
import { Arrow } from "@/components/ui/Arrow";

/**
 * Back up to the page above: a drawn arrow that steps back as you point at the
 * link, and the words drawing their ripple in like the header's links. Pass a
 * text colour in `className`.
 */
export function BackLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`back-link group inline-flex items-center gap-2 py-2 text-sm font-semibold ${className}`}>
      <Arrow
        direction="left"
        className="transition-transform duration-[var(--dur-lift)] ease-[var(--ease-settle)] motion-safe:group-hover:-translate-x-1"
      />
      <span className="nav-link">{children}</span>
    </Link>
  );
}
