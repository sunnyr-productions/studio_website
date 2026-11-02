import fs from "node:fs";
import path from "node:path";
import type { StaticImageData } from "next/image";
import arenaImage from "../../public/images/arena.jpg";
import bandImage from "../../public/images/band.jpg";
import overlookImage from "../../public/images/overlook.jpg";
import polaroidImage from "../../public/images/polaroid-otr.jpg";
import portraitImage from "../../public/images/raul-portrait.jpg";
import stageGroupImage from "../../public/images/stage-group.jpg";
import stageSoloistsImage from "../../public/images/stage-soloists.jpg";
import stratBridgeImage from "../../public/images/strat-bridge.jpg";
import stratCaseImage from "../../public/images/strat-case.jpg";
import taylorImage from "../../public/images/taylor.jpg";
import voiceMicImage from "../../public/images/voice-mic.jpg";

export type Photo = {
  src: string | StaticImageData;
  alt: string;
  /** CSS object-position, for keeping the subject in frame when cropped. */
  position?: string;
};

/** The photo library, placed by hand on each page. Web copies, with metadata removed. */
export const media = {
  overlook: {
    src: overlookImage,
    alt: "Raul playing an acoustic guitar on a bench at a mountain overlook while someone sits on the path listening",
    position: "25% 100%",
  },
  stageSoloists: {
    src: stageSoloistsImage,
    alt: "On the Rocks singers in white shirts and suspenders performing against a glowing orange backdrop",
    position: "50% 12%",
  },
  stageGroup: {
    src: stageGroupImage,
    alt: "The full On the Rocks group singing on stage against a glowing orange backdrop",
  },
  portrait: {
    src: portraitImage,
    alt: "Raul, the teacher and engineer behind The sunny*r Studio, in a marigold sweater",
    position: "50% 30%",
  },
  stratCase: {
    src: stratCaseImage,
    alt: "A sunburst Fender Stratocaster in an open tweed case lined with red velvet",
  },
  stratBridge: {
    src: stratBridgeImage,
    alt: "Black-and-white close-up of the bridge and strings of a Stratocaster",
  },
  taylor: {
    src: taylorImage,
    alt: "A Taylor acoustic guitar with a marigold floral strap",
  },
  voiceMic: {
    src: voiceMicImage,
    alt: "Raul singing into a studio microphone in headphones, lit in purple",
    position: "50% 35%",
  },
  polaroid: {
    src: polaroidImage,
    alt: "Polaroid of On the Rocks in suspenders standing on a rocky hilltop at dusk",
  },
  band: {
    src: bandImage,
    alt: "A band in black with their instruments, on a white floor scattered with confetti",
  },
  arena: {
    src: arenaImage,
    alt: "On the Rocks standing at microphones on an arena floor, with a full crowd behind them",
  },
} satisfies Record<string, Photo>;

/**
 * Photo slots. Each slot looks for a file in public/images at build time and
 * is simply absent from the page until that file exists, so nothing
 * placeholder ever ships. To fill a slot, drop a photo in public/images with
 * the slot's file name (.jpg, .jpeg, .png, or .webp) and redeploy (locally, just
 * reload the page):
 *
 *   hero-lessons   homepage "I want to learn" card                 (portrait or square works best)
 *   hero-studio    homepage "I have a song" card, /studio hero     (portrait or square works best)
 *   studio-1..3    the room: About and Lessons                     (landscape works best)
 *
 * Server-only (reads the filesystem): import it from pages, not client
 * components. Update the alt text below when the real photos go in.
 */
const EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

function slot(name: string, alt: string): Photo | null {
  for (const ext of EXTENSIONS) {
    const file = `${name}.${ext}`;
    if (fs.existsSync(path.join(process.cwd(), "public", "images", file))) {
      return { src: `/images/${file}`, alt };
    }
  }
  return null;
}

/** Checked on each call so a newly added file shows up without a restart. */
export function getHeroPhotos() {
  return {
    lessons: slot("hero-lessons", "Raul playing an acoustic guitar on a bench on a mountain overlook"),
    studio: slot("hero-studio", "Raul mixing at the desk at The sunny*r Studio"),
  };
}

export function getStudioPhotos(): Photo[] {
  return [
    slot("studio-1", "The sunny*r Studio room in Corvallis, Oregon"),
    slot("studio-2", "Monitors and desk at The sunny*r Studio"),
    slot("studio-3", "Guitars and instruments at The sunny*r Studio"),
  ].filter((photo): photo is Photo => photo !== null);
}
