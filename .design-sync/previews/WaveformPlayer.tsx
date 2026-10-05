import { WaveformPlayer } from "../../src/components/audio/WaveformPlayer";
import { SAMPLE_AUDIO_DATA_URL } from "./_sample-audio";

export function Default() {
  return (
    <div className="max-w-md">
      <WaveformPlayer
        title="Placeholder Track One"
        subtitle="Mixing · Placeholder Artist"
        audioUrl={SAMPLE_AUDIO_DATA_URL}
      />
    </div>
  );
}
