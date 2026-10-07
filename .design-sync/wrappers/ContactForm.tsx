// design-sync-only variant of src/components/ContactForm.tsx.
// Changes from production, all to keep Next.js internals out of the shared
// bundle: imports the design-sync Button wrapper (plain anchor, no next/link),
// renders the privacy link as a plain <a>, and omits ContactFormFromUrl
// (next/navigation). Everything else is identical — regenerate from
// production whenever the real form changes.
"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { Button } from "./Button";
import { useStudioMode } from "@/lib/use-studio-mode";
import {
  LESSON_SERVICE,
  budgetOptions,
  experienceOptions,
  isStudioService,
  lessonFormatOptions,
  lessonTopicOptions,
  serviceOptions,
  type InquiryOption,
} from "@/content/inquiry";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "mt-1 w-full border border-ink-900/20 bg-cream-50 px-4 py-3 text-ink-900 transition-all duration-200 focus:border-marigold-500 focus:outline-none focus:ring-2 focus:ring-marigold-200";
const inputStyle = { borderRadius: "var(--radius-sketch-sm)" };

function Field({
  id,
  label,
  hint,
  optional = false,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink-900">
        {label}
        {optional && <span className="font-normal text-ink-500"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-0.5 text-xs text-ink-500">
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

function Select({
  id,
  options,
  required = false,
  placeholder = "Choose one",
  value,
  onChange,
}: {
  id: string;
  options: InquiryOption[];
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  // Controlled when the parent tracks the value (the service picker), plain
  // uncontrolled otherwise.
  const control =
    value !== undefined
      ? { value, onChange: (e: ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value) }
      : { defaultValue: "" };

  return (
    <select
      id={id}
      name={id}
      required={required}
      style={inputStyle}
      className={inputClass}
      {...control}
    >
      <option value="" disabled={required}>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** Reads a text-like field; empty strings become undefined so the server can skip them. */
function read(form: HTMLFormElement, name: string): string | undefined {
  const el = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;
  const value = el?.value.trim();
  return value ? value : undefined;
}

/**
 * Inquiry form for both doors. Picking a service reveals the fields that
 * matter for it — lesson details, or project scope (songs, deadline, budget,
 * reference and stems links) — so a quote can go out without a round of
 * follow-up questions.
 *
 * `initialService` comes from `/contact?service=<value>` (see the Suspense
 * wrapper on the contact page); without it, the form defaults to Lessons for
 * visitors on the lessons door and asks studio visitors to choose.
 */
export function ContactForm({ initialService }: { initialService?: string | null }) {
  const [status, setStatus] = useState<Status>("idle");
  const mode = useStudioMode();
  const [pickedService, setPickedService] = useState<string | null>(null);
  const presetIsValid = serviceOptions.some((o) => o.value === initialService);
  const service =
    pickedService ??
    (presetIsValid ? (initialService as string) : mode === "lessons" ? LESSON_SERVICE : "");
  const isLesson = service === LESSON_SERVICE;
  const isStudio = isStudioService(service);

  // When the form was first rendered — lets the server reject submissions that
  // arrive implausibly fast (a human can't fill these fields in under a couple
  // seconds; a bot fires instantly). Pairs with the hidden honeypot below.
  // Set in an effect (not during render) to keep the component pure.
  const mountedAtRef = useRef<number | null>(null);
  useEffect(() => {
    mountedAtRef.current = Date.now();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const songCount = read(form, "songCount");
    const data = {
      name: read(form, "name"),
      email: read(form, "email"),
      service,
      message: read(form, "message"),
      // Only the fields visible for the chosen service are rendered, so the
      // rest read as undefined and are omitted from the payload.
      lessonTopic: read(form, "lessonTopic"),
      lessonFormat: read(form, "lessonFormat"),
      experience: read(form, "experience"),
      songCount: songCount ? Number(songCount) : undefined,
      deadline: read(form, "deadline"),
      budget: read(form, "budget"),
      referenceUrl: read(form, "referenceUrl"),
      filesUrl: read(form, "filesUrl"),
      // Honeypot: real users never see or fill this; bots that autofill every
      // field will. A filled value is silently dropped server-side.
      company: read(form, "company"),
      // undefined until the mount effect has run (effectively always set by the
      // time a human submits); the server treats a missing value as "not fast".
      elapsedMs: mountedAtRef.current != null ? Date.now() - mountedAtRef.current : undefined,
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
        role="status"
        style={{ borderRadius: "var(--radius-sketch)" }}
        className="animate-fade-up border-[1.5px] border-periwinkle-300 bg-periwinkle-50 p-6 text-periwinkle-800"
      >
        Thanks for reaching out! I&apos;ll get back to you within a couple of days.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot — hidden from people (offscreen, not focusable, not
          announced) but present in the DOM for form-filling bots to trip. Kept
          out of the tab order and autofill. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company (leave this blank)</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Name">
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            style={inputStyle}
            className={inputClass}
          />
        </Field>
        <Field id="email" label="Email">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            style={inputStyle}
            className={inputClass}
          />
        </Field>
      </div>

      <Field id="service" label="What can I help with?">
        <Select
          id="service"
          options={serviceOptions}
          required
          value={service}
          onChange={setPickedService}
        />
      </Field>

      {isLesson && (
        <fieldset className="animate-fade-up grid gap-5 sm:grid-cols-3">
          <legend className="sr-only">Lesson details</legend>
          <Field id="lessonTopic" label="Lesson" optional>
            <Select id="lessonTopic" options={lessonTopicOptions} />
          </Field>
          <Field id="lessonFormat" label="Format" optional>
            <Select id="lessonFormat" options={lessonFormatOptions} />
          </Field>
          <Field id="experience" label="Experience" optional>
            <Select id="experience" options={experienceOptions} />
          </Field>
        </fieldset>
      )}

      {isStudio && (
        <fieldset className="animate-fade-up space-y-5">
          <legend className="sr-only">Project details</legend>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field id="songCount" label="Songs" optional>
              <input
                id="songCount"
                name="songCount"
                type="number"
                inputMode="numeric"
                min={1}
                max={100}
                style={inputStyle}
                className={inputClass}
              />
            </Field>
            <Field id="deadline" label="Deadline" optional>
              <input
                id="deadline"
                name="deadline"
                type="text"
                placeholder="e.g. mid-November"
                maxLength={100}
                style={inputStyle}
                className={inputClass}
              />
            </Field>
            <Field id="budget" label="Budget" optional>
              <Select id="budget" options={budgetOptions} />
            </Field>
          </div>
          <Field
            id="referenceUrl"
            label="Reference track"
            hint="A Spotify, YouTube, or SoundCloud link to the sound you're chasing."
            optional
          >
            <input
              id="referenceUrl"
              name="referenceUrl"
              type="url"
              placeholder="https://"
              aria-describedby="referenceUrl-hint"
              style={inputStyle}
              className={inputClass}
            />
          </Field>
          <Field
            id="filesUrl"
            label="Your files"
            hint="A Dropbox, Google Drive, or WeTransfer link to your rough mix or stems. Not ready yet? Leave it blank."
            optional
          >
            <input
              id="filesUrl"
              name="filesUrl"
              type="url"
              placeholder="https://"
              aria-describedby="filesUrl-hint"
              style={inputStyle}
              className={inputClass}
            />
          </Field>
        </fieldset>
      )}

      <Field id="message" label={isStudio ? "Tell me about the project" : "Message"}>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          maxLength={5000}
          style={inputStyle}
          className={inputClass}
        />
      </Field>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-700">
          Something went wrong sending your message — please try again or email directly.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send message"}
        </Button>
        <p className="text-xs text-ink-500">
          Your details are only used to reply to you —{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-marigold-600">
            privacy policy
          </a>
          .
        </p>
      </div>
    </form>
  );
}

