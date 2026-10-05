import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { getProductBySlug } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";

const checkoutSchema = z.object({
  productSlug: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const product = getProductBySlug(parsed.data.productSlug);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // siteConfig.url strips any trailing slash; fall back to the request origin
  // only when the env var is unset (local dev / preview deploys).
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ? siteConfig.url : new URL(request.url).origin;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: product.priceId, quantity: 1 }],
      success_url: `${siteUrl}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/store/cancel`,
      metadata: { productSlug: product.slug },
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL");
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Failed to create checkout session", error);
    return NextResponse.json({ error: "Failed to start checkout" }, { status: 502 });
  }
}
