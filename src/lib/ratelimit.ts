// shortcut: fixed-window counter in memory, per Cloud Run instance (max-instances is capped in deploy.sh, so the
// real limit is at most limit × instances). Move to Memorystore or Cloud Armor if the site gets real abuse.
const hits = new Map<string, { start: number; n: number }>();

/** True if `key` may make another request: at most `limit` per `windowMs`. */
export function allow(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  const h = hits.get(key);
  if (!h || now - h.start >= windowMs) {
    if (hits.size > 10_000) hits.clear(); // bound memory under a flood of distinct IPs
    hits.set(key, { start: now, n: 1 });
    return true;
  }
  if (h.n >= limit) return false;
  h.n++;
  return true;
}

/** The caller's IP: Cloud Run appends the real client IP last in X-Forwarded-For; earlier entries come from the
 * client and can be forged. shortcut: assumes no load balancer in front; behind one, take the second-to-last. */
export const clientIp = (req: Request, fallback = "local") =>
  req.headers.get("x-forwarded-for")?.split(",").pop()?.trim() || fallback;
