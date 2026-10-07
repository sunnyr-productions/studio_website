/**
 * Contact-form choices, shared by the client form (src/components/ContactForm.tsx)
 * and the server validator (src/app/api/contact/route.ts) so both always agree.
 *
 * Studio service values match the slugs in src/content/services.ts, which lets
 * a service card link straight to `/contact?service=<slug>` with it preselected.
 */

export type InquiryOption = { value: string; label: string };

export const LESSON_SERVICE = "lessons";
export const OTHER_SERVICE = "other";

/** Studio-side values; picking one of these reveals the project fields. */
export const STUDIO_SERVICES = [
  "mixing",
  "mastering",
  "mix-master-bundle",
  "recording",
  "consultation",
] as const;

export const serviceOptions: InquiryOption[] = [
  { value: LESSON_SERVICE, label: "Lessons" },
  { value: "mixing", label: "Mixing" },
  { value: "mastering", label: "Mastering" },
  { value: "mix-master-bundle", label: "Mixing + mastering" },
  { value: "recording", label: "Recording session" },
  { value: "consultation", label: "Production consultation" },
  { value: OTHER_SERVICE, label: "Something else" },
];

export const lessonTopicOptions: InquiryOption[] = [
  { value: "guitar", label: "Guitar" },
  { value: "vocal", label: "Voice" },
  { value: "production", label: "Production / DAW" },
  { value: "audio-engineering", label: "Audio engineering / recording" },
  { value: "not-sure", label: "Not sure yet" },
];

export const lessonFormatOptions: InquiryOption[] = [
  { value: "in-person", label: "In person (Corvallis)" },
  { value: "online", label: "Online" },
  { value: "either", label: "Either works" },
];

export const experienceOptions: InquiryOption[] = [
  { value: "new", label: "Brand new" },
  { value: "some", label: "Some experience" },
  { value: "experienced", label: "Experienced / gigging" },
];

export const budgetOptions: InquiryOption[] = [
  { value: "under-200", label: "Under $200" },
  { value: "200-500", label: "$200 – $500" },
  { value: "500-1000", label: "$500 – $1,000" },
  { value: "1000-plus", label: "$1,000+" },
  { value: "not-sure", label: "Not sure yet" },
];

export const values = (options: InquiryOption[]) =>
  options.map((o) => o.value) as [string, ...string[]];

export const labelFor = (options: InquiryOption[], value: string | undefined) =>
  options.find((o) => o.value === value)?.label ?? value;

export const isStudioService = (value: string) =>
  (STUDIO_SERVICES as readonly string[]).includes(value);
