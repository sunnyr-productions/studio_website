"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/Button";
import { PlusMinus } from "@/components/ui/PlusMinus";
import { siteConfig } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";
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

/**
 * Give up on a submission after this long. The request passes through the
 * BotID challenge first; if that ever stalls, the visitor gets the error
 * state (with the email fallback) instead of "Sending…" forever.
 */
const SUBMIT_TIMEOUT_MS = 20_000;

// Drawn fields with the sitewide focus ring (.field in globals.css).
const inputClass = "field";
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
 * wrapper on the contact page); without it, the visitor chooses.
 * Lesson links pass `?service=lessons`, service cards pass their slug.
 */
export function ContactForm({ initialService }: { initialService?: string | null }) {
  const [status, setStatus] = useState<Status>("idle");
  const [pickedService, setPickedService] = useState<string | null>(null);
  const presetIsValid = serviceOptions.some((o) => o.value === initialService);
  const service =
    pickedService ??
    (presetIsValid ? (initialService as string) : "");
  const isLesson = service === LESSON_SERVICE;
  const isStudio = isStudioService(service);
  // Mixing and mastering can't be quoted without hearing the song; recording
  // and consultations often have nothing to link yet.
  const needsFiles = ["mixing", "mastering", "mix-master-bundle"].includes(service);

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
      const res = await Promise.race([
        fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timed out")), SUBMIT_TIMEOUT_MS),
        ),
      ]);
      if (!res.ok) throw new Error("Request failed");
      trackEvent("Inquiry Sent", { service });
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
        className="animate-fade-up card card-periwinkle p-6 text-periwinkle-800"
      >
        Thanks! You’ll hear back within{" "}
        {isStudio ? siteConfig.responseTime.studio : siteConfig.responseTime.lessons}.
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
        <p
          style={inputStyle}
          className="animate-fade-up card card-marigold px-4 py-3 text-sm text-ink-700"
        >
          Or skip this and{" "}
          <Link
            href="/lessons#book"
            className="link-drawn"
          >
            book a trial on the calendar
          </Link>
          .
        </p>
      )}

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
          <Field
            id="filesUrl"
            label="Link to your song or project"
            hint="A Dropbox, Google Drive, WeTransfer or streaming link to your tracks or rough mix."
            optional={!needsFiles}
          >
            <input
              id="filesUrl"
              name="filesUrl"
              type="url"
              placeholder="https://"
              required={needsFiles}
              aria-describedby="filesUrl-hint"
              style={inputStyle}
              className={inputClass}
            />
          </Field>
        </fieldset>
      )}

      <Field
        id="message"
        label={
          isLesson
            ? "What do you want to learn?"
            : isStudio
              ? "Tell me about the song"
              : "What’s on your mind?"
        }
      >
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

      {isStudio && (
        <details className="unfold card px-5 py-4" style={inputStyle}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-ink-900 [&::-webkit-details-marker]:hidden">
            <span>
              Add details <span className="font-normal text-ink-500">(optional, but it helps me quote)</span>
            </span>
            <PlusMinus />
          </summary>
          <div className="unfold-body mt-5 space-y-5">
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
              hint="A Spotify, YouTube or SoundCloud link to a song with the sound you want."
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
          </div>
        </details>
      )}

      {status === "error" && (
        <p role="alert" className="text-sm text-red-700">
          That didn’t go through. Please try again, or email me at{" "}
          <a href={`mailto:${siteConfig.email}`} className="link-drawn">
            {siteConfig.email}
          </a>
          .
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send message"}
        </Button>
        <p className="text-xs text-ink-500">
          I’ll only use this to reply.{" "}
          <Link href="/privacy" className="link-drawn font-normal">
            Privacy policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

/**
 * ContactForm with `?service=` read from the URL. useSearchParams makes this
 * subtree client-rendered on a static page, so the contact page wraps it in
 * <Suspense> with a plain <ContactForm /> as the fallback — the form still
 * ships in the prerendered HTML, and the preselection applies on hydration.
 */
export function ContactFormFromUrl() {
  const initialService = useSearchParams().get("service");
  return <ContactForm initialService={initialService} />;
}
