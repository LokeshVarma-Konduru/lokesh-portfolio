import { GoogleGenAI } from "@google/genai";
import { ragContext } from "@/lib/rag-context";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { personal } from "@/lib/data";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are a helpful assistant answering questions about Lokesh Varma Konduru,
a Software Engineer with 3+ years of experience. Answer questions based ONLY on the
information provided below. Be concise, professional, and factual. If asked something
not in the data, say you don't have that information.

Write short paragraphs. When several things genuinely belong in a list — projects,
technologies, responsibilities — use one item per line starting with "- ", or with
"1. " where the order matters. Keep items to a single line each.

Do not use any other markdown: no headers, no tables, no code fences, no links.
Two or three sentences is usually the right length for an answer.

--- LOKESH'S INFORMATION ---
${ragContext}`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * The lite variant, deliberately. The flagship's free tier allows twenty
 * requests a day — one curious visitor — and the lite models are given far more
 * room for a task that is only reading answers out of a context document.
 * gemini-2.5-flash and 2.5-flash-lite are not options: both now 404 for keys
 * that did not already have them.
 */
const MODEL = "gemini-3.5-flash-lite";

/**
 * Two limits, because they do different jobs.
 *
 * Per visitor: enough for a real conversation. This used to be twenty per ten
 * minutes, which was more permissive than the entire daily API allowance — one
 * person could drain the day in the time it takes to read the page.
 *
 * Per day: a ceiling across everyone, so the quota cannot be exhausted by
 * whoever arrives first. Set below the provider's own limit so the site answers
 * with its own message rather than surfacing an upstream error.
 */
const RATE = { limit: 6, windowMs: 10 * 60 * 1000 };
const DAILY = { limit: 180, windowMs: 24 * 60 * 60 * 1000 };

/** Long enough for any answer this thing gives, short enough to bound abuse. */
const MAX_MESSAGES = 30;
const MAX_CHARS = 2000;

/**
 * Answers already given, keyed by the question.
 *
 * Most visitors open the widget and click one of the four suggested questions
 * rather than typing their own, so the same handful of strings would otherwise
 * be sent to a metered API over and over for an answer that cannot change —
 * the context it is drawn from is fixed at build time. The first person to ask
 * pays for it and everyone after reads the cached reply.
 *
 * ponytail: in memory and per instance, so a cold start re-asks once. A file or
 * a KV store would survive that, and is not worth it for four strings.
 */
const answers = new Map<string, string>();

/** Only the opening question is cached; follow-ups depend on what came before. */
function cacheKey(messages: ChatMessage[]) {
  if (messages.length !== 1 || messages[0].role !== "user") return null;
  return messages[0].content.trim().toLowerCase().slice(0, 200);
}

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return new Response("Chat is not configured yet.", { status: 500 });
  }

  const { messages } = (await request.json()) as { messages: ChatMessage[] };

  // The endpoint is public: without a cap on the transcript, one request can
  // carry an arbitrarily large prompt to a metered API.
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("No messages.", { status: 400 });
  }

  // Checked before the limiters, deliberately: a cached answer never reaches
  // the API, so there is no quota to ration and no reason to turn it down.
  const key = cacheKey(messages);
  const cached = key ? answers.get(key) : undefined;
  if (cached) {
    return new Response(cached, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Cache": "hit",
      },
    });
  }

  const { limited, retryAfter } = rateLimit(`chat:${clientIp(request)}`, RATE);
  if (limited) {
    return new Response(
      "That's a lot of questions. Give it a few minutes, or email me directly.",
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  if (rateLimit("chat:global", DAILY).limited) {
    return new Response(
      `I've answered a lot of questions today. Email me at ${personal.email} and I'll reply myself.`,
      { status: 503, headers: { "Retry-After": "3600" } },
    );
  }

  const trimmed = messages.slice(-MAX_MESSAGES).map((message) => ({
    role: message.role,
    content: String(message.content ?? "").slice(0, MAX_CHARS),
  }));

  const contents = trimmed.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));

  /**
   * The upstream call can fail before a single token arrives, and the free tier
   * allows twenty requests a day — so quota exhaustion is a normal Tuesday, not
   * an exceptional case. Unhandled, it surfaced as a 500 and the widget said
   * "something went wrong", which tells a visitor nothing and tells me nothing
   * either. Each failure now says what it is.
   */
  let stream;
  try {
    stream = await ai.models.generateContentStream({
      model: MODEL,
      contents,
      config: { systemInstruction: SYSTEM_PROMPT },
    });
  } catch (error) {
    const status = (error as { status?: number })?.status;
    console.error("Gemini request failed:", status, error);

    if (status === 429) {
      return new Response(
        "I've hit my question limit for today. Email me at " +
          `${personal.email} and I'll reply myself.`,
        { status: 503, headers: { "Retry-After": "3600" } },
      );
    }

    return new Response(
      `Something went wrong reaching the assistant. You can email me at ${personal.email}.`,
      { status: 502 },
    );
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      let full = "";
      try {
        for await (const chunk of stream) {
          if (chunk.text) {
            full += chunk.text;
            controller.enqueue(encoder.encode(chunk.text));
          }
        }
        // Only a complete answer is worth keeping — a reply cut short by a
        // dropped connection would otherwise be served to everyone after.
        if (key && full) {
          if (answers.size > 200) answers.clear();
          answers.set(key, full);
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
