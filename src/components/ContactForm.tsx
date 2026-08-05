"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

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
      <p
        style={{ borderRadius: "var(--radius-sketch)" }}
        className="animate-fade-up border-[1.5px] border-periwinkle-300 bg-periwinkle-50 p-6 text-periwinkle-800"
      >
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
          style={{ borderRadius: "var(--radius-sketch-sm)" }}
          className="mt-1 w-full border border-ink-900/20 bg-cream-50 px-4 py-3 text-ink-900 transition-all duration-200 focus:border-marigold-500 focus:outline-none focus:ring-2 focus:ring-marigold-200"
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
          style={{ borderRadius: "var(--radius-sketch-sm)" }}
          className="mt-1 w-full border border-ink-900/20 bg-cream-50 px-4 py-3 text-ink-900 transition-all duration-200 focus:border-marigold-500 focus:outline-none focus:ring-2 focus:ring-marigold-200"
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
          style={{ borderRadius: "var(--radius-sketch-sm)" }}
          className="mt-1 w-full border border-ink-900/20 bg-cream-50 px-4 py-3 text-ink-900 transition-all duration-200 focus:border-marigold-500 focus:outline-none focus:ring-2 focus:ring-marigold-200"
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
