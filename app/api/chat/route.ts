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
 * Generous enough for a real conversation, low enough that a script cannot run
 * up a bill on someone else's key.
 */
const RATE = { limit: 20, windowMs: 10 * 60 * 1000 };

/** Long enough for any answer this thing gives, short enough to bound abuse. */
const MAX_MESSAGES = 30;
const MAX_CHARS = 2000;

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return new Response("Chat is not configured yet.", { status: 500 });
  }

  const { limited, retryAfter } = rateLimit(`chat:${clientIp(request)}`, RATE);
  if (limited) {
    return new Response(
      "That's a lot of questions. Give it a few minutes, or email me directly.",
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const { messages } = (await request.json()) as { messages: ChatMessage[] };

  // The endpoint is public: without a cap on the transcript, one request can
  // carry an arbitrarily large prompt to a metered API.
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("No messages.", { status: 400 });
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
      model: "gemini-3.5-flash",
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
      try {
        for await (const chunk of stream) {
          if (chunk.text) {
            controller.enqueue(encoder.encode(chunk.text));
          }
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
