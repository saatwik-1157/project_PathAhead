/* ============================================================
   PathAhead — Shared JS
   Injects navbar + footer + back-to-top on every page and wires
   up all interactions. No build step, no dependencies.
   Works on file:// and over http(s).
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Brand + site config (single source of truth) ---------- */
  var CONFIG = {
    brand: "PathAhead",
    phone: "+91 7780109877",
    phoneHref: "+917780109877",
    phone2: "+91 9989057655",
    phone2Href: "+919989057655",
    email: "nirishapavuluri@gmail.com",
    email2: "saathwik.13@gmail.com",
    year: 2026,

    /* ============================================================
       INTEGRATIONS — fill these in to go fully live.
       Leave blank to run in safe "demo mode" (saves to browser only).
       Full step-by-step setup lives in SETUP.md
       ============================================================ */
    siteUrl: "https://pathahead.example",   // your live domain (used for canonical + sitemap)

    // 🔑 Integration keys live in js/config.js (git-ignored) so they aren't committed.
    //    Copy js/config.example.js → js/config.js and fill them in.
    web3formsKey: "",       // set in js/config.js — https://web3forms.com
    supabaseUrl: "",        // set in js/config.js — https://supabase.com
    supabaseAnonKey: "",    // set in js/config.js

    // 3) ANALYTICS (optional): privacy-friendly Plausible — put your domain here.
    analyticsDomain: "",

    // 4) WHATSAPP: pre-filled message for the floating chat button.
    whatsappMsg: "Hi PathAhead! I'd like to book a career workshop for our students.",

    // 5) ADMIN (demo mode only): passcode for the /admin.html preview.
    //    In live mode, real Supabase email/password auth is used instead.
    adminPasscode: "pathahead"
  };

  // Allow overriding config without editing this file (optional): window.PATHAHEAD_CONFIG
  if (window.PATHAHEAD_CONFIG) { for (var k in window.PATHAHEAD_CONFIG) CONFIG[k] = window.PATHAHEAD_CONFIG[k]; }
  window.PATHAHEAD = CONFIG; // expose for admin.html etc.

  var isConfigured = {
    email: function () { return !!CONFIG.web3formsKey; },
    db: function () { return !!(CONFIG.supabaseUrl && CONFIG.supabaseAnonKey); }
  };

  var NAV = [
    { label: "Home",         href: "index.html" },
    { label: "About",        href: "about.html" },
    { label: "Programs",     href: "programs.html" },
    { label: "For Colleges", href: "for-colleges.html" },
    { label: "For Students", href: "for-students.html" },
    { label: "Roadmaps",     href: "roadmaps.html" },
    { label: "Career Builder", href: "career-roadmap.html" },
    { label: "Gallery",      href: "gallery.html" },
    { label: "Testimonials", href: "testimonials.html" },
    { label: "FAQ",          href: "faq.html" },
    { label: "Contact",      href: "contact.html" }
  ];

  /* ---------- Icon set (inline SVG) ---------- */
  var I = {
    logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>'
  };
  var SOCIAL = {
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.5 15.5v-7l6.3 3.5-6.3 3.5z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35zM12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.05-1.32A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>'
  };

  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (here === "") here = "index.html";

  // Apply saved/system theme as early as possible (a no-flash inline script in <head> handles the rest).
  (function () {
    try {
      var t = localStorage.getItem("pathahead-theme");
      if (t === "dark" || (!t && window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.documentElement.setAttribute("data-theme", "dark");
      }
    } catch (e) {}
  })();

  function initTheme() {
    var btn = document.getElementById("themeToggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var wasDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (wasDark) document.documentElement.removeAttribute("data-theme");
      else document.documentElement.setAttribute("data-theme", "dark");
      try { localStorage.setItem("pathahead-theme", wasDark ? "light" : "dark"); } catch (e) {}
      var m = document.querySelector('meta[name="theme-color"]');
      if (m) m.setAttribute("content", wasDark ? "#2563EB" : "#0B1220");
    });
  }

  // Brand mark: uses assets/logo-mark.png; falls back to the inline SVG badge if missing.
  function logoMark() {
    return '<span class="brand-logo">' +
      '<img class="brand-img" src="assets/logo-mark.svg" alt="' + CONFIG.brand + ' logo" ' +
      'onerror="this.parentNode.classList.add(\'nomark\');this.remove();">' +
      '<span class="brand-svg">' + I.logo + "</span>" +
    "</span>";
  }

  /* ============================================================
     BUILD: Navbar
     ============================================================ */
  function buildNav() {
    var links = NAV.map(function (n) {
      var active = n.href.toLowerCase() === here ? " active" : "";
      return '<a href="' + n.href + '" class="' + active.trim() + '">' + n.label + "</a>";
    }).join("");

    var el = document.createElement("header");
    el.className = "nav";
    el.innerHTML =
      '<div class="container nav-inner">' +
        '<a class="brand" href="index.html" aria-label="' + CONFIG.brand + ' home">' +
          logoMark() + CONFIG.brand +
        "</a>" +
        '<nav class="nav-links" aria-label="Primary">' + links + "</nav>" +
        '<div class="nav-cta">' +
          '<button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode" title="Toggle dark mode">' +
            '<span class="moon">' + I.moon + "</span><span class=\"sun\">" + I.sun + "</span>" +
          "</button>" +
          '<a href="contact.html" class="btn btn-primary">Book a Workshop</a>' +
          '<button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">' + I.menu + "</button>" +
        "</div>" +
      "</div>";

    var drawer = document.createElement("div");
    drawer.className = "nav-drawer";
    drawer.id = "navDrawer";
    drawer.innerHTML = NAV.map(function (n) {
      var active = n.href.toLowerCase() === here ? " active" : "";
      return '<a href="' + n.href + '" class="' + active.trim() + '">' + n.label + "</a>";
    }).join("") + '<a href="contact.html" class="btn btn-primary btn-block">Book a Workshop</a>';

    document.body.insertBefore(el, document.body.firstChild);
    document.body.insertBefore(drawer, el.nextSibling);

    // Sticky shadow on scroll
    function onScroll() { el.classList.toggle("scrolled", window.scrollY > 8); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Mobile toggle
    var toggle = document.getElementById("navToggle");
    function setDrawer(open) {
      drawer.classList.toggle("open", open);
      document.body.classList.toggle("drawer-open", open);
      toggle.innerHTML = open ? I.close : I.menu;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    toggle.addEventListener("click", function () { setDrawer(!drawer.classList.contains("open")); });
    drawer.addEventListener("click", function (e) { if (e.target.tagName === "A") setDrawer(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 1024) setDrawer(false); });
  }

  /* ============================================================
     BUILD: Skip-to-content link (a11y — first focusable element)
     ============================================================ */
  function buildSkipLink() {
    var skip = document.createElement("a");
    skip.className = "skip-link";
    skip.href = "#main-content";
    skip.textContent = "Skip to content";
    // Tag the first real content region so the link has a target on every page.
    var main = document.querySelector("main, section");
    if (main) {
      if (!main.id) main.id = "main-content";
      main.setAttribute("tabindex", "-1");
      skip.href = "#" + main.id;
    }
    document.body.insertBefore(skip, document.body.firstChild);
  }

  /* ============================================================
     BUILD: Footer
     ============================================================ */
  function buildFooter() {
    var quick = NAV.slice(0, 5).map(function (n) { return '<a href="' + n.href + '">' + n.label + "</a>"; }).join("");
    var progs =
      '<a href="programs.html">Future Ready</a>' +
      '<a href="programs.html">Career Blueprint</a>' +
      '<a href="for-students.html">For Students</a>' +
      '<a href="for-colleges.html">For Colleges</a>' +
      '<a href="gallery.html">Gallery</a>';

    var f = document.createElement("footer");
    f.className = "footer";
    f.innerHTML =
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div class="footer-col">' +
            '<a class="brand" href="index.html">' + logoMark() + CONFIG.brand + "</a>" +
            '<p class="footer-about">India’s premium career guidance platform — helping Intermediate students make smarter, future-ready decisions before college.</p>' +
            '<div class="socials">' +
              '<a href="#" aria-label="LinkedIn">' + SOCIAL.linkedin + "</a>" +
              '<a href="#" aria-label="Instagram">' + SOCIAL.instagram + "</a>" +
              '<a href="#" aria-label="YouTube">' + SOCIAL.youtube + "</a>" +
              '<a href="https://wa.me/' + CONFIG.phoneHref.replace("+", "") + '" aria-label="WhatsApp">' + SOCIAL.whatsapp + "</a>" +
            "</div>" +
          "</div>" +
          '<div class="footer-col"><h3>Quick Links</h3>' + quick + "</div>" +
          '<div class="footer-col"><h3>Programs</h3>' + progs + "</div>" +
          '<div class="footer-col"><h3>Get in Touch</h3>' +
            '<ul class="footer-contact">' +
              '<li>' + I.phone + '<a href="tel:' + CONFIG.phoneHref + '">' + CONFIG.phone + "</a></li>" +
              '<li>' + I.phone + '<a href="tel:' + CONFIG.phone2Href + '">' + CONFIG.phone2 + "</a></li>" +
              '<li>' + I.mail + '<a href="mailto:' + CONFIG.email + '">' + CONFIG.email + "</a></li>" +
              '<li>' + I.mail + '<a href="mailto:' + CONFIG.email2 + '">' + CONFIG.email2 + "</a></li>" +
              '<li>' + I.map + "India</li>" +
            "</ul>" +
            '<a href="contact.html" class="btn btn-primary" style="margin-top:14px">Book a Workshop</a>' +
          "</div>" +
        "</div>" +
        '<div class="footer-bottom">' +
          "<span>© " + CONFIG.year + " " + CONFIG.brand + ". All Rights Reserved.</span>" +
          '<span style="display:inline-flex;gap:22px;align-items:center;flex-wrap:wrap">' +
            '<a href="admin.html" class="footer-admin"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Admin</a>' +
            '<span class="made">Your Career Starts Here.</span>' +
          "</span>" +
        "</div>" +
      "</div>";
    document.body.appendChild(f);
  }

  /* ============================================================
     BUILD: Back to top
     ============================================================ */
  function buildToTop() {
    var b = document.createElement("button");
    b.className = "to-top";
    b.setAttribute("aria-label", "Back to top");
    b.innerHTML = I.up;
    b.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    document.body.appendChild(b);
    window.addEventListener("scroll", function () { b.classList.toggle("show", window.scrollY > 500); }, { passive: true });
  }

  /* ============================================================
     Scroll reveal
     ============================================================ */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !items.length) {
      items.forEach(function (n) { n.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (n) { io.observe(n); });
  }

  /* ============================================================
     Counters
     ============================================================ */
  function initCounters() {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    function animate(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var decimals = (target % 1 !== 0) ? 1 : 0;
      var start = 0, dur = 1600, t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = (start + (target - start) * eased).toFixed(decimals);
        el.firstChild ? (el.childNodes[0].nodeValue = val) : (el.textContent = val);
        el.innerHTML = val + '<span class="suffix">' + suffix + "</span>";
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!("IntersectionObserver" in window)) { nums.forEach(animate); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ============================================================
     Accordion (FAQ)
     ============================================================ */
  function initAccordion() {
    document.querySelectorAll(".acc-item").forEach(function (item) {
      var q = item.querySelector(".acc-q");
      var a = item.querySelector(".acc-a");
      if (!q.querySelector(".icon")) {
        var ic = document.createElement("span");
        ic.className = "icon"; ic.innerHTML = I.plus;
        q.appendChild(ic);
      }
      q.setAttribute("aria-expanded", "false");
      q.addEventListener("click", function () {
        var open = item.classList.contains("open");
        // close siblings in the same accordion
        var group = item.closest(".accordion");
        if (group) group.querySelectorAll(".acc-item.open").forEach(function (o) {
          if (o !== item) { o.classList.remove("open"); o.querySelector(".acc-a").style.maxHeight = null; o.querySelector(".acc-q").setAttribute("aria-expanded", "false"); }
        });
        item.classList.toggle("open", !open);
        q.setAttribute("aria-expanded", !open ? "true" : "false");
        a.style.maxHeight = !open ? a.scrollHeight + "px" : null;
      });
    });
  }

  /* ============================================================
     Testimonial filter chips
     ============================================================ */
  function initFilters() {
    var chipRow = document.querySelector("[data-filter-group]");
    if (!chipRow) return;
    chipRow.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      chipRow.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      var f = chip.getAttribute("data-filter");
      document.querySelectorAll("[data-cat]").forEach(function (card) {
        var show = f === "all" || card.getAttribute("data-cat") === f;
        card.style.display = show ? "" : "none";
      });
    });
  }

  /* ============================================================
     Forms — validation + fake submit + localStorage (admin-ready)
     Later: replace saveSubmission() with a Supabase/Firebase call.
     ============================================================ */
  // Local backup — always runs, so no lead is ever lost even if a network call fails.
  function saveLocal(kind, data) {
    try {
      var key = "pathahead_" + kind;
      var list = JSON.parse(localStorage.getItem(key) || "[]");
      list.push({ data: data, at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) { /* storage may be blocked; ignore */ }
  }

  // Lazy-load the Supabase client only when it's actually configured/needed.
  var _supabasePromise = null;
  function getSupabase() {
    if (!isConfigured.db()) return Promise.resolve(null);
    if (_supabasePromise) return _supabasePromise;
    _supabasePromise = import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm")
      .then(function (m) { return m.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey); })
      .catch(function () { return null; });
    return _supabasePromise;
  }
  window.PATHAHEAD_getSupabase = getSupabase;

  // Email the lead via Web3Forms (free, no backend needed).
  function sendToEmail(kind, data) {
    if (!isConfigured.email()) return Promise.resolve(false);
    var labels = { contact: "Contact", college_inquiry: "College Inquiry", student_registration: "Student Registration", newsletter: "Newsletter" };
    var payload = {
      access_key: CONFIG.web3formsKey,
      subject: "PathAhead — new " + (labels[kind] || kind),
      from_name: "PathAhead Website",
      form_type: kind
    };
    for (var k in data) payload[k] = data[k];
    return fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.ok; }).catch(function () { return false; });
  }

  // Store the lead in Supabase (table: submissions).
  function sendToDb(kind, data) {
    return getSupabase().then(function (sb) {
      if (!sb) return false;
      return sb.from("submissions").insert({ kind: kind, payload: data })
        .then(function (res) { return !res.error; })
        .catch(function () { return false; });
    });
  }

  // Orchestrate: always back up locally, then send to whatever is configured.
  // Resolves { delivered: bool, demo: bool } — demo = nothing configured (still "succeeds" locally).
  function sendSubmission(kind, data) {
    saveLocal(kind, data);
    var anyConfigured = isConfigured.email() || isConfigured.db();
    if (!anyConfigured) {
      return new Promise(function (res) { setTimeout(function () { res({ delivered: true, demo: true }); }, 600); });
    }
    return Promise.all([sendToEmail(kind, data), sendToDb(kind, data)])
      .then(function (results) {
        var delivered = results.some(function (r) { return r === true; });
        return { delivered: delivered, demo: false };
      });
  }

  function validateField(field) {
    var input = field.querySelector("input, select, textarea");
    if (!input || !input.hasAttribute("required")) { markField(field, true); return true; }
    var val = (input.value || "").trim();
    var ok = val.length > 0;
    if (ok && input.type === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (ok && input.getAttribute("data-type") === "phone") ok = /^[+\d][\d\s\-()]{7,}$/.test(val);
    markField(field, ok);
    return ok;
  }
  function markField(field, ok) { field.classList.toggle("invalid", !ok); }

  function showFormError(scope, form) {
    var box = scope.querySelector(".form-error");
    if (!box) {
      box = document.createElement("div");
      box.className = "form-error";
      box.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
        '<span>We couldn’t send that automatically. Please call <a href="tel:' + CONFIG.phoneHref + '">' + CONFIG.phone + '</a> or email <a href="mailto:' + CONFIG.email + '">' + CONFIG.email + '</a> — your details are saved.</span>';
      form.parentNode.insertBefore(box, form);
    }
    box.classList.add("show");
    box.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function hideFormError(scope) {
    var box = scope.querySelector(".form-error");
    if (box) box.classList.remove("show");
  }

  function initForms() {
    document.querySelectorAll("form[data-form]").forEach(function (form) {
      var kind = form.getAttribute("data-form");
      var fields = Array.prototype.slice.call(form.querySelectorAll(".field"));

      fields.forEach(function (field) {
        var input = field.querySelector("input, select, textarea");
        if (!input) return;
        input.addEventListener("blur", function () { if (field.classList.contains("invalid")) validateField(field); });
        input.addEventListener("input", function () { if (field.classList.contains("invalid")) validateField(field); });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var valid = true;
        fields.forEach(function (field) { if (!validateField(field)) valid = false; });
        if (!valid) {
          var firstBad = form.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea");
          if (firstBad) firstBad.focus();
          return;
        }
        var data = {};
        fields.forEach(function (field) {
          var input = field.querySelector("input, select, textarea");
          if (input && input.name) data[input.name] = input.value.trim();
        });

        var btn = form.querySelector("[type=submit]");
        var orig = btn ? btn.textContent : "";
        if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
        var scope = form.closest(".form-wrap") || form.parentElement || form;
        var success = form.querySelector(".form-success") || scope.querySelector(".form-success");
        hideFormError(scope);

        sendSubmission(kind, data).then(function (result) {
          if (btn) { btn.disabled = false; btn.textContent = orig; }
          if (result.delivered) {
            if (success) { success.classList.add("show"); success.scrollIntoView({ behavior: "smooth", block: "center" }); }
            form.reset();
            setTimeout(function () { if (success) success.classList.remove("show"); }, 6000);
          } else {
            // Providers were configured but the network call failed — never lose the lead.
            showFormError(scope, form);
          }
        });
      });
    });
  }

  /* ============================================================
     Newsletter
     ============================================================ */
  function initNewsletter() {
    document.querySelectorAll("form[data-newsletter]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = form.querySelector("input");
        var msg = form.parentElement.querySelector(".msg");
        if (!input || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
          input.focus(); input.style.borderColor = "#EF4444"; return;
        }
        input.style.borderColor = "";
        sendSubmission("newsletter", { email: input.value.trim() });
        if (msg) { msg.textContent = "✓ You’re subscribed. Welcome aboard!"; msg.classList.add("show"); }
        form.reset();
        setTimeout(function () { if (msg) msg.classList.remove("show"); }, 6000);
      });
    });
  }

  /* ============================================================
     Smooth in-page anchor scrolling with sticky-nav offset
     ============================================================ */
  function initAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  }

  /* ============================================================
     Scroll progress bar
     ============================================================ */
  function initScrollProgress() {
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    function update() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = p + "%";
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ============================================================
     Cursor spotlight on cards (desktop, pointer only)
     ============================================================ */
  function initSpotlight() {
    if (!window.matchMedia || !window.matchMedia("(hover: hover)").matches) return;
    document.querySelectorAll(".card, .tcard, .program-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ============================================================
     Program chooser (data-chooser)
     ============================================================ */
  function initChooser() {
    var chooser = document.querySelector("[data-chooser]");
    if (!chooser) return;
    var results = {
      first: {
        tag: "For Inter 1st Year", cls: "",
        title: "Future Ready",
        body: "Perfect for you! Build career awareness, explore engineering branches, get an intro to AI &amp; future skills, and start your personal career plan — early.",
        href: "programs.html#future-ready", label: "Explore Future Ready"
      },
      second: {
        tag: "For Inter 2nd Year", cls: "orange",
        title: "Career Blueprint",
        body: "The right fit for you! Nail college &amp; branch selection, understand technology domains and AI careers, discover scholarships, and leave with a clear roadmap.",
        href: "programs.html#career-blueprint", label: "Explore Career Blueprint"
      }
    };
    var box = chooser.querySelector(".chooser-result");
    chooser.querySelectorAll(".chooser-btns button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        chooser.querySelectorAll(".chooser-btns button").forEach(function (b) { b.classList.remove("active", "orange"); });
        btn.classList.add("active");
        var key = btn.getAttribute("data-year");
        var r = results[key];
        if (key === "second") btn.classList.add("orange");
        box.innerHTML =
          '<span class="tag ' + r.cls + '">' + r.tag + "</span>" +
          "<h4>" + r.title + "</h4>" +
          "<p class='muted' style='margin-bottom:18px'>" + r.body + "</p>" +
          '<a href="' + r.href + '" class="btn ' + (r.cls === "orange" ? "btn-secondary" : "btn-primary") + '">' + r.label + " →</a>";
        box.classList.add("show");
      });
    });
  }

  /* ============================================================
     Domains explorer (data-domains)
     ============================================================ */
  function initDomains() {
    var wrap = document.querySelector("[data-domains]");
    if (!wrap) return;
    var tabs = wrap.querySelectorAll(".domain-tab");
    var panels = wrap.querySelectorAll(".domain-panel");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var id = tab.getAttribute("data-domain");
        tabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        panels.forEach(function (p) { p.classList.toggle("show", p.getAttribute("data-domain") === id); });
      });
    });
  }

  /* ============================================================
     Floating WhatsApp button
     ============================================================ */
  function buildWhatsApp() {
    var a = document.createElement("a");
    a.className = "wa-btn";
    a.href = "https://wa.me/" + CONFIG.phoneHref.replace("+", "") + "?text=" + encodeURIComponent(CONFIG.whatsappMsg);
    a.target = "_blank"; a.rel = "noopener";
    a.setAttribute("aria-label", "Chat with us on WhatsApp");
    a.innerHTML = SOCIAL.whatsapp;
    document.body.appendChild(a);
  }

  /* ============================================================
     Head injection — canonical, manifest, apple icon (DRY across pages)
     ============================================================ */
  function injectHead() {
    var head = document.head;
    function add(tag, attrs) {
      var el = document.createElement(tag);
      for (var a in attrs) el.setAttribute(a, attrs[a]);
      head.appendChild(el);
    }
    if (!head.querySelector('link[rel="canonical"]') && CONFIG.siteUrl) {
      add("link", { rel: "canonical", href: CONFIG.siteUrl.replace(/\/$/, "") + "/" + (here === "index.html" ? "" : here) });
    }
    if (!head.querySelector('link[rel="manifest"]')) add("link", { rel: "manifest", href: "manifest.webmanifest" });
    if (!head.querySelector('link[rel="apple-touch-icon"]')) add("link", { rel: "apple-touch-icon", href: "assets/icon.svg" });
  }

  /* ============================================================
     PWA service worker (only over http/https — skipped on file://)
     ============================================================ */
  function registerSW() {
    if (!("serviceWorker" in navigator)) return;
    if (location.protocol !== "http:" && location.protocol !== "https:") return;
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () { /* offline features unavailable */ });
    });
  }

  /* ============================================================
     Privacy-friendly analytics (Plausible) — only if configured
     ============================================================ */
  function injectAnalytics() {
    if (!CONFIG.analyticsDomain) return;
    var s = document.createElement("script");
    s.defer = true; s.setAttribute("data-domain", CONFIG.analyticsDomain);
    s.src = "https://plausible.io/js/script.js";
    document.head.appendChild(s);
  }

  /* ---------- Init ---------- */
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(function () {
    // Admin page reuses this file only for CONFIG + Supabase helpers — skip marketing chrome.
    if (document.body.getAttribute("data-page") === "admin") return;
    injectHead();
    injectAnalytics();
    buildNav();
    buildSkipLink();
    initTheme();
    buildFooter();
    buildToTop();
    buildWhatsApp();
    registerSW();
    initScrollProgress();
    initReveal();
    initCounters();
    initAccordion();
    initFilters();
    initForms();
    initNewsletter();
    initAnchors();
    initSpotlight();
    initChooser();
    initDomains();
  });
})();
