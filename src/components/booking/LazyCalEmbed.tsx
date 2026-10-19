"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const CalEmbed = dynamic(() => import("@/components/booking/CalEmbed").then((m) => m.CalEmbed), {
  ssr: false,
});

/**
 * Cal's embed is the heaviest script on the page, so it only loads once the
 * booking section is about to scroll into view (or the visitor arrives on
 * #book). Until then a same-height placeholder holds the space.
 */
export function LazyCalEmbed({ calLink }: { calLink: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: 600 }}>
      {load ? (
        <CalEmbed calLink={calLink} />
      ) : (
        <p className="p-8 text-sm text-ink-500">Loading the calendar…</p>
      )}
    </div>
  );
}
