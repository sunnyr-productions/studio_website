// Measures the header logo's real rendered contrast while scrolling.
// Needs the dev server on :3000. Run from anywhere:
//   node docs/logo/measure_contrast.mjs <extra-css-file|none> <out.json> [pages comma list] [steps]
import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs';

const [, , cssFile, out, pagesArg, stepsArg] = process.argv;
const css = cssFile === 'none' ? '' : fs.readFileSync(cssFile, 'utf8');
const PAGES = (pagesArg || '/,/lessons,/studio,/music,/about,/blog,/contact').split(',');
const STEPS = +(stepsArg || 24);

const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const toHex = c => '#' + c.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  const res = [];
  for (const path of PAGES) {
    await page.goto('http://localhost:3000' + path, { waitUntil: 'load' });
    await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' + css });
    await page.waitForTimeout(800);
    const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    for (let s = 0; s <= STEPS; s++) {
      await page.evaluate(v => window.scrollTo(0, v), Math.round(max * s / STEPS));
      await page.waitForTimeout(100);
      const box = await page.locator('header .logo-mark').boundingBox();
      const shown = await sharp(await page.screenshot({ clip: box })).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      await page.evaluate(() => document.querySelector('header .logo-mark').style.visibility = 'hidden');
      const hidden = await sharp(await page.screenshot({ clip: box })).removeAlpha().raw().toBuffer();
      await page.evaluate(() => document.querySelector('header .logo-mark').style.visibility = '');
      // Stroke cores are the pixels that differ most from the same pixel without the logo.
      const d = shown.data, h = hidden, px = [];
      for (let i = 0; i < d.length; i += 3) {
        px.push([Math.abs(d[i] - h[i]) + Math.abs(d[i + 1] - h[i + 1]) + Math.abs(d[i + 2] - h[i + 2]), i]);
      }
      px.sort((a, b) => b[0] - a[0]);
      const core = px.slice(0, Math.floor(px.length * 0.05));
      let fg = [0, 0, 0], bg = [0, 0, 0];
      for (const [, i] of core) {
        fg[0] += d[i]; fg[1] += d[i + 1]; fg[2] += d[i + 2];
        bg[0] += h[i]; bg[1] += h[i + 1]; bg[2] += h[i + 2];
      }
      fg = fg.map(v => v / core.length); bg = bg.map(v => v / core.length);
      const lf = lum(...fg), lb = lum(...bg);
      res.push({ path, pct: Math.round(100 * s / STEPS), fg: toHex(fg), bg: toHex(bg), lf, lb, ratio: (Math.max(lf, lb) + 0.05) / (Math.min(lf, lb) + 0.05) });
    }
  }
  await browser.close();
  const rs = res.map(r => r.ratio).sort((a, b) => a - b);
  const q = p => rs[Math.floor(p * (rs.length - 1))].toFixed(2);
  console.log('samples', rs.length, 'worst', q(0), 'p10', q(0.1), 'median', q(0.5), 'p90', q(0.9), 'best', q(1), 'at 3:1+', Math.round(100 * rs.filter(r => r >= 3).length / rs.length) + '%');
  const worst = res.reduce((m, r) => (r.ratio < m.ratio ? r : m));
  console.log('worst at', worst.path, worst.pct + '%', 'fg', worst.fg, 'bg', worst.bg);
  for (const r of res.filter(x => x.path === '/').filter((_, i) => i % 4 === 0)) console.log(String(r.pct).padStart(4) + '%', 'fg', r.fg, 'bg', r.bg, r.ratio.toFixed(2));
  if (out) fs.writeFileSync(out, JSON.stringify(res));
})().catch(e => { console.error(e); process.exit(1); });
