import { personal } from "@/lib/data";
import { clientIp, rateLimit } from "@/lib/rate-limit";

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

const RATE = { limit: 3, windowMs: 10 * 60 * 1000 };

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Everything below is written by a stranger and lands in an HTML document, so
 * it is escaped before it goes anywhere near the markup.
 */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Inline styles and no images, because mail clients strip <style> blocks and
 * block remote assets by default. System fonts for the same reason.
 */
function buildHtml({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 0;color:#71717a;font-size:13px;width:88px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;color:#18181b;font-size:14px;font-weight:500;">${value}</td>
    </tr>`;

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden;">
      <div style="background:#3b82f6;padding:14px 24px;">
        <p style="margin:0;color:#ffffff;font-size:13px;font-weight:600;letter-spacing:0.02em;">
          New message from your portfolio
        </p>
      </div>

      <div style="padding:24px;">
        <table style="width:100%;border-collapse:collapse;">
          ${row("From", escapeHtml(name))}
          ${row("Email", `<a href="mailto:${escapeHtml(email)}" style="color:#3b82f6;text-decoration:none;">${escapeHtml(email)}</a>`)}
          ${row("Subject", escapeHtml(subject))}
        </table>

        <div style="margin:20px 0 0;padding-top:20px;border-top:1px solid #e4e4e7;">
          <p style="margin:0 0 10px;color:#71717a;font-size:13px;">Message</p>
          <div style="color:#18181b;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(
            message,
          )}</div>
        </div>
      </div>

      <div style="padding:14px 24px;background:#fafafa;border-top:1px solid #e4e4e7;">
        <p style="margin:0;color:#71717a;font-size:12px;">
          Reply to this email and it goes straight to ${escapeHtml(name)}.
        </p>
      </div>
    </div>
  </body>
</html>`;
}

export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return Response.json({ error: "not-configured" }, { status: 503 });
  }

  const { limited, retryAfter } = rateLimit(
    `contact:${clientIp(request)}`,
    RATE,
  );
  if (limited) {
    return Response.json(
      { error: "rate-limited" },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
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
      // Who it is from leads, since that is what an inbox list truncates last.
      subject: `${name}: ${subject || "Message from your portfolio"}`,
      html: buildHtml({
        name,
        email,
        subject: subject || "No subject",
        message,
      }),
      // Plain-text alternative, for clients that refuse HTML and for the
      // notification previews that only ever read this part.
      text: [
        `From:    ${name}`,
        `Email:   ${email}`,
        `Subject: ${subject || "No subject"}`,
        "",
        "Message",
        "-------",
        message,
      ].join("\n"),
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
