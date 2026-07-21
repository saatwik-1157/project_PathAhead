/* ============================================================
   PathAhead — Motion layer
   ------------------------------------------------------------
   Loaded AFTER js/main.js. Holds the interaction effects that are
   optional rather than structural: magnetic buttons, pointer tilt,
   and click ripples.

   Contract with main.js:
     window.PATHAHEAD.motion = { reduced, fine, revealScan, remeasure }
   `reduced` mirrors prefers-reduced-motion; `fine` mirrors (hover: hover).

   Every effect here MUST early-return on `reduced` — the global
   `* { animation: none !important }` rule in the CSS does NOT stop
   requestAnimationFrame.

   Nothing in this file may throw: a hard error here would leave the
   page's interaction polish half-applied with no console explanation.
   ============================================================ */
(function () {
  "use strict";

  var PA = (window.PATHAHEAD = window.PATHAHEAD || {});

  /* Fallback gate, in case this file is ever loaded without main.js
     (or before it). main.js defines the real object. */
  if (!PA.motion) {
    PA.motion = {
      reduced: !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches),
      fine: !!(window.matchMedia && matchMedia("(hover: hover)").matches),
      revealScan: function () {},
      remeasure: function () {}
    };
  }
  var M = PA.motion;

  // Pointer effects are for precise pointers only. On touch there is no hover
  // state to enter, and running them would just cost battery.
  function pointerFx() { return !M.reduced && M.fine; }

  /* ============================================================
     Magnetic buttons
     The cursor tugs the button toward itself, then it springs back.
     Writes CSS custom properties rather than `transform` directly, so
     the hover lift in premium.css composes with it instead of being
     overwritten.
     ============================================================ */
  function initMagnetic() {
    if (!pointerFx()) return;
    var PULL = 0.3;   // fraction of cursor offset applied
    var MAX = 6;      // px — past this it stops feeling like a button

    document.querySelectorAll(".btn-primary, .btn-secondary, .btn-lg").forEach(function (el) {
      var rect = null, queued = false, x = 0, y = 0;

      function write() {
        queued = false;
        el.style.setProperty("--mag-x", x.toFixed(1) + "px");
        el.style.setProperty("--mag-y", y.toFixed(1) + "px");
      }
      function clamp(v) { return v < -MAX ? -MAX : (v > MAX ? MAX : v); }

      // Measure once on enter, not per move: getBoundingClientRect() forces
      // layout, and a mousemove handler can fire well over 60x/second.
      el.addEventListener("mouseenter", function () { rect = el.getBoundingClientRect(); });
      el.addEventListener("mousemove", function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        x = clamp((e.clientX - (rect.left + rect.width / 2)) * PULL);
        y = clamp((e.clientY - (rect.top + rect.height / 2)) * PULL);
        if (!queued) { queued = true; requestAnimationFrame(write); }
      });
      el.addEventListener("mouseleave", function () {
        rect = null; x = 0; y = 0;
        el.style.setProperty("--mag-x", "0px");
        el.style.setProperty("--mag-y", "0px");
      });
    });
  }

  /* ============================================================
     Pointer tilt
     A shallow 3D rotation toward the cursor. Capped at 6deg — beyond
     that the text edge blurs and it reads as a gimmick.
     ============================================================ */
  function initTilt() {
    if (!pointerFx()) return;
    var MAX_DEG = 6;

    document.querySelectorAll(".card, .tcard, .program-card").forEach(function (el) {
      var rect = null, queued = false, rx = 0, ry = 0;

      function write() {
        queued = false;
        el.style.setProperty("--tilt-x", rx.toFixed(2) + "deg");
        el.style.setProperty("--tilt-y", ry.toFixed(2) + "deg");
      }

      el.addEventListener("mouseenter", function () { rect = el.getBoundingClientRect(); });
      el.addEventListener("mousemove", function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        rx = -py * 2 * MAX_DEG;   // pointer above centre tips the card back
        ry = px * 2 * MAX_DEG;
        if (!queued) { queued = true; requestAnimationFrame(write); }
      });
      el.addEventListener("mouseleave", function () {
        rect = null;
        el.style.setProperty("--tilt-x", "0deg");
        el.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  /* ============================================================
     Click ripple
     One delegated listener rather than one per button, so buttons
     injected later (nav, footer, drawer) are covered automatically.
     The ripple element is transient and self-removing, which keeps it
     compatible with main.js's `btn.textContent = orig` round-trip on
     form submit.
     ============================================================ */
  function initRipple() {
    if (M.reduced) return;

    document.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest(".btn");
      if (!btn) return;

      var r = btn.getBoundingClientRect();
      if (!r.width) return;
      var size = Math.max(r.width, r.height) * 2;

      var span = document.createElement("span");
      span.className = "ripple";
      span.setAttribute("aria-hidden", "true");
      span.style.width = span.style.height = size + "px";
      // Keyboard activation reports clientX/Y of 0 — fall back to the centre.
      var cx = e.clientX || (r.left + r.width / 2);
      var cy = e.clientY || (r.top + r.height / 2);
      span.style.left = (cx - r.left) + "px";
      span.style.top = (cy - r.top) + "px";

      btn.appendChild(span);
      setTimeout(function () {
        if (span.parentNode) span.parentNode.removeChild(span);
      }, 650);
    }, { passive: true });
  }

  /* ============================================================
     Hero particle field  (homepage only)
     ------------------------------------------------------------
     A bespoke ~2KB canvas rather than Three.js. Three reasons this is
     not a WebGL scene: sw.js:30 bails on cross-origin requests so a CDN
     copy could never be cached and the hero would die offline; ~150KB
     gzipped would land squarely on the LCP element; and a fullscreen
     shader is a real battery cost on the entry-tier Android this
     audience actually browses on.

     Particles are drawn from two pre-rendered sprites — building a
     radial gradient per particle per frame is the usual reason these
     fields drop frames.
     ============================================================ */
  function initParticles() {
    if (M.reduced || !M.fine) return;          // no pointer, or user opted out
    if (window.innerWidth < 768) return;       // not worth the battery on phones

    var canvas = document.querySelector(".hero-particles");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    var COUNT = 44;
    var parts = [];
    var w = 0, h = 0, raf = 0, running = false, t = 0;
    var mx = 0, my = 0, tx = 0, ty = 0;         // eased pointer parallax

    function toRgb(hex, fallback) {
      var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec((hex || "").trim());
      return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : fallback;
    }
    var cs = getComputedStyle(document.documentElement);
    var COOL = toRgb(cs.getPropertyValue("--primary"), [37, 99, 235]);
    var WARM = toRgb(cs.getPropertyValue("--accent"), [6, 182, 212]);

    function sprite(rgb) {
      var S = 64, c = document.createElement("canvas");
      c.width = c.height = S;
      var g2 = c.getContext("2d");
      var grd = g2.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
      var base = rgb.join(",");
      grd.addColorStop(0, "rgba(" + base + ",1)");
      grd.addColorStop(0.35, "rgba(" + base + ",0.4)");
      grd.addColorStop(1, "rgba(" + base + ",0)");
      g2.fillStyle = grd;
      g2.fillRect(0, 0, S, S);
      return c;
    }
    var sprCool = sprite(COOL), sprWarm = sprite(WARM);

    function resize() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      if (!w || !h) return false;
      canvas.width = Math.round(w * DPR);
      canvas.height = Math.round(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      return true;
    }

    function seed() {
      parts.length = 0;
      for (var i = 0; i < COUNT; i++) {
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.8 + Math.random() * 2.2,
          a: 0.10 + Math.random() * 0.30,
          vy: 0.06 + Math.random() * 0.20,        // slow upward drift
          phase: Math.random() * Math.PI * 2,
          amp: 5 + Math.random() * 15,            // lateral sway
          depth: 0.3 + Math.random() * 0.7,       // parallax response
          warm: Math.random() < 0.3
        });
      }
    }

    function frame() {
      raf = 0;
      if (!running) return;
      t += 0.005;
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;

      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.y -= p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        var px = p.x + Math.sin(t + p.phase) * p.amp + mx * p.depth;
        var py = p.y + my * p.depth;
        var size = p.r * 9;
        ctx.globalAlpha = p.a;
        ctx.drawImage(p.warm ? sprWarm : sprCool, px - size / 2, py - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      schedule();
    }

    function schedule() { if (!raf && running) raf = requestAnimationFrame(frame); }
    function play() {
      if (running || M.reduced) return;
      running = true;
      canvas.classList.add("is-on");
      schedule();
    }
    function pause() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    if (!resize()) return;
    seed();

    var hero = canvas.closest(".hero");
    if (hero) {
      hero.addEventListener("mousemove", function (e) {
        var r = hero.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 26;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 18;
      });
      hero.addEventListener("mouseleave", function () { tx = 0; ty = 0; });
    }

    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { if (resize()) seed(); }, 180);
    }, { passive: true });

    // Stop burning frames once the hero has scrolled away, or the tab is hidden.
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) pause(); else play();
    });
    // Start unconditionally, then let the observer pause it once the hero
    // leaves the viewport. Starting *from* the observer instead would mean
    // that anywhere IntersectionObserver never delivers, the field silently
    // never appears — the same failure mode the reveal failsafe guards.
    play();
    if (window.IntersectionObserver && hero) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { e.isIntersecting ? play() : pause(); });
      }, { threshold: 0 }).observe(hero);
    }
  }

  /* ---------- Init ---------- */
  function start() {
    [initMagnetic, initTilt, initRipple, initParticles].forEach(function (fn) {
      try {
        fn();
      } catch (err) {
        if (window.console) console.error("[PathAhead/motion] " + (fn.name || "effect") + " failed:", err);
      }
    });
  }

  // main.js builds the nav and footer on DOMContentLoaded; run after it so
  // delegated and per-element handlers both see the finished DOM.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  M.loaded = true;
})();
