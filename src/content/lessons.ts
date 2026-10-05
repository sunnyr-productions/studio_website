export type LessonType = {
  slug: string;
  name: string;
  blurb: string;
  format: string;
  accent: "marigold" | "periwinkle";
  featured?: boolean;
};

export const lessonTypes: LessonType[] = [
  {
    slug: "vocal",
    name: "Vocal Lessons",
    blurb:
      "Technique, range, and performance confidence — drawing on years coaching a cappella singers through both the vocal and stage-presence side of things.",
    format: "In-person or online",
    accent: "marigold",
    featured: true,
  },
  {
    slug: "guitar",
    name: "Guitar Lessons",
    blurb:
      "From your first chords to writing your own songs, taught at whatever pace keeps it fun. 16 years of playing behind every lesson.",
    format: "Best in-person (hands-on technique is tough fully remote)",
    accent: "periwinkle",
  },
  {
    slug: "production",
    name: "Music Production / DAW Lessons",
    blurb:
      "Songwriting, beat-making, and arranging inside Ableton, Logic, or Pro Tools — plus whatever other instruments come up along the way.",
    format: "In-person or online",
    accent: "marigold",
  },
  {
    slug: "audio-engineering",
    name: "Audio Engineering / Recording Lessons",
    blurb:
      "Mixing, mic technique, and setting up a home studio that actually sounds good — backed by day-to-day engineering work in podcast production.",
    format: "In-person or online",
    accent: "periwinkle",
  },
];
