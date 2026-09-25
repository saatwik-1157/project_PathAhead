# scripts

Maintenance scripts, run from the repo root with Node 22+. They operate on the
site in `apps/web` and the functions in `apps/api/functions`; none of them is
part of the Netlify build.

| Script | Command | Does |
|---|---|---|
| `set-domain.mjs` | `node scripts/set-domain.mjs https://your-site.netlify.app` | Rewrites canonical / OG / sitemap / robots URLs to a new domain (idempotent) |
| `build-dragdrop.mjs` | `node scripts/build-dragdrop.mjs [--keep]` | Builds `PathAhead-site.zip` (or `dist-dragdrop/`) with functions pre-bundled for a manual Netlify upload; fails if a page references a missing file. Uses `npx esbuild`. |
| `add-courses.mjs` | `node scripts/add-courses.mjs` | Data migration that adds non-engineering courses to `apps/web/career-data`. Already applied; re-running skips existing slugs and leaves the files unchanged |
