import { personal } from "@/lib/data";

/**
 * Delivers the contact form.
 *
 * Talks to Resend over plain fetch rather than through its SDK: the whole
 * integration is one POST with a bearer token, which is not worth a dependency.
 *
 * Without RESEND_API_KEY set this answers 503, and the form falls back to
 * composing a mailto in the visitor's own mail client — so the page works
 * before the key exists and keeps working if sending ever breaks.
 */

const FROM = process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>";

const MAX_PER_WINDOW = 3;
const WINDOW_MS = 10 * 60 * 1000;

/**
 * ponytail: per-instance rate limit, in memory. A serverless deployment can run
 * several instances, so the real ceiling is MAX_PER_WINDOW times however many
 * are warm. That is fine for a portfolio inbox; move to Upstash or Vercel KV if
 * this ever needs to be exact.
 */
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < WINDOW_MS);
  hits.set(ip, [...recent, now]);
  return recent.length >= MAX_PER_WINDOW;
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return Response.json({ error: "not-configured" }, { status: 503 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return Response.json({ error: "rate-limited" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  // Bots fill in every field they find. A real visitor never sees this one.
  if (clean(body.company, 100)) {
    return Response.json({ ok: true });
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const subject = clean(body.subject, 150);
  const message = clean(body.message, 5000);

  if (
    !name ||
    !email ||
    !message ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [personal.email],
      // Replying in the mail client goes to the visitor, not to Resend.
      reply_to: email,
      subject: subject || `Portfolio enquiry from ${name}`,
      text: `${message}\n\n—\n${name}\n${email}`,
    }),
  });

  if (!response.ok) {
    // The body carries the reason the send failed, which is worth having in the
    // function logs; the visitor gets a fallback either way.
    console.error("Resend rejected the message:", await response.text());
    return Response.json({ error: "send-failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
