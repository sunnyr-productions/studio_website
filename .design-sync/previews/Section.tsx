import { Section } from "../../src/components/ui/Section";

export function DotsPattern() {
  return (
    <Section pattern="dots" className="bg-cream-50">
      <h2 className="font-display text-2xl font-semibold text-ink-900">
        Let&apos;s make your sound a little sunnier.
      </h2>
      <p className="mt-3 max-w-md text-ink-700">
        Patient, student-led lessons in guitar, voice, production, and audio engineering.
      </p>
    </Section>
  );
}

export function WaveformPattern() {
  return (
    <Section pattern="waveform" className="bg-cream-100">
      <h2 className="font-display text-2xl font-semibold text-ink-900">Lessons</h2>
      <p className="mt-2 max-w-md text-ink-700">Guitar, voice, production, and engineering.</p>
    </Section>
  );
}

export function NoPattern() {
  return (
    <Section className="bg-cream-50">
      <h2 className="font-display text-2xl font-semibold text-ink-900">Recent work</h2>
      <p className="mt-2 max-w-md text-ink-700">Sample mixes and masters, straight from the studio.</p>
    </Section>
  );
}
