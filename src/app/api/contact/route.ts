import { NextResponse } from "next/server";
import { z } from "zod";
import { isBot } from "@/lib/bot-check";
import { sendContactNotification, sendInquiryConfirmation } from "@/lib/email";
import {
  budgetOptions,
  experienceOptions,
  lessonFormatOptions,
  lessonTopicOptions,
  serviceOptions,
  values,
} from "@/content/inquiry";

// Minimum plausible time for a human to fill the form, in ms. Submissions
// faster than this are treated as bots.
const MIN_FILL_MS = 2000;

/** Optional free-text field: trimmed, capped, and "" treated as absent. */
const optionalText = (max: number) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().max(max).optional(),
  );

/** Optional http(s) link — blocks javascript:/data: URLs from reaching the inbox. */
const optionalUrl = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.url({ protocol: /^https?$/ }).max(2000).optional(),
);

const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email(),
  service: z.enum(values(serviceOptions)),
  message: z.string().trim().min(1).max(5000),
  // Lesson details
  lessonTopic: z.enum(values(lessonTopicOptions)).optional(),
  lessonFormat: z.enum(values(lessonFormatOptions)).optional(),
  experience: z.enum(values(experienceOptions)).optional(),
  // Project details
  songCount: z.number().int().min(1).max(100).optional(),
  deadline: optionalText(100),
  budget: z.enum(values(budgetOptions)).optional(),
  referenceUrl: optionalUrl,
  filesUrl: optionalUrl,
  // Anti-spam signals (optional so a schema tweak can't hard-break the form).
  // `company` is the honeypot; `elapsedMs` is time-to-submit from the client.
  company: z.string().max(200).optional(),
  elapsedMs: z.number().nonnegative().optional(),
});

export async function POST(request: Request) {
  // A flagged request gets a visible error (not the silent "ok" the traps
  // use): if BotID ever misjudges a real person, the form tells them to email
  // directly instead of swallowing their message.
  if (await isBot()) {
    return NextResponse.json({ error: "Request blocked" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const { company, elapsedMs, ...submission } = parsed.data;

  // Spam traps: a filled honeypot or an implausibly fast submit is dropped
  // silently — we return the same success shape so bots get no signal to adapt
  // to, but nothing is sent. (A future upgrade could add per-IP rate limiting
  // via Vercel KV / Upstash here.)
  const trippedHoneypot = !!company && company.trim().length > 0;
  const tooFast = typeof elapsedMs === "number" && elapsedMs < MIN_FILL_MS;
  if (trippedHoneypot || tooFast) {
    return NextResponse.json({ ok: true });
  }

  try {
    await sendContactNotification(submission);
  } catch (error) {
    console.error("Failed to send contact notification", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 502 });
  }

  // Courtesy auto-reply. The inquiry already reached the inbox, so a failure
  // here is logged rather than surfaced as a failed submission.
  try {
    await sendInquiryConfirmation(submission);
  } catch (error) {
    console.error("Failed to send inquiry confirmation", error);
  }

  return NextResponse.json({ ok: true });
}
