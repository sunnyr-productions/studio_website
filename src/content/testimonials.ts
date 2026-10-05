export type Testimonial = {
  quote: string;
  /** Attribution — a real name or a first-name + initial is fine. */
  name: string;
  /** Optional role/context, e.g. "Artist" or "Guitar student". */
  role?: string;
  accent: "marigold" | "periwinkle";
};

/**
 * Real testimonials only. The homepage "What people say" section renders
 * *only* when this array has entries (see app/page.tsx), so nothing
 * placeholder ever ships — the section simply stays hidden until there's real
 * praise to show. Add clients here as permission comes in.
 */
export const testimonials: Testimonial[] = [];

/* Template for a new entry — copy into the array above:
  {
    quote:
      "Turned my messy home recordings into something that actually sounds professional.",
    name: "First L.",
    role: "Artist",
    accent: "marigold",
  },
*/
