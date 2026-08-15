import { GoogleGenAI } from "@google/genai";
import { ragContext } from "@/lib/rag-context";

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

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return new Response("Chat is not configured yet.", { status: 500 });
  }

  const { messages } = (await request.json()) as { messages: ChatMessage[] };

  const contents = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));

  const stream = await ai.models.generateContentStream({
    model: "gemini-3.5-flash",
    contents,
    config: { systemInstruction: SYSTEM_PROMPT },
  });

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
