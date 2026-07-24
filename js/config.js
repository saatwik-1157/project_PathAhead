/* ============================================================
   PathAhead — live integration config (committed deliberately).
   These are PUBLIC client-side keys, safe to expose by design:
   - Web3Forms access key: only lets the site send submissions
     TO the owner's inbox (like a public email alias). Rotate it
     free at web3forms.com if it ever attracts spam.
   - Supabase: currently EMPTY — the old project
     (ooxsdwjspjjrlhcyeaue) was deleted/expired, so its keys are
     dead. Recreate a project + `submissions` table with
     anon-INSERT-only RLS, then fill these in to re-enable the
     database backup and the admin page.
   ============================================================ */
window.PATHAHEAD_CONFIG = {
  web3formsKey: "68afc702-406b-4ed7-a88c-62bccf1cb03c",
  supabaseUrl: "",
  supabaseAnonKey: ""
};
