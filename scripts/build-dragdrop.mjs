/* ============================================================
   PathAhead — build a drag-and-drop deploy package.

   Netlify's normal git deploy runs `npm install` and bundles the
   counsellor function itself. A manual drag-and-drop deploy does
   neither, so the function would arrive without the Anthropic
   SDK and the AI would fail even with the key set.

   This bundles the function into one self-contained file first,
   so the package needs no npm install and no build step at all.

     node scripts/build-dragdrop.mjs

   Output: PathAhead-site.zip in the repo root.

   The git deploy does not use any of this — it builds from
   netlify.toml. This is only for uploading by hand.
   ============================================================ */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

// REPO is the repository root (package.json, node_modules, output go here);
// WEB is the published site (apps/web) the package is copied from.
const REPO = path.resolve(import.meta.dirname, "..");
const WEB = path.join(REPO, "apps", "web");
const FN_SRC = path.join(REPO, "apps", "api", "functions");
const OUT = path.join(REPO, "dist-dragdrop");
const ZIP = path.join(REPO, "PathAhead-site.zip");

// docs/ and scripts/ stay out — they are for whoever maintains the site, not
// for visitors, and the publish directory is served as-is.
const FILES = ["sw.js", "sitemap.xml", "robots.txt", "manifest.webmanifest"];
// apps/web also holds working files (roadmap sources, the promo kit), so this is a list rather than
// "copy everything". Missing one is silent and costly — leaving out
// career-data shipped a Career Builder whose Branch dropdown was empty,
// because every option comes from those files. The check at the end of this
// script now refuses to build if a page references something that is not here.
const DIRS = ["css", "js", "assets", "roadmaps", "career-data"];

// A deploy config without the build step — the function is already bundled.
// Written from Node so it lands as UTF-8 with no byte-order mark: PowerShell's
// `Out-File -Encoding utf8` adds one, and Netlify cannot parse a TOML file
// that starts with a BOM ("only letter, numbers, dashes and underscores are
// allowed in keys", pointing at line 1).
const TOML = `# PathAhead — drag-and-drop deploy package.
#
# The functions in netlify/functions are already bundled, so this
# package needs no npm install and no build step. Drop the folder on Netlify
# and the AI works as soon as ANTHROPIC_API_KEY is set.
[build]
  publish = "."
  functions = "netlify/functions"

[[redirects]]
  from = "/netlify/*"
  to = "/404.html"
  status = 404
  force = true

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "no-cache"

# Friendly 404 — keep last so it cannot shadow the rules above.
[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
`;

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "netlify", "functions"), { recursive: true });

// Every function, so adding one does not silently ship unbundled.
const functions = fs.readdirSync(FN_SRC).filter((f) => f.endsWith(".mjs") || f.endsWith(".js"));
if (!functions.length) { console.error("No functions found in apps/api/functions"); process.exit(1); }

for (const fn of functions) {
  console.log(`bundling ${fn}…`);
  // `shell: true` because on Windows npx is a .cmd shim, which cannot be
  // spawned directly — Node raises EINVAL.
  execFileSync(
    "npx",
    ["esbuild", `apps/api/functions/${fn}`, "--bundle", "--platform=node",
     "--format=esm", "--target=node22", "--log-level=warning",
     `--outfile="${path.join(OUT, "netlify", "functions", fn)}"`],
    { cwd: REPO, stdio: "inherit", shell: true }
  );
}

for (const f of fs.readdirSync(WEB).filter((f) => f.endsWith(".html"))) {
  fs.copyFileSync(path.join(WEB, f), path.join(OUT, f));
}
for (const f of FILES) {
  if (fs.existsSync(path.join(WEB, f))) fs.copyFileSync(path.join(WEB, f), path.join(OUT, f));
}
for (const d of DIRS) {
  if (fs.existsSync(path.join(WEB, d))) fs.cpSync(path.join(WEB, d), path.join(OUT, d), { recursive: true });
}
fs.writeFileSync(path.join(OUT, "netlify.toml"), TOML, "utf8");

// Every local file the pages ask for must actually be in the package. This is
// what would have caught career-data going missing: the HTML referenced it,
// the package did not contain it, and the only symptom on the live site was an
// empty dropdown.
{
  const refs = new Set();
  const addRef = (ref) => {
    if (/^(https?:|mailto:|tel:|#|data:|javascript:)/.test(ref)) return;
    const clean = ref.split("#")[0].split("?")[0].replace(/^\.\//, "").replace(/^\//, "");
    if (clean) refs.add(clean);
  };

  for (const f of fs.readdirSync(OUT).filter((f) => f.endsWith(".html"))) {
    const html = fs.readFileSync(path.join(OUT, f), "utf8");
    for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) addRef(m[1]);
  }

  // The service worker precaches a list of its own, and `caches.addAll` rejects
  // the whole install if a single entry 404s — so one missing file silently
  // costs offline support entirely, with nothing visible on the page to show
  // for it. career-data was in that list while missing from the package.
  const swPath = path.join(OUT, "sw.js");
  if (fs.existsSync(swPath)) {
    const sw = fs.readFileSync(swPath, "utf8");
    const core = sw.match(/const\s+CORE\s*=\s*\[([\s\S]*?)\]/);
    if (core) for (const m of core[1].matchAll(/"([^"]+)"/g)) addRef(m[1]);
  }

  // Things main.js adds to <head> at runtime, which no HTML file mentions.
  for (const m of fs.readFileSync(path.join(OUT, "js", "main.js"), "utf8")
    .matchAll(/(?:rel:\s*"(?:manifest|apple-touch-icon)"[^}]*?href:\s*"([^"]+)")/g)) addRef(m[1]);

  // Anything a page asks for that the folder lists above did not bring: take
  // just that file from the repo. This is how the AI/ML roadmap PDF gets in
  // without shipping the working files that sit beside it.
  const missing = [];
  let pulled = 0;
  for (const ref of refs) {
    const dest = path.join(OUT, ref);
    if (fs.existsSync(dest)) continue;
    const from = path.join(WEB, ref);
    if (fs.existsSync(from) && fs.statSync(from).isFile()) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(from, dest);
      pulled++;
      console.log("  + " + ref);
    } else {
      missing.push(ref);
    }
  }
  if (pulled) console.log(`  (${pulled} referenced file${pulled === 1 ? "" : "s"} pulled in individually)`);

  if (missing.length) {
    console.error("\nThe pages reference files that do not exist anywhere:");
    for (const m of missing) console.error("  -", m);
    process.exit(1);
  }
}

// Sanity check: no bundle may import a package that will not be installed.
for (const fn of functions) {
  const bundle = fs.readFileSync(path.join(OUT, "netlify", "functions", fn), "utf8");
  const bare = [...bundle.matchAll(/^import\s.*?from\s+"([^."][^"]*)"/gm)]
    .map((m) => m[1])
    .filter((s) => !s.startsWith("node:"));
  if (bare.length) {
    console.error(`\n${fn} still needs packages that will not be installed:`, [...new Set(bare)].join(", "));
    process.exit(1);
  }
}

// --keep leaves the folder in place instead of zipping it. The repo root holds
// unrelated projects, personal PDFs and node_modules, so `netlify deploy` must
// never be pointed at it — deploy this folder instead.
if (process.argv.includes("--keep")) {
  console.log(`\nDone — ${OUT}`);
  console.log("Deploy with:");
  console.log(`  npx netlify deploy --prod --dir "${OUT}" --functions "${path.join(OUT, "netlify", "functions")}"`);
} else {
  fs.rmSync(ZIP, { force: true });
  execFileSync("powershell", ["-NoProfile", "-Command",
    `Compress-Archive -Path '${OUT}\\*' -DestinationPath '${ZIP}'`], { stdio: "inherit" });
  fs.rmSync(OUT, { recursive: true, force: true });
  console.log(`\nDone — ${ZIP} (${(fs.statSync(ZIP).size / 1048576).toFixed(1)} MB)`);
  console.log("Self-contained: no npm install, no build step. Set ANTHROPIC_API_KEY on the site and the AI works.");
}
