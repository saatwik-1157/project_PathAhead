/* ============================================================
   PathAhead — build a drag-and-drop deploy package.

   Netlify's normal git deploy runs `npm install` and bundles the
   counsellor function itself. A manual drag-and-drop deploy does
   neither, so the function would arrive without the Anthropic
   SDK and the AI would fail even with the key set.

   This bundles the function into one self-contained file first,
   so the package needs no npm install and no build step at all.

     node tools/build-dragdrop.mjs

   Output: PathAhead-site.zip in the repo root.

   The git deploy does not use any of this — it builds from
   netlify.toml. This is only for uploading by hand.
   ============================================================ */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "dist-dragdrop");
const ZIP = path.join(ROOT, "PathAhead-site.zip");

// DEPLOY.md and tools/ stay out — they are for whoever maintains the site, not
// for visitors, and the publish directory is served as-is.
const FILES = ["sw.js", "sitemap.xml", "robots.txt"];
const DIRS = ["css", "js", "assets", "roadmaps"];

// A deploy config without the build step — the function is already bundled.
// Written from Node so it lands as UTF-8 with no byte-order mark: PowerShell's
// `Out-File -Encoding utf8` adds one, and Netlify cannot parse a TOML file
// that starts with a BOM ("only letter, numbers, dashes and underscores are
// allowed in keys", pointing at line 1).
const TOML = `# PathAhead — drag-and-drop deploy package.
#
# The counsellor function in netlify/functions is already bundled, so this
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
const FN_DIR = path.join(ROOT, "netlify", "functions");
const functions = fs.readdirSync(FN_DIR).filter((f) => f.endsWith(".mjs") || f.endsWith(".js"));
if (!functions.length) { console.error("No functions found in netlify/functions"); process.exit(1); }

for (const fn of functions) {
  console.log(`bundling ${fn}…`);
  // `shell: true` because on Windows npx is a .cmd shim, which cannot be
  // spawned directly — Node raises EINVAL.
  execFileSync(
    "npx",
    ["esbuild", `netlify/functions/${fn}`, "--bundle", "--platform=node",
     "--format=esm", "--target=node22", "--log-level=warning",
     `--outfile="${path.join(OUT, "netlify", "functions", fn)}"`],
    { cwd: ROOT, stdio: "inherit", shell: true }
  );
}

for (const f of fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"))) {
  fs.copyFileSync(path.join(ROOT, f), path.join(OUT, f));
}
for (const f of FILES) {
  if (fs.existsSync(path.join(ROOT, f))) fs.copyFileSync(path.join(ROOT, f), path.join(OUT, f));
}
for (const d of DIRS) {
  if (fs.existsSync(path.join(ROOT, d))) fs.cpSync(path.join(ROOT, d), path.join(OUT, d), { recursive: true });
}
fs.writeFileSync(path.join(OUT, "netlify.toml"), TOML, "utf8");

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
