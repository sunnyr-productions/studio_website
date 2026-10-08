import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Checkout canceled",
  robots: { index: false, follow: false },
};

export default function StoreCancelPage() {
  return (
    <Section pattern="dots" space="page" className="text-center">
      <h1 className="font-display text-3xl font-semibold text-ink-900">Checkout canceled</h1>
      <p className="mx-auto mt-3 max-w-md text-ink-700">
        No charge was made. Your cart is still waiting whenever you&apos;re ready.
      </p>
      <div className="mt-8">
        <Button href="/store">Back to store</Button>
      </div>
    </Section>
  );
}
