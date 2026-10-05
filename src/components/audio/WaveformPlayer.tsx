"use client";

import { useEffect, useRef, useState } from "react";
import type WaveSurfer from "wavesurfer.js";

export function WaveformPlayer({
  title,
  subtitle,
  audioUrl,
}: {
  title: string;
  subtitle: string;
  audioUrl: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;

    import("wavesurfer.js").then(({ default: WaveSurfer }) => {
      if (cancelled || !containerRef.current) return;

      const ws = WaveSurfer.create({
        container: containerRef.current,
        height: 56,
        waveColor: "#c9cff3",
        progressColor: "#f5a623",
        cursorColor: "#3a4152",
        barWidth: 3,
        barGap: 2,
        barRadius: 2,
        url: audioUrl,
      });

      ws.on("play", () => setIsPlaying(true));
      ws.on("pause", () => setIsPlaying(false));
      ws.on("finish", () => setIsPlaying(false));

      wavesurferRef.current = ws;
    });

    return () => {
      cancelled = true;
      wavesurferRef.current?.destroy();
      wavesurferRef.current = null;
    };
  }, [audioUrl]);

  return (
    <div
      style={{ borderRadius: "var(--radius-sketch)" }}
      className="border-[1.5px] border-ink-900/25 bg-cream-50 p-5 shadow-[3px_4px_0_0_var(--sketch-shadow)] transition-all duration-300 motion-safe:hover:-translate-x-0.5 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-[5px_6px_0_0_var(--sketch-shadow)]"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-display font-semibold text-ink-900">{title}</p>
          <p className="text-sm text-ink-700">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => wavesurferRef.current?.playPause()}
          aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-marigold-500 text-[color:var(--color-ink-fixed)] transition-all duration-300 hover:scale-110 hover:bg-marigold-400 motion-safe:active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold-700 ${isPlaying ? "motion-safe:animate-pulse" : ""}`}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <rect x="3" y="2" width="3.5" height="12" fill="currentColor" />
              <rect x="9.5" y="2" width="3.5" height="12" fill="currentColor" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 2l10 6-10 6V2z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>

      <div className="mt-4" ref={containerRef} />
    </div>
  );
}
