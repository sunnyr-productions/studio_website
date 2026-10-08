import "server-only";
import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";
import { lessonPricing, trialPhrase } from "@/content/lessons";
import { studioTerms } from "@/content/services";
import {
  LESSON_SERVICE,
  budgetOptions,
  experienceOptions,
  isStudioService,
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
const CUSTOM_FROM = process.env.RESEND_FROM_EMAIL?.trim();
const FROM_ADDRESS = CUSTOM_FROM || "onboarding@resend.dev";

type EmailOptions = Parameters<Resend["emails"]["send"]>[0];

/**
 * Sends one email and throws if Resend reports a failure. The SDK *returns*
 * `{ error }` instead of throwing, so without this check a rejected send
 * (bad key, unverified sender, rate limit) would look like a success.
 */
async function sendEmail(options: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Resend is not configured (missing RESEND_API_KEY)");
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send(options);
  if (error) {
    throw new Error(`Resend rejected the email: ${error.name} — ${error.message}`);
  }
}

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
  if (!to) {
    throw new Error("Contact form is not configured (missing CONTACT_FORM_TO_EMAIL)");
  }

  await sendEmail({
    from: `${siteConfig.name} Website <${FROM_ADDRESS}>`,
    to,
    replyTo: email,
    subject: `[${labelFor(serviceOptions, service)}] New inquiry from ${name}`,
    text: formatInquiry(submission),
  });
}

/**
 * A greeting name safe to echo back: a single plain first name, or nothing.
 * The auto-reply goes to whatever address was typed into the form, so it must
 * not carry visitor-written text — otherwise the form could be used to send
 * arbitrary content (links, spam) to strangers from the studio's domain.
 */
function safeFirstName(name: string): string | null {
  const first = name.trim().split(/\s+/)[0] ?? "";
  return /^[\p{L}][\p{L}'’-]{0,29}$/u.test(first) ? first : null;
}

/** What happens next, by door — fixed copy only (see safeFirstName). */
function nextSteps(service: string): string {
  if (service === LESSON_SERVICE) {
    return [
      `Most students start with ${trialPhrase}. I'll reply with a few open times for it.`,
      `Lessons are paid in person by ${lessonPricing.paymentMethods}.`,
    ].join(" ");
  }
  if (isStudioService(service)) {
    return [
      "I'll listen to anything you linked and send back a written, itemized quote.",
      `Projects are booked with a ${studioTerms.depositPercent}% deposit, with the balance due before final delivery.`,
    ].join(" ");
  }
  return "I'll read through your message and point you in the right direction.";
}

/**
 * Confirmation sent to the person who filled in the form. Only sent once a
 * verified sender (RESEND_FROM_EMAIL) is set: Resend's shared test address can
 * only deliver to the account owner, so it would just fail for everyone else.
 * Returns whether an email was attempted.
 */
export async function sendInquiryConfirmation(submission: ContactSubmission): Promise<boolean> {
  if (!CUSTOM_FROM) return false;

  const firstName = safeFirstName(submission.name);
  const serviceLabel = labelFor(serviceOptions, submission.service);
  const text = [
    firstName ? `Hi ${firstName},` : "Hi there,",
    "",
    `Thanks for reaching out to ${siteConfig.name}! Your message about ${serviceLabel?.toLowerCase()} came through, and I'll get back to you within ${siteConfig.responseTime}.`,
    "",
    nextSteps(submission.service),
    "",
    "If you think of anything else in the meantime, just reply to this email.",
    "",
    "Talk soon,",
    "Raul",
    siteConfig.name,
    siteConfig.motto,
    "",
    "(You're getting this because this address was entered in the contact form at",
    `${siteConfig.url}. If that wasn't you, you can ignore this. Nothing else will be sent.)`,
  ].join("\n");

  await sendEmail({
    from: `${siteConfig.name} <${FROM_ADDRESS}>`,
    to: submission.email,
    replyTo: siteConfig.email,
    subject: `Got your message | ${siteConfig.name}`,
    text,
  });
  return true;
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
  await sendEmail({
    from: `${siteConfig.name} <${FROM_ADDRESS}>`,
    to,
    subject: `Your download: ${productName}`,
    text: `Thanks for your purchase!\n\n${productName}\n\nDownload link (expires in 48 hours):\n${downloadUrl}`,
  });
}
