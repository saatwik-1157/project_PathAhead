/* ============================================================
   PathAhead — lead store.

   Replaces the old "demo mode", where a submission was kept in
   the visitor's own browser and the admin panel read it back
   from there. That meant a lead was only ever visible on the
   machine that sent it, and the admin passcode was checked in
   JavaScript the visitor could read.

   Now every submission is written to Netlify Blobs, and the
   admin panel reads them back through this function after the
   passcode has been checked on the server. The passcode lives
   in the ADMIN_PASSCODE environment variable and never reaches
   the browser.

     POST /.netlify/functions/leads     store a submission
     GET  /.netlify/functions/leads     list them (passcode)
     DELETE /.netlify/functions/leads?key=…   remove one (passcode)
   ============================================================ */
import { getStore } from "@netlify/blobs";

const MAX_FIELD = 2000; // per value, so one submission cannot fill the store
const MAX_FIELDS = 30;
const KINDS = ["contact", "college_inquiry", "student_registration", "newsletter"];

export default async (req) => {
  const store = getStore({ name: "leads", consistency: "strong" });

  if (req.method === "POST") return save(req, store);
  if (req.method === "GET") return list(req, store);
  if (req.method === "DELETE") return remove(req, store);
  return json({ error: "Method not allowed" }, 405);
};

/* ---------- public: store a submission ---------- */
async function save(req, store) {
  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const kind = KINDS.includes(body?.kind) ? body.kind : null;
  if (!kind) return json({ error: "Unknown form" }, 400);

  const payload = {};
  let n = 0;
  for (const [k, v] of Object.entries(body?.data || {})) {
    if (n++ >= MAX_FIELDS) break;
    if (typeof v !== "string" && typeof v !== "number") continue;
    payload[String(k).slice(0, 60)] = String(v).slice(0, MAX_FIELD);
  }
  if (!Object.keys(payload).length) return json({ error: "Empty submission" }, 400);

  const now = new Date();
  const received = now.toISOString();
  // Millisecond timestamp rather than the ISO string: an ISO timestamp
  // contains colons, which the blob store escapes in the key and then fails
  // to list back. Thirteen digits stay sortable for the next few centuries.
  const key = `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`;

  await store.setJSON(key, { kind, payload, received });
  return json({ ok: true }, 201);
}

/* ---------- admin: read them back ---------- */
async function list(req, store) {
  const denied = authFail(req);
  if (denied) return denied;

  const { blobs } = await store.list();
  const items = await Promise.all(
    blobs.map(async (b) => {
      const v = await store.get(b.key, { type: "json" });
      return v ? { key: b.key, ...v } : null;
    })
  );

  const leads = items.filter(Boolean).sort((a, b) => (a.received < b.received ? 1 : -1));
  return json({ leads, count: leads.length });
}

async function remove(req, store) {
  const denied = authFail(req);
  if (denied) return denied;

  const key = new URL(req.url).searchParams.get("key");
  if (!key) return json({ error: "key required" }, 400);
  await store.delete(key);
  return json({ ok: true });
}

/* ---------- shared ---------- */
function authFail(req) {
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected) return json({ error: "Admin access is not configured." }, 503);

  const given = req.headers.get("x-admin-passcode") || "";
  // Compare every character so the time taken does not reveal the passcode.
  if (!timingSafeEqual(given, expected)) return json({ error: "Incorrect passcode" }, 401);
  return null;
}

function timingSafeEqual(a, b) {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
