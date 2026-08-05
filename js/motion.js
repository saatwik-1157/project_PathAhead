/* ============================================================
   PathAhead — Motion & 3D layer (progressive enhancement)
   Loads GSAP + ScrollTrigger and Three.js from CDN at idle time.
   If anything fails to load (offline, blocked CDN, old browser),
   the site falls back to the built-in CSS reveal system in
   main.js — nothing here is required for the page to work.
   Skipped entirely for prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still) { root.classList.remove("anim-hold"); return; }

  var GSAP_URL = "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js";
  var ST_URL = "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js";
  var THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.min.js";

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src; s.async = true;
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  // Safety valve: if GSAP hasn't arrived in 3s, hand the hero back to CSS.
  setTimeout(function () { if (!window.gsap) root.classList.remove("anim-hold"); }, 3000);

  /* ============================================================
     THREE.JS HERO — a living constellation behind the hero:
     drifting particles, a connective web, and two slowly turning
     wireframe solids. Mouse parallax + a gentle scroll dolly.
     Pixel ratio capped at 2, paused off-screen, disposed on leave.
     ============================================================ */
  function initHero3D() {
    var hero = document.querySelector(".hero");
    var bg = hero && hero.querySelector(".hero-bg");
    if (!bg || !window.WebGLRenderingContext) return;

    function start() {
      import(THREE_URL).then(function (THREE) { build(THREE); }).catch(function () { /* stay 2D */ });
    }
    if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 2500 });
    else setTimeout(start, 500);

    function build(THREE) {
      var mount = document.createElement("div");
      mount.className = "hero-3d";
      mount.setAttribute("aria-hidden", "true");
      bg.appendChild(mount);

      var renderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      } catch (e) { mount.remove(); return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      mount.appendChild(renderer.domElement);

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 260);
      camera.position.set(0, 0, 56);

      var small = window.innerWidth < 720;
      var COUNT = small ? 320 : 820;   // total drifting particles
      var NODES = small ? 42 : 76;     // the first N also form the web
      var LINK = 15;                   // max link distance
      var BOUND = { x: 74, y: 40, zNear: 18, zFar: -34 };

      // Soft round sprite so points render as glowing dots, not squares.
      var cnv = document.createElement("canvas");
      cnv.width = cnv.height = 64;
      var g = cnv.getContext("2d");
      var grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.35, "rgba(255,255,255,.55)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
      var sprite = new THREE.CanvasTexture(cnv);

      var PALETTE = [0x2563EB, 0x8B5CF6, 0x14B8A6, 0xEC4899, 0x0EA5E9];
      var pos = new Float32Array(COUNT * 3);
      var col = new Float32Array(COUNT * 3);
      var vel = new Float32Array(COUNT * 3);
      var c = new THREE.Color();
      for (var i = 0; i < COUNT; i++) {
        pos[i * 3]     = (Math.random() * 2 - 1) * BOUND.x;
        pos[i * 3 + 1] = (Math.random() * 2 - 1) * BOUND.y;
        pos[i * 3 + 2] = BOUND.zFar + Math.random() * (BOUND.zNear - BOUND.zFar);
        vel[i * 3]     = (Math.random() - 0.5) * 0.016;
        vel[i * 3 + 1] = (Math.random() - 0.5) * 0.012;
        vel[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
        c.setHex(PALETTE[i % PALETTE.length]);
        col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      }
      var pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      pGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      var points = new THREE.Points(pGeo, new THREE.PointsMaterial({
        size: 1.35, map: sprite, vertexColors: true, transparent: true, opacity: 0.85,
        depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
      }));
      scene.add(points);

      // Connective web between the nearest node particles.
      var MAXSEG = NODES * 5;
      var lPos = new Float32Array(MAXSEG * 6);
      var lGeo = new THREE.BufferGeometry();
      lGeo.setAttribute("position", new THREE.BufferAttribute(lPos, 3));
      var lines = new THREE.LineSegments(lGeo, new THREE.LineBasicMaterial({
        color: 0x8B5CF6, transparent: true, opacity: 0.16,
        depthWrite: false, blending: THREE.AdditiveBlending
      }));
      scene.add(lines);

      // Two faint wireframe solids give the scene real 3D depth.
      var ico = new THREE.Mesh(
        new THREE.IcosahedronGeometry(17, 1),
        new THREE.MeshBasicMaterial({ wireframe: true, color: 0x2563EB, transparent: true, opacity: 0.09 })
      );
      ico.position.set(27, 5, -18);
      scene.add(ico);
      var octa = new THREE.Mesh(
        new THREE.OctahedronGeometry(11, 0),
        new THREE.MeshBasicMaterial({ wireframe: true, color: 0x14B8A6, transparent: true, opacity: 0.07 })
      );
      octa.position.set(-30, -12, -24);
      scene.add(octa);

      // Neural "signals" — bright motes that travel along active web links.
      var SIG = small ? 3 : 6;
      var sPos = new Float32Array(SIG * 3);
      var sGeo = new THREE.BufferGeometry();
      sGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
      var signals = new THREE.Points(sGeo, new THREE.PointsMaterial({
        size: 2.6, map: sprite, color: 0xA78BFA, transparent: true, opacity: 0.9,
        depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
      }));
      scene.add(signals);
      var sigs = [];
      for (var si = 0; si < SIG; si++) sigs.push({ a: 0, b: 0, t: 1 + si * 0.35 });   // staggered starts

      function retargetSignal(s) {
        // pick a random node pair that's currently linked
        for (var tries = 0; tries < 8; tries++) {
          var a = (Math.random() * NODES) | 0, b = (Math.random() * NODES) | 0;
          if (a === b) continue;
          var dx = pos[a * 3] - pos[b * 3], dy = pos[a * 3 + 1] - pos[b * 3 + 1], dz = pos[a * 3 + 2] - pos[b * 3 + 2];
          if (dx * dx + dy * dy + dz * dz < LINK * LINK) { s.a = a; s.b = b; s.t = -Math.random() * 0.6; return; }
        }
        s.t = 1 + Math.random();   // nothing nearby — idle a bit and retry
      }

      var W = 0, H = 0;
      function size() {
        var r = bg.getBoundingClientRect();
        W = Math.max(1, r.width); H = Math.max(1, r.height);
        renderer.setSize(W, H, false);
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
      }
      size();
      // Re-measure whenever the hero's box actually changes (covers panel/
      // devtools layouts where no window resize event ever fires).
      if ("ResizeObserver" in window) new ResizeObserver(size).observe(bg);
      else window.addEventListener("resize", size);

      // Mouse parallax (hover-capable pointers only).
      var mx = 0, my = 0;
      if (matchMedia("(hover: hover)").matches) {
        hero.addEventListener("pointermove", function (e) {
          var r = hero.getBoundingClientRect();
          mx = ((e.clientX - r.left) / r.width) * 2 - 1;
          my = ((e.clientY - r.top) / r.height) * 2 - 1;
        });
      }

      // Only render while the hero is actually on screen.
      var visible = true;
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.02 })
          .observe(hero);
      }

      var raf = 0;
      function frame() {
        raf = requestAnimationFrame(frame);
        if (!visible || document.hidden) return;

        // drift + wrap
        for (var i = 0; i < COUNT; i++) {
          var ix = i * 3;
          pos[ix] += vel[ix]; pos[ix + 1] += vel[ix + 1]; pos[ix + 2] += vel[ix + 2];
          if (pos[ix] > BOUND.x) pos[ix] = -BOUND.x; else if (pos[ix] < -BOUND.x) pos[ix] = BOUND.x;
          if (pos[ix + 1] > BOUND.y) pos[ix + 1] = -BOUND.y; else if (pos[ix + 1] < -BOUND.y) pos[ix + 1] = BOUND.y;
          if (pos[ix + 2] > BOUND.zNear) pos[ix + 2] = BOUND.zFar; else if (pos[ix + 2] < BOUND.zFar) pos[ix + 2] = BOUND.zNear;
        }
        pGeo.attributes.position.needsUpdate = true;

        // rebuild the web
        var seg = 0;
        for (var a = 0; a < NODES && seg < MAXSEG; a++) {
          var ax = pos[a * 3], ay = pos[a * 3 + 1], az = pos[a * 3 + 2];
          for (var b = a + 1; b < NODES && seg < MAXSEG; b++) {
            var dx = ax - pos[b * 3], dy = ay - pos[b * 3 + 1], dz = az - pos[b * 3 + 2];
            if (dx * dx + dy * dy + dz * dz < LINK * LINK) {
              var o = seg * 6;
              lPos[o] = ax; lPos[o + 1] = ay; lPos[o + 2] = az;
              lPos[o + 3] = pos[b * 3]; lPos[o + 4] = pos[b * 3 + 1]; lPos[o + 5] = pos[b * 3 + 2];
              seg++;
            }
          }
        }
        lGeo.setDrawRange(0, seg * 2);
        lGeo.attributes.position.needsUpdate = true;

        // advance the travelling signals
        for (var s = 0; s < SIG; s++) {
          var sg = sigs[s];
          sg.t += 0.012;
          if (sg.t >= 1) { retargetSignal(sg); }
          var so = s * 3;
          if (sg.t >= 0 && sg.t < 1) {
            var k = sg.t, ai = sg.a * 3, bi = sg.b * 3;
            sPos[so]     = pos[ai] + (pos[bi] - pos[ai]) * k;
            sPos[so + 1] = pos[ai + 1] + (pos[bi + 1] - pos[ai + 1]) * k;
            sPos[so + 2] = pos[ai + 2] + (pos[bi + 2] - pos[ai + 2]) * k;
          } else {
            sPos[so] = 0; sPos[so + 1] = -9999; sPos[so + 2] = 0;  // parked off-screen
          }
        }
        sGeo.attributes.position.needsUpdate = true;

        ico.rotation.y += 0.0011; ico.rotation.x += 0.0005;
        octa.rotation.y -= 0.0009; octa.rotation.z += 0.0004;
        points.rotation.y += 0.00028;

        // parallax + scroll dolly
        var scrollN = Math.min(1, window.scrollY / Math.max(1, hero.offsetHeight));
        camera.position.x += (mx * 4 - camera.position.x) * 0.035;
        camera.position.y += (-my * 2.6 - scrollN * 7 - camera.position.y) * 0.035;
        camera.position.z = 56 - scrollN * 5;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      }
      frame();

      // Free GPU memory when the page is going away.
      window.addEventListener("pagehide", function () {
        cancelAnimationFrame(raf);
        pGeo.dispose(); lGeo.dispose(); sGeo.dispose();
        ico.geometry.dispose(); octa.geometry.dispose();
        points.material.dispose(); lines.material.dispose(); signals.material.dispose();
        ico.material.dispose(); octa.material.dispose();
        sprite.dispose();
        renderer.dispose();
      }, { once: true });
    }
  }

  /* ============================================================
     GSAP — hero intro timeline + scroll choreography
     ============================================================ */
  // Split an element's text into word spans, preserving styled child
  // spans (e.g. .text-gradient / .text-accent) word-by-word.
  function splitWords(el) {
    var words = [];
    var frag = document.createDocumentFragment();
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      var cls = node.nodeType === 1 && node.classList ? node.className : "";
      String(node.textContent).split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
        var s = document.createElement("span");
        s.className = ("g-word " + cls).trim();
        s.textContent = part;
        frag.appendChild(s);
        words.push(s);
      });
    });
    el.textContent = "";
    el.appendChild(frag);
    return words;
  }

  function heroIntro() {
    var hero = document.querySelector(".hero");
    if (!hero) { root.classList.remove("anim-hold"); return; }

    // Take the hero away from the CSS reveal system.
    hero.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("in");
      el.style.transition = "none";
    });

    // Split the headline into words (keeping the gradient span's styling).
    var h1 = hero.querySelector("h1");
    var words = h1 ? splitWords(h1) : [];

    root.classList.remove("anim-hold");

    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    // Solar hero (badge + sun + app mock). GSAP ignores targets that aren't
    // present, so this stays safe for any hero variant.
    if (hero.querySelector(".badge-split")) {
      tl.from(hero.querySelector(".badge-split"), { y: 24, autoAlpha: 0, duration: 0.55 })
        .from(hero.querySelector(".solar"), { yPercent: 14, autoAlpha: 0, duration: 1.4, ease: "power2.out" }, 0)
        .from(hero.querySelector(".app-mock"), { y: 46, autoAlpha: 0, duration: 0.95 }, 0.45);
    }
    tl.from(hero.querySelector(".eyebrow"), { y: 24, autoAlpha: 0, duration: 0.55 })
      .from(words, {
        yPercent: 115, autoAlpha: 0, rotateX: -50,
        transformOrigin: "50% 100%", transformPerspective: 600,
        duration: 0.85, stagger: 0.07
      }, "-=0.25")
      .from(hero.querySelector(".lead"), { y: 26, autoAlpha: 0, duration: 0.7 }, "-=0.45")
      .from(hero.querySelectorAll(".hero-actions .btn"), { y: 20, autoAlpha: 0, duration: 0.55, stagger: 0.09 }, "-=0.45")
      .from(hero.querySelector(".hero-trust"), { y: 16, autoAlpha: 0, duration: 0.5 }, "-=0.35")
      .from(hero.querySelector(".hero-media"), { y: 34, autoAlpha: 0, scale: 0.96, duration: 0.9 }, 0.3)
      // float cards keep their CSS `floaty` transform loop — fade opacity only
      .from(hero.querySelectorAll(".float-card"), { autoAlpha: 0, duration: 0.5, stagger: 0.12 }, "-=0.4");
  }

  function scrollEffects() {
    // Hero parallax — layers drift apart as you scroll away.
    var heroST = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
    if (document.querySelector(".hero .hm-main")) {
      gsap.to(".hero .hm-main", { yPercent: -7, ease: "none", scrollTrigger: heroST });
      gsap.to(".hero .hm-sub", { yPercent: 13, ease: "none", scrollTrigger: heroST });
    }
    if (document.querySelector(".hero-bg .aurora-1")) {
      gsap.to(".hero-bg .aurora-1", { yPercent: 34, ease: "none", scrollTrigger: heroST });
      gsap.to(".hero-bg .aurora-2", { yPercent: -26, ease: "none", scrollTrigger: heroST });
    }

    // Journey path — the dots march along the route forever.
    var jPath = document.querySelector(".journey-svg > path");
    if (jPath) gsap.to(jPath, { strokeDashoffset: -300, duration: 14, ease: "none", repeat: -1 });

    // Stats pop up one by one.
    if (document.querySelector(".stats .stat")) {
      gsap.from(".stat", {
        y: 38, autoAlpha: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".stats", start: "top 82%" }
      });
    }

    // Builder mock window tips in with perspective.
    if (document.querySelector(".bm-window")) {
      gsap.from(".bm-window", {
        y: 60, rotateX: 9, transformPerspective: 900, transformOrigin: "50% 0%",
        autoAlpha: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".builder-mock", start: "top 84%" }
      });
    }

    // Quote mark swings in.
    if (document.querySelector(".qmark")) {
      gsap.from(".qmark", {
        scale: 0.3, rotate: -16, autoAlpha: 0, duration: 0.8, ease: "back.out(1.6)",
        scrollTrigger: { trigger: ".quote-band", start: "top 78%" }
      });
    }

    // Photo band — images pan slowly inside their frames.
    gsap.utils.toArray(".pb-item img").forEach(function (img) {
      gsap.fromTo(img, { yPercent: -6, scale: 1.12 }, {
        yPercent: 6, scale: 1.12, ease: "none",
        scrollTrigger: { trigger: img.closest(".pb-item"), start: "top bottom", end: "bottom top", scrub: true }
      });
    });

    // Kinetic type band skews with scroll velocity (applied to the section —
    // the track's transform belongs to its CSS marquee animation).
    var kin = document.querySelector(".kinetic");
    if (kin) {
      var proxy = { s: 0 }, clamp = gsap.utils.clamp(-10, 10);
      ScrollTrigger.create({
        onUpdate: function (self) {
          var v = clamp(self.getVelocity() / -300);
          if (Math.abs(v) > Math.abs(proxy.s)) {
            proxy.s = v;
            gsap.to(proxy, {
              s: 0, duration: 0.9, ease: "power3", overwrite: true,
              onUpdate: function () { gsap.set(kin, { skewX: proxy.s }); }
            });
          }
        }
      });
    }
  }

  /* Card grids — ScrollTrigger.batch replaces the one-by-one IO reveal
     with coordinated staggers (only for cards still below the fold). */
  function cardBatches() {
    var cards = gsap.utils.toArray(".card.reveal, .tcard.reveal, .step.reveal, .program-card.reveal")
      .filter(function (el) { return !el.classList.contains("in"); });
    if (!cards.length) return;
    cards.forEach(function (el) { el.classList.add("in"); el.style.transition = "none"; });
    gsap.set(cards, { y: 44, autoAlpha: 0 });
    ScrollTrigger.batch(cards, {
      start: "top 88%",
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.09, ease: "power3.out", overwrite: true });
      }
    });
  }

  /* Section headings — the same word cascade as the hero, on scroll. */
  function headingReveals() {
    document.querySelectorAll(".section-head h2").forEach(function (h2) {
      if (h2.classList.contains("in")) return;   // already revealed by CSS — leave it
      h2.classList.add("in");
      h2.style.transition = "none";
      var words = splitWords(h2);
      gsap.from(words, {
        yPercent: 110, autoAlpha: 0, rotateX: -40,
        transformOrigin: "50% 100%", transformPerspective: 600,
        duration: 0.7, stagger: 0.05, ease: "power3.out",
        scrollTrigger: { trigger: h2, start: "top 86%", once: true }
      });
    });
  }

  /* Nav slips away when scrolling down, returns the instant you scroll up. */
  function navAutoHide() {
    var nav = document.querySelector(".nav");
    if (!nav) return;
    var hidden = false;
    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: function (self) {
        if (document.body.classList.contains("drawer-open")) return;
        var down = self.direction === 1 && self.scroll() > 320;
        if (down !== hidden) {
          hidden = down;
          gsap.to(nav, { yPercent: hidden ? -100 : 0, duration: 0.35, ease: "power2.out", overwrite: true });
        }
      }
    });
  }

  function initGsap() {
    if (!window.gsap || !window.ScrollTrigger) { root.classList.remove("anim-hold"); return; }
    gsap.registerPlugin(ScrollTrigger);
    heroIntro();
    navAutoHide();
    headingReveals();
    cardBatches();
    scrollEffects();
  }

  ready(function () {
    initHero3D();
    loadScript(GSAP_URL)
      .then(function () { return loadScript(ST_URL); })
      .then(initGsap)
      .catch(function () { root.classList.remove("anim-hold"); });
  });
})();
