import { WaveformPlayer } from "@/components/audio/WaveformPlayer";
import type { PortfolioTrack } from "@/content/portfolio/tracks";

export function PortfolioTrackList({ tracks }: { tracks: PortfolioTrack[] }) {
  return (
    <div className="space-y-4">
      {tracks.map((track) => (
        <WaveformPlayer
          key={track.slug}
          title={track.title}
          subtitle={`${track.role} · ${track.artist}`}
          audioUrl={track.audioUrl}
        />
      ))}
    </div>
  );
}
