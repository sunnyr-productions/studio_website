import { Card } from "../../src/components/ui/Card";

export function Marigold() {
  return (
    <Card accent="marigold" className="max-w-sm">
      <h3 className="font-display text-lg font-semibold text-ink-900">Voice Lessons</h3>
      <p className="mt-2 text-sm text-ink-700">
        Patient, student-led coaching for beginners through gigging vocalists.
      </p>
    </Card>
  );
}

export function Periwinkle() {
  return (
    <Card accent="periwinkle" className="max-w-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-periwinkle-700">Stems</p>
      <h3 className="mt-2 font-display text-lg font-semibold text-ink-900">
        &quot;Midnight Drive&quot; Full Stems
      </h3>
      <p className="mt-4 text-sm font-semibold text-marigold-800">$25.00</p>
    </Card>
  );
}

export function NoAccent() {
  return (
    <Card className="max-w-sm">
      <p className="text-ink-700">
        &ldquo;Turned my messy home recordings into something that actually sounds
        professional.&rdquo;
      </p>
      <p className="mt-4 text-sm font-semibold text-ink-900">— Placeholder Client, Artist</p>
    </Card>
  );
}
