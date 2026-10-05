import "server-only";
import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";

/**
 * Sender address. Resend's shared `onboarding@resend.dev` only delivers to the
 * Resend account owner — fine for contact-form notifications, but customer
 * download emails need an address on a domain verified in Resend. Set
 * RESEND_FROM_EMAIL (e.g. "hello@yourdomain.com") once the domain is verified.
 */
const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";

export async function sendContactNotification({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  const to = process.env.CONTACT_FORM_TO_EMAIL;
  if (!to || !process.env.RESEND_API_KEY) {
    throw new Error("Resend is not configured (missing RESEND_API_KEY or CONTACT_FORM_TO_EMAIL)");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: `${siteConfig.name} Website <${FROM_ADDRESS}>`,
    to,
    replyTo: email,
    subject: `New contact form message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });
}

export async function sendDownloadEmail({
  to,
  productName,
  downloadUrl,
}: {
  to: string;
  productName: string;
  downloadUrl: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Resend is not configured (missing RESEND_API_KEY)");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: `${siteConfig.name} <${FROM_ADDRESS}>`,
    to,
    subject: `Your download: ${productName}`,
    text: `Thanks for your purchase!\n\n${productName}\n\nDownload link (expires in 48 hours):\n${downloadUrl}`,
  });
}
