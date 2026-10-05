const BAR_HEIGHTS = [4, 10, 18, 26, 34, 22, 30, 14, 8, 20, 36, 24, 12, 6, 16, 28, 32, 18, 10, 4];

export function WaveformDivider({ className = "" }: { className?: string }) {
  const barWidth = 4;
  const gap = 4;
  const width = BAR_HEIGHTS.length * (barWidth + gap);
  const height = 40;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={`h-10 w-full ${className}`}
      aria-hidden="true"
    >
      {BAR_HEIGHTS.map((barHeight, i) => (
        <rect
          key={i}
          x={i * (barWidth + gap)}
          y={(height - barHeight) / 2}
          width={barWidth}
          height={barHeight}
          rx={barWidth / 2}
          style={{ transformBox: "fill-box", transformOrigin: "center", animationDelay: `${i * 30}ms` }}
          className={`animate-grow-y ${i % 2 === 0 ? "fill-marigold-400" : "fill-periwinkle-400"}`}
        />
      ))}
    </svg>
  );
}
