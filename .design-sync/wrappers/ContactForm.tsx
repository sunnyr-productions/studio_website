// design-sync-only variant of src/components/ContactForm.tsx.
// Only change: imports the design-sync Button wrapper (plain anchor, no
// next/link) instead of the real one, so the shared bundle doesn't crash.
// Everything else is identical to production.
"use client";

import { useState, type FormEvent } from "react";
import { Button } from "./Button";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="rounded-2xl bg-periwinkle-50 p-6 text-periwinkle-800">
        Thanks for reaching out! I&apos;ll get back to you within a couple of days.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-ink-900">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 w-full rounded-xl border border-ink-900/15 bg-cream-50 px-4 py-3 text-ink-900 focus:border-marigold-500 focus:outline-none focus:ring-2 focus:ring-marigold-200"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-ink-900">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-xl border border-ink-900/15 bg-cream-50 px-4 py-3 text-ink-900 focus:border-marigold-500 focus:outline-none focus:ring-2 focus:ring-marigold-200"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-ink-900">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-1 w-full rounded-xl border border-ink-900/15 bg-cream-50 px-4 py-3 text-ink-900 focus:border-marigold-500 focus:outline-none focus:ring-2 focus:ring-marigold-200"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-700">
          Something went wrong sending your message — please try again or email directly.
        </p>
      )}

      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
