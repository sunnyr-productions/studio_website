"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms — pass i * 80 or similar when mapping a list. */
  delay?: number;
};

/**
 * Fades + slides content up as it scrolls into view. Plays once. Falls back
 * to fully-visible-with-no-animation under prefers-reduced-motion (handled
 * in globals.css via the [data-reveal] rules).
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={visible ? "in" : "out"}
      style={{ transitionDelay: visible ? `${delay}ms` : undefined }}
      className={className}
    >
      {children}
    </div>
  );
}
