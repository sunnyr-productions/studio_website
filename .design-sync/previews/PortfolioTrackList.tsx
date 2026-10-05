import { PortfolioTrackList } from "../../src/components/audio/PortfolioTrackList";
import { SAMPLE_AUDIO_DATA_URL } from "./_sample-audio";

export function Default() {
  return (
    <div className="max-w-md">
      <PortfolioTrackList
        tracks={[
          {
            slug: "sample-mix-01",
            title: "Placeholder Track One",
            role: "Mixing",
            artist: "Placeholder Artist",
            audioUrl: SAMPLE_AUDIO_DATA_URL,
          },
          {
            slug: "sample-master-02",
            title: "Placeholder Track Two",
            role: "Mastering",
            artist: "Placeholder Artist",
            audioUrl: SAMPLE_AUDIO_DATA_URL,
          },
        ]}
      />
    </div>
  );
}
