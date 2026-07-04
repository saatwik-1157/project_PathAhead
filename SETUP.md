# PathAhead — Go-Live Setup Guide

Your site works **right now** in "demo mode" (form submissions are saved in the visitor's browser). To turn it into a real, production-grade lead system, complete the steps below. Everything is controlled from **one place**: the `CONFIG` block at the top of [`js/main.js`](js/main.js).

There is **no build step** — edit the file, save, re-upload. That's it.

---

## ⚡ TL;DR — the one config block

Open `js/main.js`, find `var CONFIG = {` near the top, and fill in:

```js
siteUrl:         "https://yourdomain.com",   // your real domain
web3formsKey:    "xxxxxxxx-xxxx-...",         // Step 1 — emails you every lead
supabaseUrl:     "https://xxxx.supabase.co",  // Step 2 — database + admin
supabaseAnonKey: "eyJhbGci...",               // Step 2
analyticsDomain: "yourdomain.com",            // Step 4 — optional
```

Leave any of them blank to keep that feature in demo mode. Nothing breaks.

---

## Step 1 — Get leads by email (5 minutes) ✉️

So every form submission lands in your inbox automatically.

1. Go to **https://web3forms.com** → enter your email (`nirishapavuluri@gmail.com`) → you'll get an **Access Key**.
2. Paste it into `CONFIG.web3formsKey` in `js/main.js`.
3. Done. Submit a test form — it arrives in your email within seconds.

> Web3Forms is free (250 submissions/month) and needs **no backend**. It works perfectly with this static site. You can add `saathwik.13@gmail.com` as a second recipient inside the Web3Forms dashboard.

---

## Step 2 — Database + Admin Dashboard (15 minutes) 🗄️

So every lead is stored in a real database and viewable at **`/admin.html`** from any device.

### 2a. Create the project
1. Go to **https://supabase.com** → create a free account → **New project**.
2. Once ready, open **Project Settings → API** and copy:
   - **Project URL** → paste into `CONFIG.supabaseUrl`
   - **anon public** key → paste into `CONFIG.supabaseAnonKey`

### 2b. Create the table (run this SQL)
In Supabase → **SQL Editor** → New query → paste and **Run**:

```sql
create table submissions (
  id uuid primary key default gen_random_uuid(),
  kind text not null,                 -- contact | college_inquiry | student_registration | newsletter
  payload jsonb not null,             -- the form fields
  created_at timestamptz default now()
);

alter table submissions enable row level security;

-- The website (anon key) may ONLY insert new submissions...
create policy "public can submit"
  on submissions for insert to anon with check (true);

-- ...and only logged-in admins may read them.
create policy "admins can read"
  on submissions for select to authenticated using (true);
```

This is secure by design: visitors can submit, but **nobody can read the leads without logging in.**

### 2c. Create your admin login
Supabase → **Authentication → Users → Add user** → enter your email + a password. That's your admin account.

### 2d. Use the dashboard
Open **`yourdomain.com/admin.html`** → sign in with that email/password.
You'll see live counts, tables for each form type, and an **Export CSV** button.

> **Demo mode (before Supabase):** `/admin.html` still works — enter the passcode `pathahead` (change it via `CONFIG.adminPasscode`) to preview submissions saved in your current browser. `admin.html` is `noindex` and blocked in `robots.txt`.

---

## Step 3 — Publish it live (10 minutes) 🚀

### Option A — Netlify (easiest, free)
1. Go to **https://app.netlify.com** → **Add new site → Deploy manually**.
2. Drag the **entire project folder** onto the page. It's live in seconds on a `*.netlify.app` URL.
3. (Optional) **Domain settings → Add custom domain** to use `pathahead.in` or similar.
4. A `netlify.toml` is already included (security headers, 404 page, caching).

### Option B — Vercel / GitHub Pages
- **Vercel:** `vercel` CLI or import the repo — it's a static site, no config needed.
- **GitHub Pages:** push to a repo → Settings → Pages → deploy from branch root.

### After deploying — update the domain in 3 places
1. `CONFIG.siteUrl` in `js/main.js`
2. `sitemap.xml` (replace `pathahead.example`)
3. `robots.txt` (replace `pathahead.example`)

Then submit your sitemap at **Google Search Console** so you show up on Google.

---

## Step 4 — Analytics (optional, 5 minutes) 📊

Privacy-friendly, no cookie banner needed.
1. Sign up at **https://plausible.io** (or self-host) → add your domain.
2. Put your domain in `CONFIG.analyticsDomain`.
3. The tracking script loads automatically only when this is set.

---

## Already built in — nothing to configure ✅

- **PWA / installable app** — visitors can "Add to Home Screen"; the site works offline after first visit (`manifest.webmanifest` + `sw.js`).
- **Floating WhatsApp button** — opens a chat to +91 7780109877 with a pre-filled booking message (edit `CONFIG.whatsappMsg`).
- **SEO** — per-page titles/descriptions, Open Graph + Twitter cards, JSON-LD, `sitemap.xml`, `robots.txt`, canonical URLs, custom `404.html`.
- **Local backup** — every submission is always saved to the browser too, so a lead is never lost even if the network hiccups.

### One optional polish
The PWA icon and social share image are SVGs (`assets/icon.svg`, `assets/og-image.svg`). For the widest device/social support, export each to PNG (`icon-512.png`, `og-image.png`) and update the references in `manifest.webmanifest` and the page `<head>`s. Not required — SVGs work in all modern browsers.

---

## Quick reference — where things live

| Thing | File |
|-------|------|
| All keys & settings | `js/main.js` → `CONFIG` |
| Form send logic | `js/main.js` → `sendSubmission()` |
| Admin dashboard | `admin.html` |
| Offline / PWA | `sw.js`, `manifest.webmanifest` |
| Deploy config | `netlify.toml` |
| SEO | `sitemap.xml`, `robots.txt`, each page `<head>` |
