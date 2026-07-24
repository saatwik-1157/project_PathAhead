/* PathAhead — Service Worker (offline support, always-fresh when online) */
const CACHE = "pathahead-v7";
const CORE = [
  "index.html", "about.html", "programs.html", "for-colleges.html", "for-students.html",
  "gallery.html", "testimonials.html", "faq.html", "contact.html",
  "roadmaps.html", "career-roadmap.html",
  "css/styles.css", "js/main.js",
  "career-data/branches.js", "career-data/domains.js", "career-data/states.js",
  "career-data/years.js", "career-data/resources.js", "career-data/builder.js",
  "assets/favicon.svg", "assets/icon.svg", "assets/og-image.png",
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
