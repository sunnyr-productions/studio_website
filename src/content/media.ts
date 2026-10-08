import fs from "node:fs";
import path from "node:path";

/**
 * Photo slots. Each slot looks for a file in public/images at build time and
 * is simply absent from the page until that file exists, so nothing
 * placeholder ever ships. To fill a slot, drop a photo in public/images with
 * the slot's file name (.jpg, .jpeg, .png, or .webp) and redeploy (locally, just
 * reload the page):
 *
 *   hero-lessons   homepage hero, "Learn" door   (portrait or square works best)
 *   hero-studio    homepage hero, "Create" door  (portrait or square works best)
 *   studio-1..3    the room: About and Lessons   (landscape works best)
 *
 * Server-only (reads the filesystem): import it from pages, not client
 * components. Update the alt text below when the real photos go in.
 */
export type Photo = { src: string; alt: string };

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
    lessons: slot("hero-lessons", "Raul teaching a guitar lesson at The sunny*r Studio"),
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
