// Makes the PNG versions of the logo. Run from the repo root, after build_logo.py:
//   node docs/logo/export_png.mjs <sun.svg>
import path from "node:path";
import sharp from "sharp";

const PAPER = "#fffdf7";
const [, , sunSvg] = process.argv;

(async () => {
  // Structured-data logo: the word centered on a 1200x630 card, as before.
  const word = await sharp("public/images/sunnyr-logo.svg", { density: 144 })
    .resize({ width: 960 })
    .png()
    .toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: PAPER } })
    .composite([{ input: word, gravity: "center" }])
    .png()
    .toFile("public/images/sunnyr-logo.png");

  // The icons are just the sun, on an opaque square since apple-icon requires one.
  for (const [name, width] of [["icon.png", 512], ["apple-icon.png", 180]]) {
    const out = path.join("src/app", name);
    const buffer = await sharp(sunSvg, { density: 300 })
      .resize(width, width)
      .flatten({ background: PAPER })
      .png()
      .toBuffer();
    await sharp(buffer).toFile(out);
    console.log(out, width);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
