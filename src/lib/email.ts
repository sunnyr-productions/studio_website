import "server-only";
import { Resend } from "resend";

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
    from: "Website Contact Form <onboarding@resend.dev>",
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
    from: "Raul Patel Audio <onboarding@resend.dev>",
    to,
    subject: `Your download: ${productName}`,
    text: `Thanks for your purchase!\n\n${productName}\n\nDownload link (expires in 48 hours):\n${downloadUrl}`,
  });
}
