import type { APIRoute } from "astro";
import { allow, clientIp } from "@/lib/ratelimit";
import { verify } from "@/lib/turnstile";
import { COUNTRIES, sendLead, type Lead } from "@/lib/zoho";

export const prerender = false;

const json = (body: unknown, status = 200) => Response.json(body, { status });
const LIMITS = { nombre: 100, empresa: 120, email: 160, telefono: 40, pais: 40, mensaje: 2000 } as const;

/** Contact form: Turnstile first (a bot posting here directly has no valid token), then validation, then the lead. */
export const POST: APIRoute = async ({ request }) => {
  const ip = clientIp(request);
  if (!allow(`contact:${ip}`, 5, 3600_000)) return json({ error: "Recibimos varios mensajes desde esta red. Probá en un rato o escribinos por WhatsApp." }, 429);

  const body = (await request.json().catch(() => null)) ?? {};
  if (!(await verify(String(body.token ?? ""), ip))) return json({ error: "No pudimos verificar que no seas un robot. Probá de nuevo." }, 400);

  const lead = Object.fromEntries(Object.entries(LIMITS).map(([k, max]) => [k, String(body[k] ?? "").trim().slice(0, max)])) as Lead;
  if (!lead.nombre || !lead.empresa || !lead.mensaje || !lead.telefono) return json({ error: "Completá nombre, empresa, teléfono y mensaje." }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return json({ error: "Revisá el email." }, 400);
  if (!COUNTRIES.includes(lead.pais)) return json({ error: "Elegí tu país." }, 400);

  try {
    await sendLead(lead);
  } catch (e) {
    // Never lose a lead: if Zoho fails it stays in Cloud Logging (filter jsonPayload.type="lead_unsent").
    console.error(JSON.stringify({ severity: "ERROR", type: "lead_unsent", error: String(e), ...lead }));
  }
  return json({ ok: true });
};
