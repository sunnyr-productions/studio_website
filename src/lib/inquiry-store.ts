import "server-only";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import type { ContactSubmission } from "@/lib/email";

/**
 * Keeps every valid inquiry before any email is sent, so a Resend failure or a
 * spam-foldered notification can't lose a lead, and rate-limits submissions
 * per IP.
 *
 * Backed by Upstash Redis (Vercel Marketplace). It reads either the
 * integration's names (KV_REST_API_URL / KV_REST_API_TOKEN) or Upstash's own
 * (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN). With neither set
 * (local dev, or before the store is connected) everything here is a no-op and
 * the contact route behaves exactly as it did before.
 */

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

export const storeConfigured = redis !== null;

/** 5 submissions per IP per hour: plenty for a person, tight for a script. */
const limiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      prefix: "ratelimit:contact",
    })
  : null;

export type InquiryStatus = "received" | "notified" | "notify_failed";

export type StoredInquiry = ContactSubmission & {
  id: string;
  receivedAt: string;
  status: InquiryStatus;
};

/** True if this IP is over the limit. Fails open: a store outage never blocks a visitor. */
export async function isRateLimited(ip: string): Promise<boolean> {
  if (!limiter) return false;
  try {
    const { success } = await limiter.limit(ip);
    return !success;
  } catch (error) {
    console.error("Rate limiter unavailable", error);
    return false;
  }
}

/**
 * Saves the inquiry and returns its id, or null if nothing was stored (store
 * not configured, or the write failed, which is logged).
 */
export async function saveInquiry(submission: ContactSubmission): Promise<string | null> {
  if (!redis) return null;
  const id = crypto.randomUUID();
  const record: StoredInquiry = {
    ...submission,
    id,
    receivedAt: new Date().toISOString(),
    status: "received",
  };
  try {
    await redis.set(`inquiry:${id}`, record);
    // Index by time so inquiries can be listed newest-first in the Upstash console or a script.
    await redis.zadd("inquiries", { score: Date.now(), member: id });
    return id;
  } catch (error) {
    console.error("Failed to store inquiry", error);
    return null;
  }
}

/** Records whether the notification email went out. Best-effort. */
export async function markInquiry(id: string, status: InquiryStatus): Promise<void> {
  if (!redis) return;
  try {
    const record = await redis.get<StoredInquiry>(`inquiry:${id}`);
    if (record) await redis.set(`inquiry:${id}`, { ...record, status });
  } catch (error) {
    console.error("Failed to update inquiry status", error);
  }
}
