// Cloudflare Turnstile: the widget in ContactForm.tsx hands the browser a single-use token; /api/contact checks it here.
export const SITE_KEY = "0x4AAAAAAGREfog0nIbRImeh";
// Cloudflare's documented test keys (always pass): the real widget only accepts mayday.global hostnames.
export const TEST_SITE_KEY = "1x00000000000000000000AA";
const TEST_SECRET = "1x0000000000000000000000000000000AA";
export const ACTION = "contacto";
const HOSTS = new Set(["mayday.global", "www.mayday.global"]);

type Result = { success: boolean; action?: string; hostname?: string; "error-codes"?: string[] };

/** Did Cloudflare vouch for this token, for our form, on our site? (test keys answer with a placeholder hostname) */
export const accepted = (r: Result, test: boolean) => r.success && (test || (r.action === ACTION && HOSTS.has(r.hostname ?? "")));

/** Verifies a widget token with Cloudflare's siteverify. Without a secret it only works outside production (test key). */
export async function verify(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET || (import.meta.env.PROD ? "" : TEST_SECRET);
  if (!secret || !token || token.length > 2048) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);
  const r = (await res?.json().catch(() => null)) as Result | null;
  return !!r && accepted(r, secret === TEST_SECRET);
}
