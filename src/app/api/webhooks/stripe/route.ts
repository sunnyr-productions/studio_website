import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getProductBySlug } from "@/lib/products";
import { createSignedDownloadUrl } from "@/lib/blob";
import { sendDownloadEmail } from "@/lib/email";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!webhookSecret || !signature) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const productSlug = session.metadata?.productSlug;
    const email = session.customer_details?.email;

    const product = productSlug ? getProductBySlug(productSlug) : undefined;

    if (product && email) {
      try {
        const downloadUrl = await createSignedDownloadUrl(product.fileKey);
        await sendDownloadEmail({ to: email, productName: product.name, downloadUrl });
      } catch (error) {
        console.error("Failed to fulfill order", { productSlug, email, error });
        // Non-2xx tells Stripe to retry delivery (with backoff, for up to 3
        // days), so a transient email/blob failure doesn't strand a paid order.
        return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 });
      }
    } else {
      console.error("Webhook missing product or email", { productSlug, email });
    }
  }

  return NextResponse.json({ received: true });
}
