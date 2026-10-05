const BAR_HEIGHTS = [4, 10, 18, 26, 34, 22, 30, 14, 8, 20, 36, 24, 12, 6, 16, 28, 32, 18, 10, 4];
// Indices of the tallest bars sprout a little leaf — sound and growth from
// the same stem. Leaves are their own small fixed-size SVGs (not part of a
// stretched full-width viewBox) so the curves keep correct proportions no
// matter how wide the divider renders.
const SPROUT_AT = new Set([4, 6, 10, 16]);

function Leaf({ flip, color, delay }: { flip: boolean; color: string; delay: number }) {
  return (
    <div
      className={`absolute bottom-full left-1/2 h-3.5 w-2.5 -translate-x-1/2 ${flip ? "-scale-x-100" : ""}`}
    >
      <svg
        viewBox="0 0 10 14"
        style={{ animationDelay: `${delay}ms` }}
        className={`animate-sway h-full w-full ${color}`}
        aria-hidden="true"
      >
        <path
          d="M 5,14 C 5,14 1,10 1,6 C 1,2.5 3,0.5 5,0 C 7,0.5 9,2.5 9,6 C 9,10 5,14 5,14 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

/**
 * A waveform that grows — the same bar rhythm as WaveformDivider, but the
 * loudest peaks sprout a small leaf. Sound and growth from one motif.
 */
export function GrowthDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex h-16 items-end gap-1 ${className}`} aria-hidden="true">
      {BAR_HEIGHTS.map((barHeight, i) => {
        const isMarigold = i % 2 === 0;
        return (
          <div key={i} className="relative flex-1">
            {SPROUT_AT.has(i) && (
              <Leaf
                flip={i % 4 >= 2}
                color={isMarigold ? "text-periwinkle-300" : "text-marigold-300"}
                delay={i * 120}
              />
            )}
            <div
              style={{ height: `${barHeight * 1.7}px`, animationDelay: `${i * 30}ms` }}
              className={`animate-grow-y rounded-full ${isMarigold ? "bg-marigold-400" : "bg-periwinkle-400"}`}
            />
          </div>
        );
      })}
    </div>
  );
}
