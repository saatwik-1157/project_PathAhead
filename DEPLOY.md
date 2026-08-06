# Deploying PathAhead to Netlify

The site has no build step — the HTML *is* the site. The only thing Netlify
builds is the AI counsellor function, which needs one npm package.

Everything below has been tested end to end against Netlify's own local
runtime (`netlify dev`): the pages serve, the function loads and bundles, the
counsellor streams a reply, and the source files are blocked.

---

## 1. Connect the repository (recommended)

**Netlify → Add new site → Import an existing project → GitHub →
`saatwik-1157/project_PathAhead`**

Leave the build settings alone. `netlify.toml` already declares them:

| Setting | Value | Why |
|---|---|---|
| Build command | *(empty)* | nothing to compile |
| Publish directory | `.` | the repo root is the site |
| Functions directory | `netlify/functions` | where the counsellor lives |
| Node version | 22 | pinned so a Netlify default change cannot break the function |

Every `git push` then redeploys automatically. This is the route to prefer —
Netlify installs the dependency and bundles the function for you.

### Or upload by hand

A plain zip of the repo would break the AI: a manual upload skips
`npm install`, so `@anthropic-ai/sdk` would be missing and the counsellor
would fail even with the key set.

`PathAhead-site.zip` avoids that — the function inside it is already bundled,
so it needs no npm install and no build step:

```bash
node tools/build-dragdrop.mjs
```

Then drop the extracted folder on **Netlify → Sites → Deploy manually**.
Tested by extracting the zip to an empty directory and serving it with
nothing installed: pages, function and streaming reply all work.

The trade-off is that a manual upload has no link to git, so every future
change means rebuilding and re-uploading. Connect the repository instead if
you can.

---

## 2. Add the API key

**Site settings → Environment variables → Add a variable**

```
ANTHROPIC_API_KEY = sk-ant-...
```

Get the key from **console.anthropic.com**. It is read from the environment by
the function and is never sent to the browser or committed to the repo.

Then redeploy (**Deploys → Trigger deploy**) so the function picks it up.

Until this is set the counsellor answers honestly — *"the AI counsellor isn't
switched on yet, call PathAhead on +91 7780109877"* — rather than erroring.
Nothing else on the site depends on it.

**Set a monthly spend limit in the Anthropic console.** This is a public
endpoint. The function caps message length (1500 chars), history (20 turns)
and reply size (2048 tokens), which limits the cost of any single request, but
only a spend limit caps the total.

---

## 3. Point the site at the new domain

Canonical URLs, `og:image` and the sitemap are absolute, so they still name
the GitHub Pages address. Left alone, Google treats the Netlify site as a
duplicate of the old one and keeps ranking the old one.

Once you know the live URL, run this once and push:

```bash
node tools/set-domain.mjs https://your-site.netlify.app
```

It rewrites every page, `sitemap.xml`, `robots.txt` and the roadmap generator
(so regenerating cannot reintroduce the old domain). Re-running is harmless.

---

## 4. Check it worked

| Check | Expected |
|---|---|
| `https://your-site/` | home page, dark theme, hero headline visible |
| `https://your-site/roadmaps.html` | all 12 roadmap cards |
| The chat button, bottom right | replies as PathAhead's counsellor |
| Contact form | a real email arrives at `nirishapavuluri@gmail.com` |
| `https://your-site/package.json` | 404 |

If the counsellor says it "isn't switched on", the key is missing or the site
has not been redeployed since it was added.

---

## What is where

```
*.html                     24 pages (12 roadmap pages are generated)
css/styles.css             all styling
js/main.js                 nav, footer, forms, chat widget — injected at runtime
js/motion.js               GSAP + Three.js motion layer (progressive enhancement)
js/config.js               Web3Forms key (public by design)
netlify/functions/         the AI counsellor
roadmaps/build_roadmaps.py regenerates the 12 roadmap pages — edit this, not the HTML
tools/set-domain.mjs       switch the site to a new domain
```

**The roadmap pages are generated.** Editing
`cybersecurity-roadmap.html` by hand works until someone reruns the generator,
which overwrites it. Change `roadmaps/build_roadmaps.py` instead and run
`python roadmaps/build_roadmaps.py`.

## Forms

Form submissions are emailed via Web3Forms, and backed up in the visitor's own
browser. There is no database — the Supabase project was deleted, and the code
skips it cleanly. If a send fails the form says so and shows the phone number
rather than a false "thank you", so a lead is never silently lost.
