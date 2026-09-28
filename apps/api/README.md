# apps/api — Netlify Functions

`netlify.toml` → `[functions] directory = "apps/api/functions"`. Each file is
served at `/.netlify/functions/<name>` and bundled with esbuild on deploy.
Dependencies come from the root `package.json` (Netlify's base directory).

| Function | Route | Needs env var | Does |
|---|---|---|---|
| `leads.mjs` | `/.netlify/functions/leads` | `ADMIN_PASSCODE` (for GET/DELETE) | POST stores a form submission in Netlify Blobs (store `leads`); GET/DELETE list/remove them for `/admin.html` |
| `counsellor.mjs` | `/.netlify/functions/counsellor` | `ANTHROPIC_API_KEY` | AI career counsellor chat; returns 503 `not_configured` until the key is set |

Run locally with the Netlify runtime: `npm install` then `npx netlify dev`
from the repo root.
