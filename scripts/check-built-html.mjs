// Run after `next build`. Fails if any prerendered page has a missing space
// after an inline tag, e.g. "</em>word". The compiler drops a leading space
// when JSX text contains an HTML entity such as &apos;; use a literal ’ in JSX
// text instead. Also fails if a page has other than exactly one <h1>.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = ".next/server/app";
const pattern = /<\/(em|strong|a)>[A-Za-z]/g;

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* htmlFiles(path);
    else if (name.endsWith(".html") && !name.startsWith("_not-found")) yield path;
  }
}

let problems = 0;
let checked = 0;
for (const file of htmlFiles(root)) {
  const html = readFileSync(file, "utf8");
  checked++;
  const hits = html.match(pattern);
  if (hits) {
    problems++;
    console.error(`${file}: missing space after ${[...new Set(hits)].join(", ")}`);
  }
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) {
    problems++;
    console.error(`${file}: expected 1 <h1>, found ${h1s}`);
  }
}

if (checked === 0) {
  console.error(`No built HTML found under ${root}. Run \`next build\` first.`);
  process.exit(1);
}
console.log(`Checked ${checked} pages, ${problems} problem(s).`);
process.exit(problems ? 1 : 0);
