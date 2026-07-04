# PathAhead — Career Guidance Website

> **Your Career Starts Here.**
> A premium, responsive, production-ready marketing website for PathAhead — career awareness workshops for Intermediate (1st & 2nd year) students across India.

### 👥 Built by
This project was designed and developed by **two members**:

| Member | Email |
|--------|-------|
| **Saathwik** | saathwik.13@gmail.com |
| **Nirisha** | nirishapavuluri@gmail.com |

> 🔑 **Setup note:** integration keys live in `js/config.js`, which is git-ignored. After cloning, copy `js/config.example.js` → `js/config.js` and add your own keys (see [SETUP.md](SETUP.md)).

Built as a **zero-dependency static site** (HTML + CSS + vanilla JS). No build step, no Node.js, no frameworks. It runs by opening `index.html` in any browser and deploys anywhere (Netlify, Vercel, GitHub Pages, any web host) by uploading the folder.

**Production features included:** real form delivery (email + database), an admin dashboard, offline PWA, WhatsApp chat, full SEO, and analytics — all controlled from one `CONFIG` block and working in safe "demo mode" until you add your keys.

> 👉 **To go fully live** (email leads, database, deploy, analytics), follow **[SETUP.md](SETUP.md)** — a step-by-step guide. It takes ~30 minutes and no coding.

---

## 1. Quick start

**Option A — just open it**
Double-click `index.html`. Everything works offline (the Google Fonts link falls back to system fonts if there's no internet).

**Option B — run a local server (recommended for forms/routing)**
```bash
# from the project folder
python -m http.server 8000
# then visit http://localhost:8000
```

**Deploy**
- **Netlify / Vercel:** drag-and-drop the whole folder. Done.
- **GitHub Pages:** push to a repo → Settings → Pages → deploy from branch root.

---

## 2. Project structure

```
project_nirdhan/
├── index.html            # Home
├── about.html            # Our story, mission, vision, founder, values, timeline
├── programs.html         # Future Ready + Career Blueprint (topics + outcomes)
├── for-colleges.html     # Benefits, process, outcomes, booking, FAQ, inquiry form
├── for-students.html     # What students receive + registration form
├── gallery.html          # Workshop image grid + future videos
├── testimonials.html     # Filterable student/teacher/principal cards
├── faq.html              # Grouped accordion FAQ
├── contact.html          # Phone/email/WhatsApp + contact form + quick actions
├── css/
│   └── styles.css        # Full design system (tokens, components, responsive)
├── js/
│   └── main.js           # Shared navbar/footer/back-to-top + all interactions
├── assets/
│   ├── favicon.svg
│   └── PathAhead-Brochure.html   # Printable brochure (Download Brochure target)
├── .claude/launch.json   # Local preview config
└── README.md
```

**How the shared UI works:** the navbar, footer and back-to-top button are injected by `js/main.js` on every page from a single config object (`CONFIG` + `NAV`). Update them once and every page updates. Brand phone, email and nav links all live in that one place.

---

## 3. Functional Requirements (FR)

| # | Requirement | Where | Status |
|---|-------------|-------|--------|
| FR-1 | Sticky navigation with all 9 links + active-page highlight | All pages | ✅ |
| FR-2 | Responsive mobile menu (hamburger drawer) | All pages | ✅ |
| FR-3 | Hero with headline, subheading, "Book a Workshop" + "Download Brochure" | Home | ✅ |
| FR-4 | "Download Brochure" opens a printable / save-as-PDF brochure | Home, hero | ✅ |
| FR-5 | Two program cards (Future Ready, Career Blueprint) with topics + outcomes | Home, Programs | ✅ |
| FR-6 | "How It Works" 4-step process | Home, For Colleges | ✅ |
| FR-7 | Animated statistics counters | Home, Testimonials | ✅ |
| FR-8 | Testimonials with filter chips (All / Students / Teachers / Principals) | Testimonials | ✅ |
| FR-9 | Accordion FAQ (one-open-at-a-time) | Home, FAQ, For Colleges | ✅ |
| FR-10 | About page: story, mission, vision, founder, values, **timeline** | About | ✅ |
| FR-11 | College Booking / Inquiry form (Name, College, City, Phone, Email, Program, Message) | For Colleges | ✅ |
| FR-12 | Student Registration form (Name, Year, College, City, Phone, Email) | For Students | ✅ |
| FR-13 | Contact form (Name, College, City, Phone, Email, Message) | Contact | ✅ |
| FR-14 | Client-side form validation (required, email format, phone format) with inline errors | All forms | ✅ |
| FR-15 | Success confirmation message on submit + form reset | All forms | ✅ |
| FR-16 | Submissions saved locally (`localStorage`) — ready to swap for a real backend | All forms | ✅ |
| FR-17 | Newsletter subscribe with email validation | Home footer area | ✅ |
| FR-18 | Prominent contact details: **+91 7780109877**, **nirishapavuluri@gmail.com**, WhatsApp | Contact, Footer | ✅ |
| FR-19 | Click-to-call (`tel:`), click-to-email (`mailto:`), WhatsApp deep link | Contact, Footer | ✅ |
| FR-20 | Quick-action buttons: Call Now / Email Us / Book a Workshop | Contact | ✅ |
| FR-21 | Gallery image grid + "videos coming soon" placeholders | Gallery | ✅ |
| FR-22 | Back-to-top button (appears after scroll) | All pages | ✅ |
| FR-23 | Smooth scrolling for in-page anchors (with sticky-nav offset) | All pages | ✅ |
| FR-24 | Scroll-reveal animations on sections/cards | All pages | ✅ |
| FR-25 | Footer with logo, quick links, programs, contact, socials, copyright | All pages | ✅ |

### Premium enhancements (v2)
| # | Enhancement | Where | Status |
|---|-------------|-------|--------|
| FR-26 | Slim scroll-progress bar (reading position) | All pages | ✅ |
| FR-27 | Upgraded hero: grid texture + floating glass credential cards | Home | ✅ |
| FR-28 | Auto-scrolling "trusted by" marquee (pauses on hover) | Home | ✅ |
| FR-29 | **"The PathAhead Difference"** — With vs Without comparison | Home | ✅ |
| FR-30 | **Interactive Career Domains explorer** (AI, Data Science, Cybersecurity, Cloud, Software, Robotics) | Home | ✅ |
| FR-31 | **Interactive "Find your program" chooser** (year → recommended workshop) | Programs | ✅ |
| FR-32 | Founder quote band with signature | Home, About | ✅ |
| FR-33 | Subtle cursor "spotlight" on cards (desktop, tasteful) | All pages | ✅ |
| FR-34 | Open Graph + Twitter social cards + share image | All pages | ✅ |
| FR-35 | JSON-LD structured data (EducationalOrganization) for SEO | Home | ✅ |

### Form fields captured
- **College Inquiry:** name, designation, college, city, phone, email, program, students, message
- **Student Registration:** name, year, college, city, phone, email, message
- **Contact:** name, college, city, phone, email, message
- **Newsletter:** email

All are validated on the client and persisted under `localStorage` keys:
`pathahead_college_inquiry`, `pathahead_student_registration`, `pathahead_contact`, `pathahead_newsletter`.

---

## 4. Non-Functional Requirements (NFR)

| Category | Requirement | How it's met |
|----------|-------------|--------------|
| **Performance** | Fast first paint, minimal payload | No frameworks/bundles; pure HTML/CSS/JS; SVG icons inline (no icon-font download); fonts `display=swap` |
| **Responsiveness** | Works on Desktop, Tablet, Mobile | Fluid `clamp()` typography + breakpoints at 1024 / 820 / 560px; verified at 375px, 768px, 1360px |
| **Accessibility** | Keyboard + screen-reader friendly | Semantic landmarks, `aria-label`/`aria-expanded` on nav & accordion, visible focus rings, labelled form fields, `prefers-reduced-motion` support |
| **Usability** | Clear IA, consistent components, trust signals | Consistent nav/footer, obvious CTAs, inline validation with helpful errors |
| **Maintainability** | One source of truth for brand + nav | `CONFIG` and `NAV` in `main.js`; design tokens (CSS variables) in `:root` |
| **Browser support** | Modern evergreen browsers | Standard APIs (IntersectionObserver, backdrop-filter) with graceful fallbacks |
| **SEO** | Discoverable, shareable | Unique `<title>` + meta description per page, semantic headings, descriptive links, `theme-color` |
| **Reliability** | No runtime errors | Verified: all pages return 200, zero console errors/warnings, forms validate & submit |
| **Portability** | Runs anywhere, no install | Static files; works on `file://` and any static host |
| **Security** | Safe by construction | No inline secrets; external links use `rel="noopener"`; validation on input (add server-side validation when a backend is connected) |
| **Branding** | Premium, trustworthy, on-palette | Primary `#2563EB`, Secondary `#F97316`, Text `#1E293B`, BG `#FFFFFF`, Inter font |

---

## 5. Design system

- **Colors** (CSS variables in `css/styles.css` → `:root`):
  `--primary #2563EB` · `--secondary #F97316` · `--text #1E293B` · `--bg #FFFFFF` (+ slate neutrals)
- **Font:** Inter (Google Fonts) with a system-font fallback stack.
- **Components:** buttons (primary/secondary/outline/ghost/dark), cards, program cards, steps, stats, testimonial cards, accordion, timeline, gallery tiles, forms, CTA bands, newsletter.
- Change the palette in one place (`:root`) and it cascades everywhere.

### Social share image (one optional tip)
Link previews use `assets/og-image.svg`. Facebook, WhatsApp and LinkedIn preview SVGs inconsistently — for guaranteed thumbnails, open the SVG and export a **1200×630 PNG** (e.g. in Canva/Figma or any converter), save it as `assets/og-image.png`, and change the `og:image` / `twitter:image` paths in each page's `<head>` to `assets/og-image.png`. Everything else works as-is.

> **Browser note:** the numbered "How It Works" steps use the CSS `:has()` selector (supported in all current Chrome, Edge, Safari and Firefox).

### Replacing placeholder content
- **Gallery photos:** in `gallery.html`, swap the `.g-item` gradient backgrounds (`.gp1`–`.gp6`) for real images, e.g. `style="background-image:url('assets/photo1.jpg');background-size:cover"`.
- **Statistics:** edit the `data-count` / `data-suffix` attributes on the `.stat` blocks.
- **Testimonials / FAQ / timeline:** plain HTML — edit the text directly.
- **Founder photo:** replace the `PA` avatar block in `about.html`.

---

## 6. Backend, admin & production features (built in)

These are **already implemented** and wired up — you just add your keys in `CONFIG` (see **[SETUP.md](SETUP.md)**). Until then, they run in safe demo mode.

| Feature | How it works | To activate |
|---------|--------------|-------------|
| **Email leads** | Every submission POSTs to Web3Forms → your inbox | `CONFIG.web3formsKey` |
| **Database** | Submissions insert into Supabase `submissions` table | `CONFIG.supabaseUrl` + `supabaseAnonKey` |
| **Admin dashboard** (`/admin.html`) | Supabase-Auth login → live counts, tables, CSV export | Create an admin user in Supabase |
| **Local backup** | Every lead is also saved to `localStorage` — never lost | Always on |
| **PWA / offline** | `manifest.webmanifest` + `sw.js` — installable, works offline | Always on (over http/https) |
| **WhatsApp chat** | Floating button, pre-filled booking message | Edit `CONFIG.whatsappMsg` |
| **SEO** | Titles, OG/Twitter, JSON-LD, `sitemap.xml`, `robots.txt`, canonical, `404.html` | Set `CONFIG.siteUrl` + domain in sitemap/robots |
| **Analytics** | Privacy-friendly Plausible, loaded only if set | `CONFIG.analyticsDomain` |

The send pipeline lives in `sendSubmission()` in `js/main.js`: it always backs up locally, then delivers to whatever is configured (email + database), and shows a fallback "call/email us" message if a network send ever fails — so a lead is never silently lost.

**Supabase security model:** the included SQL uses Row Level Security so the public (anon key) can only *insert* leads, and only an authenticated admin can *read* them. Full SQL + steps are in [SETUP.md](SETUP.md).

### Future modules the schema already supports
Workshop bookings (status: new / contacted / booked), certificate generation (reuse the brochure print flow), and email notifications (Supabase Edge Function on insert).

---

## 7. Verification performed

- ✅ All 9 pages + assets return HTTP 200
- ✅ Zero console errors / warnings
- ✅ Navbar, footer, back-to-top injected on every page; active link highlighting correct
- ✅ Accordion open/close, counters, and scroll-reveal all firing
- ✅ Forms: empty submit flags all required fields; valid submit clears errors, shows success banner, saves data
- ✅ Responsive verified at mobile (375px), tablet (768px) and desktop (1360px)
- ✅ Inter font loads; palette matches brief exactly

---

## 8. Contact

**Phone:** +91 7780109877 · +91 9989057655
**Email:** nirishapavuluri@gmail.com · saathwik.13@gmail.com

© 2026 PathAhead. All Rights Reserved.
