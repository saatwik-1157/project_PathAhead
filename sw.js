/* PathAhead — Service Worker (offline support, always-fresh when online) */
const CACHE = "pathahead-v7";
// NOTE: caches.addAll() below is ATOMIC — if any single entry 404s, the whole
// install fails and the site silently loses offline support. Every path here
// must resolve to a real 200, and every path must stay RELATIVE (no leading
// slash) or it resolves against the GitHub Pages org root instead of the repo
// subpath. Do not add js/config.js: it is git-ignored and absent in production.
const CORE = [
  "index.html", "about.html", "programs.html", "for-colleges.html", "for-students.html",
  "gallery.html", "testimonials.html", "faq.html", "contact.html", "404.html",
  "roadmaps.html", "career-roadmap.html",
  "ai-ml-roadmap.html", "web-development-roadmap.html", "data-science-roadmap.html",
  "cybersecurity-roadmap.html", "cloud-devops-roadmap.html", "mobile-development-roadmap.html",
  "ui-ux-design-roadmap.html", "data-engineering-roadmap.html",
  "css/styles.css", "css/premium.css", "js/main.js", "js/motion.js",
  "career-data/branches.js", "career-data/domains.js", "career-data/states.js",
  "career-data/years.js", "career-data/resources.js", "career-data/builder.js",
  "assets/favicon.svg", "assets/icon.svg", "assets/og-image.svg", "assets/logo-mark.svg",
  "manifest.webmanifest"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;                       // never intercept form POSTs
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;        // let fonts / Supabase / Web3Forms pass through

  // Network-first: always serve the freshest version when online; use cache only when offline.
  // (Keeps content/assets up to date after every deploy, while still working offline.)
  e.respondWith(
    fetch(req)
      .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res; })
      .catch(() => caches.match(req).then((m) => m || (req.mode === "navigate" ? caches.match("index.html") : undefined)))
  );
});
