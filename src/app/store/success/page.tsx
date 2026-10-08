import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getStripe } from "@/lib/stripe";
import { getProductBySlug } from "@/lib/products";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default async function StoreSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  let paid = false;
  let email: string | null = null;
  let productName: string | null = null;

  if (sessionId) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid";
      email = session.customer_details?.email ?? null;
      const productSlug = session.metadata?.productSlug;
      productName = productSlug ? (getProductBySlug(productSlug)?.name ?? null) : null;
    } catch (error) {
      console.error("Failed to retrieve checkout session", error);
    }
  }

  return (
    <Section pattern="dots" space="page" className="text-center">
      {paid ? (
        <>
          <h1 className="font-display text-3xl font-semibold text-ink-900">
            Thanks for your order!
          </h1>
          <Card accent="marigold" className="mx-auto mt-6 max-w-md text-left">
            {productName && (
              <p className="text-ink-900">
                <span className="font-semibold">Item:</span> {productName}
              </p>
            )}
            <p className="mt-2 text-ink-700">
              A download link is on its way to{" "}
              <span className="font-semibold">{email ?? "your email"}</span>. If it doesn&apos;t
              arrive in a few minutes, check spam or{" "}
              <Link href="/contact" className="text-marigold-800 underline">
                get in touch
              </Link>
              .
            </p>
          </Card>
        </>
      ) : (
        <>
          <h1 className="font-display text-3xl font-semibold text-ink-900">
            Order status unavailable
          </h1>
          <p className="mx-auto mt-3 max-w-md text-ink-700">
            We couldn&apos;t confirm this order right now. If you were just charged, check your
            email for a receipt, or{" "}
            <Link href="/contact" className="text-marigold-800 underline">
              reach out
            </Link>{" "}
            and we&apos;ll sort it out.
          </p>
        </>
      )}

      <div className="mt-8">
        <Button href="/store">Continue shopping</Button>
      </div>
    </Section>
  );
}
