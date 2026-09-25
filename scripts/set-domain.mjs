/* ============================================================
   PathAhead — point the site at a new domain.

   Canonical URLs, og:url, og:image, twitter:image, the sitemap
   and robots.txt all have to be absolute, so they carry the
   domain in them. After deploying somewhere new they still
   point at the old host, which tells Google the new site is a
   duplicate of the old one — so it keeps ranking the old one.

   Run this once with the live URL:

     node tools/set-domain.mjs https://pathahead.netlify.app

   It rewrites every page, the roadmap generator (so
   regenerating cannot put the old domain back) sitemap.xml and
   robots.txt. Safe to run repeatedly, and it prints what it did.
   ============================================================ */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

const raw = process.argv[2];
if (!raw) {
  console.error("Usage: node tools/set-domain.mjs https://your-site.netlify.app");
  process.exit(1);
}

let next;
try {
  next = new URL(raw.includes("://") ? raw : "https://" + raw);
} catch {
  console.error(`"${raw}" is not a valid URL.`);
  process.exit(1);
}
if (next.protocol !== "https:") {
  console.error("Use an https:// URL — canonical URLs must be https.");
  process.exit(1);
}

// Normalise to a base with exactly one trailing slash.
const BASE = next.origin + next.pathname.replace(/\/*$/, "") + "/";

// Every absolute URL we have ever published the site under. Matching on the
// known bases rather than a bare "https://..." keeps genuine outbound links
// (fonts, CDNs, WhatsApp) untouched.
const OLD = [
  "https://saatwik-1157.github.io/project_PathAhead/",
  "https://pathahead.netlify.app/",
  BASE,
];

const files = [
  ...fs.readdirSync(ROOT).filter((f) => f.endsWith(".html")),
  "sitemap.xml",
  "robots.txt",
  "roadmaps/build_roadmaps.py",
].filter((f) => fs.existsSync(path.join(ROOT, f)));

let changedFiles = 0;
let changedUrls = 0;

for (const rel of files) {
  const abs = path.join(ROOT, rel);
  const before = fs.readFileSync(abs, "utf8");
  let after = before;

  for (const old of OLD) {
    if (old === BASE) continue;
    const parts = after.split(old);
    if (parts.length > 1) {
      changedUrls += parts.length - 1;
      after = parts.join(BASE);
    }
  }

  if (after !== before) {
    fs.writeFileSync(abs, after, "utf8");
    changedFiles++;
    console.log("  updated", rel);
  }
}

console.log(
  changedUrls
    ? `\nDone — ${changedUrls} URL${changedUrls === 1 ? "" : "s"} across ${changedFiles} file${changedFiles === 1 ? "" : "s"} now point at ${BASE}`
    : `\nNothing to change — everything already points at ${BASE}`
);

// Leave the caller with the one thing this script cannot do for them.
const stale = [];
for (const rel of files) {
  const txt = fs.readFileSync(path.join(ROOT, rel), "utf8");
  for (const old of OLD) {
    if (old !== BASE && txt.includes(old)) stale.push(`${rel} still mentions ${old}`);
  }
}
if (stale.length) {
  console.log("\nStill to check:");
  stale.forEach((s) => console.log("  •", s));
}
