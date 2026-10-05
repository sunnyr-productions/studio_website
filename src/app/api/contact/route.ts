import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactNotification } from "@/lib/email";

// Minimum plausible time for a human to fill the form, in ms. Submissions
// faster than this are treated as bots.
const MIN_FILL_MS = 2000;

const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email(),
  message: z.string().trim().min(1).max(5000),
  // Anti-spam signals (optional so a schema tweak can't hard-break the form).
  // `company` is the honeypot; `elapsedMs` is time-to-submit from the client.
  company: z.string().max(200).optional(),
  elapsedMs: z.number().nonnegative().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const { name, email, message, company, elapsedMs } = parsed.data;

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
    await sendContactNotification({ name, email, message });
  } catch (error) {
    console.error("Failed to send contact notification", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
