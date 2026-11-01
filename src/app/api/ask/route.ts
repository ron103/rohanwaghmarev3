import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/profile-context";

// Answers stream back as plain text. Without ANTHROPIC_API_KEY the route
// reports itself disabled and the page uses Rohan's canned answers instead.

const MAX_QUESTION = 400;
const MAX_HISTORY = 6; // prior turns kept for follow-ups
const WINDOW_MS = 60_000;
const PER_WINDOW = 8;

const SORRY = "I can't answer that one here. Email me and I'll reply properly.";
const BROKEN = "Something went wrong on my end. Try again in a moment, or email me.";

// Best-effort per-instance rate limit. Good enough for a portfolio; swap for a
// shared store (Upstash, Vercel KV) if traffic ever warrants it.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > PER_WINDOW;
}

type Turn = { from: "you" | "rohan"; text: string };

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "disabled" }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return Response.json({ error: "slow down" }, { status: 429 });
  }

  let question = "";
  let history: Turn[] = [];
  try {
    const body = (await request.json()) as { question?: unknown; history?: unknown };
    question = typeof body.question === "string" ? body.question.trim().slice(0, MAX_QUESTION) : "";
    if (Array.isArray(body.history)) {
      history = body.history
        .filter((t): t is Turn => !!t && (t.from === "you" || t.from === "rohan") && typeof t.text === "string")
        .slice(-MAX_HISTORY)
        .map((t) => ({ from: t.from, text: t.text.slice(0, 1200) }));
    }
  } catch {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  if (!question) return Response.json({ error: "empty question" }, { status: 400 });

  // History must alternate and start with the visitor.
  const messages: Anthropic.Beta.BetaMessageParam[] = [];
  for (const t of history) {
    const role = t.from === "you" ? "user" : "assistant";
    if (messages.length === 0 && role !== "user") continue;
    if (messages.at(-1)?.role === role) continue;
    messages.push({ role, content: t.text });
  }
  if (messages.at(-1)?.role === "user") messages.pop();
  messages.push({ role: "user", content: question });

  const client = new Anthropic();
  const stream = client.beta.messages.stream({
    model: "claude-opus-5-5",
    max_tokens: 2048, // answers are deliberately short
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default", // a policy decline re-runs on Anthropic's recommended fallback model
    output_config: { effort: "low" },
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    messages,
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sent = false;
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
            sent = true;
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal" && !sent) controller.enqueue(encoder.encode(SORRY));
      } catch (error) {
        if (error instanceof Anthropic.RateLimitError) {
          if (!sent) controller.enqueue(encoder.encode("Lots of questions right now. Try again in a minute."));
        } else if (error instanceof Anthropic.APIError) {
          console.error(`ask: API error ${error.status}`, error.message);
          if (!sent) controller.enqueue(encoder.encode(BROKEN));
        } else {
          console.error("ask: unexpected error", error);
          if (!sent) controller.enqueue(encoder.encode(BROKEN));
        }
      }
      controller.close();
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
}
