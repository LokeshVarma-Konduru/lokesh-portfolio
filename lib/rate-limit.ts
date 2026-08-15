/**
 * A small fixed-window limiter, shared by the public API routes.
 *
 * ponytail: per-instance and in memory. A serverless deployment can run several
 * instances at once, so the real ceiling is `limit` times however many are warm.
 * That is the right trade for a portfolio — it stops a script hammering an API
 * key without a Redis dependency for traffic that will never justify one. Move
 * to Vercel KV or Upstash if this ever needs to be exact.
 */

type Window = { limit: number; windowMs: number };

const buckets = new Map<string, number[]>();

export function rateLimit(key: string, { limit, windowMs }: Window) {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((at) => now - at < windowMs);

  // Bound the map: without this, every IP that ever calls stays in memory for
  // as long as the instance lives.
  if (buckets.size > 5000) buckets.clear();

  if (recent.length >= limit) {
    buckets.set(key, recent);
    return { limited: true, retryAfter: Math.ceil(windowMs / 1000) };
  }

  buckets.set(key, [...recent, now]);
  return { limited: false, retryAfter: 0 };
}

/** The caller's address, as far as the platform will tell us. */
export function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
