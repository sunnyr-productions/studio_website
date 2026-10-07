import "server-only";
import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";
import {
  budgetOptions,
  experienceOptions,
  labelFor,
  lessonFormatOptions,
  lessonTopicOptions,
  serviceOptions,
} from "@/content/inquiry";

/**
 * Sender address. Resend's shared `onboarding@resend.dev` only delivers to the
 * Resend account owner — fine for contact-form notifications, but customer
 * download emails need an address on a domain verified in Resend. Set
 * RESEND_FROM_EMAIL (e.g. "hello@yourdomain.com") once the domain is verified.
 */
const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";

/** A validated contact-form submission (see src/app/api/contact/route.ts). */
export type ContactSubmission = {
  name: string;
  email: string;
  service: string;
  message: string;
  lessonTopic?: string;
  lessonFormat?: string;
  experience?: string;
  songCount?: number;
  deadline?: string;
  budget?: string;
  referenceUrl?: string;
  filesUrl?: string;
};

/** Plain-text inquiry summary: the details block first, then the message. */
function formatInquiry(s: ContactSubmission): string {
  const details: [string, string | number | undefined][] = [
    ["Service", labelFor(serviceOptions, s.service)],
    ["Lesson", labelFor(lessonTopicOptions, s.lessonTopic)],
    ["Format", labelFor(lessonFormatOptions, s.lessonFormat)],
    ["Experience", labelFor(experienceOptions, s.experience)],
    ["Songs", s.songCount],
    ["Deadline", s.deadline],
    ["Budget", labelFor(budgetOptions, s.budget)],
    ["Reference", s.referenceUrl],
    ["Files", s.filesUrl],
  ];
  const lines = details
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([label, value]) => `${label}: ${value}`);

  return [`From: ${s.name} <${s.email}>`, ...lines, "", s.message].join("\n");
}

export async function sendContactNotification(submission: ContactSubmission) {
  const { name, email, service } = submission;
  const to = process.env.CONTACT_FORM_TO_EMAIL;
  if (!to || !process.env.RESEND_API_KEY) {
    throw new Error("Resend is not configured (missing RESEND_API_KEY or CONTACT_FORM_TO_EMAIL)");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: `${siteConfig.name} Website <${FROM_ADDRESS}>`,
    to,
    replyTo: email,
    subject: `[${labelFor(serviceOptions, service)}] New inquiry from ${name}`,
    text: formatInquiry(submission),
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
