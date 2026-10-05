import type { ReactNode } from "react";

type Pattern = "waveform" | "dots" | "sprout" | "none";

function DotsPattern() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.06]"
      aria-hidden="true"
    >
      <defs>
        <pattern id="soundboard-dots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="3" className="fill-periwinkle-700" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#soundboard-dots)" />
    </svg>
  );
}

function WaveformPattern() {
  const bars = Array.from({ length: 60 }, (_, i) => 8 + ((i * 37) % 40));
  return (
    <svg
      viewBox="0 0 720 60"
      preserveAspectRatio="none"
      className="absolute inset-x-0 bottom-0 h-16 w-full opacity-[0.08]"
      aria-hidden="true"
    >
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 12}
          y={60 - h}
          width={6}
          height={h}
          className="fill-marigold-600"
        />
      ))}
    </svg>
  );
}

function SproutPattern() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.07]"
      aria-hidden="true"
    >
      <defs>
        <pattern id="sunnyr-sprout" width="56" height="56" patternUnits="userSpaceOnUse">
          <g transform="translate(10 34)" className="stroke-marigold-700" fill="none" strokeWidth="2" strokeLinecap="round">
            <path d="M0,16 C0,6 0,0 0,0" />
            <path d="M0,10 C4,10 6,6 6,2 C2,2 0,5 0,10" className="fill-marigold-600" strokeWidth="1.5" />
            <path d="M0,6 C-4,6 -6,2 -6,-2 C-2,-2 0,1 0,6" className="fill-periwinkle-500" strokeWidth="1.5" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sunnyr-sprout)" />
    </svg>
  );
}

export function Section({
  children,
  pattern = "none",
  className = "",
  id,
  "data-sect": dataSect,
}: {
  children: ReactNode;
  pattern?: Pattern;
  className?: string;
  id?: string;
  /** Names the section so `data-mode` CSS can re-order it per studio mode. */
  "data-sect"?: string;
}) {
  return (
    <section id={id} data-sect={dataSect} className={`relative overflow-hidden ${className}`}>
      {pattern === "dots" && <DotsPattern />}
      {pattern === "waveform" && <WaveformPattern />}
      {pattern === "sprout" && <SproutPattern />}
      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">{children}</div>
    </section>
  );
}
