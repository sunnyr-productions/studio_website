import { studioTerms } from "@/content/services";

/**
 * Long-form copy for each /studio/[slug] page. Keyed by the slug in
 * services.ts, which still owns the name, blurb, details and price.
 *
 * DRAFT: written from facts already stated elsewhere on the site (prices,
 * revisions, deposit, turnaround, delivery). Raul to review and put it in his
 * own words; add real before/after audio via `example` once item 1.3 lands.
 */
export type ServicePage = {
  /** H1 pattern: "<Service> in Corvallis, OR (and remote)". */
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** Lowest price in USD, for structured data. */
  minPrice: number;
  /** What the client sends. */
  youSend: string[];
  /** What the client gets back. */
  youGet: string[];
  process: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  /** Quote-form service value, so the CTA preselects it. */
  formValue: string;
};

const deposit = `${studioTerms.depositPercent}% up front holds your spot; the rest is due before I send final files.`;

export const servicePages: Record<string, ServicePage> = {
  mixing: {
    h1: "Mixing in Corvallis, OR (and remote)",
    metaTitle: "Song Mixing in Corvallis, OR (and Remote)",
    metaDescription:
      "Mixing from $175/song in Corvallis, Oregon or remotely. Checked on monitors, headphones, and everyday speakers, with two revision rounds included.",
    intro:
      "You send me the raw tracks and I send back a mix that’s balanced, punchy, and sounds right on any speaker. I check every mix on studio monitors, good headphones, and the kind of everyday speakers people really listen on.",
    minPrice: 175,
    youSend: [
      "Your tracks as WAV files, all starting at the same point so they line up",
      "A rough mix or a reference song or two, if you have them",
      "Notes on what you like, what bugs you, and any deadline",
    ],
    youGet: [
      "A finished mix as WAV and streaming-ready MP3",
      "Two rounds of revisions, included in the price",
      "Tidy session files at the end, in case you want them later",
    ],
    process: [
      { title: "Tell me about it", body: "Send the song details and a link to the tracks. I’ll listen and ask anything I need." },
      { title: "Get a quote", body: `You get a fixed price and a timeline before anything starts. ${deposit}` },
      { title: "Mix, tweak, release", body: "I send a mix, you send notes, and we go two rounds. A single mix usually takes me about a week." },
    ],
    faqs: [
      { q: "How many tracks can a session have?", a: "Up to 48 tracks per session. If your song is bigger than that, tell me and I’ll quote it separately." },
      { q: "Can I send a reference song?", a: "Please do. Knowing what you’re going for helps me get there faster." },
      { q: "Do you mix remotely?", a: "Yes. Most of my mixing is done from tracks you send, from anywhere." },
      { q: "Should I get it mastered too?", a: "Usually, if you’re releasing it. The mixing + mastering bundle saves a little over booking them separately." },
    ],
    formValue: "mixing",
  },
  mastering: {
    h1: "Mastering in Corvallis, OR (and remote)",
    metaTitle: "Audio Mastering in Corvallis, OR (and Remote)",
    metaDescription:
      "Mastering from $60/track in Corvallis, Oregon or remotely. Streaming-ready loudness, even tone, and tracks that sit together on an EP or album.",
    intro:
      "Mastering is the last step before release. I bring the loudness up to where it should be, even out the tone, and make sure every track on a release sits together.",
    minPrice: 60,
    youSend: [
      "Your finished mix as a WAV file, with some headroom left (don’t clip it)",
      "A reference track, if you want me to match a sound",
      "Where it’s going: streaming, vinyl, a video, anything specific",
    ],
    youGet: [
      "The mastered track as WAV and streaming-ready MP3",
      "For an EP or album, tracks that work together as a set",
    ],
    process: [
      { title: "Tell me about it", body: "Send a link to your mix and how many tracks there are." },
      { title: "Get a quote", body: `You get a price and timeline first. ${deposit}` },
      { title: "Master and release", body: "I send the master, you listen on your usual speakers, and we adjust if anything’s off." },
    ],
    faqs: [
      { q: "Single track or a whole EP?", a: "Either. Single tracks start at $60; for an EP or album I’ll quote the set." },
      { q: "How loud will it be?", a: "Loud enough to hold up next to other releases without squashing the life out of it. My post on LUFS explains how I think about it." },
      { q: "Do I need a mixing first?", a: "Mastering works on a finished mix. If it isn’t there yet, start with mixing." },
    ],
    formValue: "mastering",
  },
  recording: {
    h1: "Recording Sessions in Corvallis, OR (and remote)",
    metaTitle: "Recording Studio Sessions in Corvallis, OR",
    metaDescription:
      "Record vocals or instruments at a sound-treated studio in Corvallis, Oregon from $75/hour, or record at home while I direct the session over video.",
    intro:
      "Come record vocals or instruments at the studio. We track one or two parts at a time and build the song up in layers, and I run the session so you can just play.",
    minPrice: 75,
    youSend: [
      "What you want to record and roughly how many parts",
      "Any demo, click track, or reference that shows the direction",
      "Your preferred dates",
    ],
    youGet: [
      "Your takes, recorded and organized by me",
      "Session files delivered the same week",
    ],
    process: [
      { title: "Tell me about it", body: "Tell me what you’re recording and when." },
      { title: "Get a quote", body: `Hourly or day-rate blocks, quoted up front. ${deposit}` },
      { title: "Record", body: "Come to the studio in Corvallis, or record at home while I direct and engineer over video." },
    ],
    faqs: [
      { q: "Where is the studio?", a: "In Southtown, Corvallis, with free street parking nearby. I send the exact address when you book." },
      { q: "Can I record at home instead?", a: "Yes. You record, and I direct and engineer the take over video." },
      { q: "Can you mix it afterward?", a: "Happily. Mixing and mastering are quoted separately, or together as a bundle." },
    ],
    formValue: "recording",
  },
  consultation: {
    h1: "Production Consultation (online, from Corvallis, OR)",
    metaTitle: "Music Production Consultation",
    metaDescription:
      "A 60-minute video call going through your project: a stuck mix, an arrangement that isn't working, or a second opinion. $60 per session.",
    intro:
      "An hour on a call, going through your project together. It’s good for a stuck mix, an arrangement that isn’t working, or a second opinion before you commit to a full mix.",
    minPrice: 60,
    youSend: ["A link to the song or session", "A few lines on what’s bothering you"],
    youGet: ["A 60-minute video call", "Written notes and a marked-up session follow-up"],
    process: [
      { title: "Tell me about it", body: "Send the project and what you want out of the hour." },
      { title: "Book it", body: "I’ll quote and schedule the call." },
      { title: "Talk it through", body: "We go through it together and you leave with notes you can act on." },
    ],
    faqs: [
      { q: "Is it just for mixing?", a: "No. Arrangement, sound choices, and “is this ready?” questions all fit." },
      { q: "Can it lead to a full mix?", a: "Yes, and it’s a good way to find out whether we work well together first." },
    ],
    formValue: "consultation",
  },
  "mix-master-bundle": {
    h1: "Mixing + Mastering in Corvallis, OR (and remote)",
    metaTitle: "Mixing + Mastering Bundle in Corvallis, OR",
    metaDescription:
      "Mixing and mastering together from $210/song: the same ears from raw tracks to final master. Corvallis, Oregon and remote.",
    intro:
      "Book mixing and mastering together and save a little. The same ears stay on your song from raw tracks to final master, which is a good default for a single or EP release.",
    minPrice: 210,
    youSend: ["Your raw tracks as WAV files", "A reference song or two", "Your release date, if you have one"],
    youGet: [
      "A finished mix and master as WAV and streaming-ready MP3",
      "Two rounds of revisions on the mix",
      "Tidy session files at the end",
    ],
    process: [
      { title: "Tell me about it", body: "Send the song details and a link to the tracks." },
      { title: "Get a quote", body: `One fixed price for both steps. ${deposit}` },
      { title: "Mix, master, release", body: "Mix first, two rounds of notes, then the master." },
    ],
    faqs: [
      { q: "How much do I save?", a: "Starting at $210 a song, versus $235 booking mixing and mastering separately." },
      { q: "Can I add a mastering pass to a mix I already did?", a: "Yes, that’s just mastering, and it starts at $60 a track." },
    ],
    formValue: "mix-master-bundle",
  },
};
