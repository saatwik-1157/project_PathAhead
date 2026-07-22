# SentinelAI — Submission Package

AI-Driven Distributed Public Safety Mesh for Smart Cities.
*Transforming every streetlight into a silent guardian.*

This folder is the complete submission package built from the concept document
(authored by Nirisha Chowdary). Map to the submission checklist:

| Requirement | File | Status |
|---|---|---|
| Concept-to-prototype execution plan deck | `SentinelAI_Execution_Plan.pptx` (15 slides) + `SentinelAI_Execution_Plan.pdf` | ✅ ready — only the demo-video link pending |
| Demonstration evidence (demo video) | `demo/SentinelAI_Demo.mp4` (~64 s, recorded) + `demo/index.html` (live, interactive) | ✅ recorded — ⬜ upload & paste link into slide 12 |
| Team details and profiles | `TEAM.md` + `SentinelAI_Team_Profiles.pdf` (source: `team.html`) | ✅ complete (advisor names pending) |
| Other supporting documents | `SentinelAI_Concept_Document.pdf` (formatted concept, author: Nirisha Chowdary; source: `concept.html`) | ✅ |
| Validation evidence (strongly recommended) | `validation/survey.md` + `validation/interview-guides.md` — run them, attach the results | ⬜ collect responses |

> **After filling the placeholders in the PPTX, re-export the PDF** (File → Save As →
> PDF) so both formats match.

## 1. The deck — `SentinelAI_Execution_Plan.pptx`

15 slides: title → problem (sourced stats) → solution → capabilities →
architecture → tech stack → differentiation & IP → **execution plan
(5 phases, 8 months to prototype)** → budget (₹18–20 L breakdown) →
unit economics (indicative per-node BOM & pricing) → market & business
model → demonstration evidence → team → risks & mitigation → impact &
ask. Speaker notes are on every slide.

**Before submitting:**

1. **Slide 12** — paste the demo video link into the dashed box (the only
   remaining placeholder).
2. **Slide 10** — the unit-economics figures are indicative public-market
   pricing; swap in real vendor quotes when you have them.

Team details, college and contact emails are already filled in (slides 1, 13,
15, `TEAM.md` and `SentinelAI_Team_Profiles.pdf`); advisor names get added as
they're confirmed.

## 2. The demo — `demo/index.html`

A self-contained, no-install browser simulation of a 9-node SentinelAI mesh,
rendered as a live isometric 3D city block: extruded buildings, moving traffic
and pedestrians, glowing smart poles, animated mesh packets, a simulated IR
camera feed with AI detection boxes, and live sensor sparklines. Pure
HTML/CSS/JS in one file — no dependencies, no internet needed.

- **🚗 Simulate Vehicle Crash** — two vehicles collide; vibration → audio →
  vision confirmation, 3/3 validation gate, GPS dispatch to 112/108, Safe
  Corridor lighting, responder units arriving, sealed evidence pack.
- **🆘 Simulate Women's-Safety SOS** — SOS press → distress-audio + vision
  verification, floodlight deterrence (the follower retreats), police + family
  alerts, lit walking corridor with camera handoff between poles.
- **🔥 Risk Heatmap** — the predictive layer: a 30-day risk-forecast overlay
  built from mesh history. It's the closing scene of the auto demo.
- **Click any pole** to inspect it — the sensor-fusion panel and camera feed
  retarget to that node and the camera glides over. Useful for pointing at
  specific nodes while narrating.

### The recorded video — `demo/SentinelAI_Demo.mp4`

**A finished ~64-second recording of the full auto sequence is already in this
folder.** Upload it as *YouTube unlisted* (or Google Drive with link-sharing)
and paste the link into slide 12 of the deck and the submission form. No
recording work needed unless you want your own narrated take.

### Re-recording it yourself (optional, one take)

1. Open `demo/index.html` in any browser, full-screen it (F11).
2. Start a screen recording (Win+Alt+R with Xbox Game Bar, or OBS).
3. Click **▶ Run Full Demo (auto)** — it plays the whole sequence hands-free
   (~62 s): establishing shot → vehicle-crash flow → reset → women's-safety
   SOS flow → predictive risk-heatmap finale → end card. Keep the tab in the
   foreground so the animation timing stays smooth.
   > Tip: for a click-free take, open `demo/index.html#auto` instead — the full
   > demo starts by itself ~1 s after load. `#crash`, `#sos` and `#heat` do the
   > same for individual scenes.
4. Stop recording and upload.

The manual scenario buttons are still there if you'd rather pace it yourself
or talk over each step — the speaker notes on slides 3–5 work well as a
narration script.

## 2b. Validation kit — `validation/`

Evaluators reward evidence of talking to real users more than anything else —
and it's the concept author's own recommended next step. The kit makes it a
weekend task:

- **`survey.md`** — a 12-question public-safety survey ready to paste into
  Google Forms (20–50 anonymous responses; the response-summary charts are
  your evidence).
- **`interview-guides.md`** — question sets for a police officer, a 108/EMRI
  operations contact, a municipal official, and quick user mini-interviews,
  plus how to write up each conversation as attachable evidence.

Even partial results (one interview, 20 survey responses) are worth attaching
and quoting on the problem slide.

## 3. Suggested submission order

1. Run the survey + at least one stakeholder interview (`validation/`) →
   save results as PDFs in `validation/`.
2. Upload `demo/SentinelAI_Demo.mp4` (YouTube unlisted / Drive) → paste the
   link into slide 12 → re-export the deck PDF so it matches the PPTX.
3. Quote survey numbers on slide 2 if they're strong.
4. Attach: deck (PPTX or PDF), demo video link,
   `SentinelAI_Team_Profiles.pdf`, `SentinelAI_Concept_Document.pdf`, and
   validation results as "other supporting material".

## Honesty note

The demo is a **software simulation** — synthetic sensor values, no hardware.
It is labelled as such on slide 12 and in the demo footer. Present it as
"system-logic proof before hardware spend", never as a hardware prototype;
the hardware node demo is a Phase 2 deliverable in the execution plan.
