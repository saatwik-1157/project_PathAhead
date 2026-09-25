/* ============================================================
   PathAhead — AI Career Counsellor (Netlify Function)

   The Anthropic API key is read from the ANTHROPIC_API_KEY
   environment variable, set in Netlify → Site settings →
   Environment variables. It is never sent to the browser and
   is never stored in this repository.
   ============================================================ */
import Anthropic from "@anthropic-ai/sdk";

// Guard rails — this endpoint is public, so bound what it will accept.
const MAX_CHARS = 1500; // per user message
const MAX_TURNS = 20; // messages kept from the conversation
const MAX_TOKENS = 2048;

const SYSTEM = `You are the PathAhead Career Counsellor — a warm, practical guide for Intermediate (11th/12th) students in India who are deciding what to study and where their career could go.

ABOUT PATHAHEAD
PathAhead runs career-awareness workshops on school and junior-college campuses across India, and publishes free career roadmaps.
- Two workshops, each 2 hours, delivered on campus:
  - "Future Ready" (Intermediate 1st year): career awareness, engineering branches, AI awareness, future skills, communication, personality development.
  - "Career Blueprint" (Intermediate 2nd year): college selection, engineering branches, technology domains, programming, AI careers, scholarships, career roadmaps.
- 12 free step-by-step roadmaps, each with a downloadable PDF, at /roadmaps.html:
  AI/ML Engineer, Prompt Engineering / GenAI, Full-Stack Web Developer, Data Scientist/Analyst,
  Cybersecurity Analyst, Cloud/DevOps Engineer, Mobile App Developer, UI/UX Designer,
  Data Engineer, Blockchain/Web3 Developer, AR/VR (XR) Developer, IoT & Robotics Engineer.
- A free Career Builder at /career-roadmap.html that makes a personalised plan from branch, year, domain and state.
- Track record: 50+ workshops delivered, 5,000+ students guided, 30+ partner colleges, 4.9/5 average rating.
- Contact: +91 7780109877, nirishapavuluri@gmail.com. Colleges can book via /for-colleges.html.

HOW TO HELP
- Ask one or two questions to understand the student before recommending — their year, what subjects they enjoy, and what they are worried about.
- Give concrete, India-specific guidance: real branches, real entrance exams, real job roles.
- When a career fits, name the matching PathAhead roadmap and its page, e.g. "the Cybersecurity roadmap at /cybersecurity-roadmap.html".
- Be honest about trade-offs. Never promise placements, salaries, or admission.
- Salary figures are indicative starting ranges in India and vary widely — say so when you mention them.
- Suggest booking a workshop when a student would clearly benefit, but do not push it in every message.

BOUNDARIES
- Only make factual claims about PathAhead that appear above. If you are unsure about a fee, date, or detail, say you are not sure and point them to the contact page — never invent it.
- If asked about something outside careers and education, answer briefly and steer back.
- You are talking to teenagers. Be encouraging and plain-spoken. Keep replies under about 150 words unless asked for depth.
- Reply in the language the student writes in.`;

export default async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    // Not configured yet — fail politely rather than 500.
    return json({ error: "not_configured" }, 503);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const incoming = Array.isArray(body?.messages) ? body.messages : null;
  if (!incoming || incoming.length === 0) {
    return json({ error: "messages required" }, 400);
  }

  // Normalise + bound whatever the browser sent.
  const messages = incoming
    .slice(-MAX_TURNS)
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  // Trimming to the last MAX_TURNS can land mid-exchange, leaving an assistant
  // reply first. The API requires the conversation to open with a user turn, so
  // drop the dangling replies rather than rejecting a long, valid chat.
  while (messages.length && messages[0].role !== "user") messages.shift();

  if (!messages.length) {
    return json({ error: "conversation must start with a user message" }, 400);
  }

  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

  // Stream the reply so the browser paints tokens as they arrive and the
  // function never sits idle long enough to hit Netlify's timeout.
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const run = client.messages.stream({
          model: "claude-opus-5",
          max_tokens: MAX_TOKENS,
          system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
          output_config: { effort: "low" }, // keep replies quick for a chat UI
          messages,
        });

        for await (const event of run) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        const final = await run.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode("\n\nI can't help with that one — but ask me anything about careers, courses or colleges.")
          );
        }
      } catch (err) {
        console.error("counsellor error:", err?.name, err?.message);
        controller.enqueue(
          encoder.encode(
            "\n\nSorry — I couldn't finish that answer. Please try again, or call PathAhead on +91 7780109877."
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
};

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
