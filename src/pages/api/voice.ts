import type { APIRoute } from "astro";
import { aiError, gemini, type Content } from "@/lib/ai";
import { allow, clientIp } from "@/lib/ratelimit";
import { CHAT_STYLE, INTENT_HINT, isScenario, MAX_TURNS, SCENARIOS, type Turn } from "@/lib/voicebot";

export const prerender = false;

// Same model the voice worker uses: fast and cheap per turn.
const MODEL = process.env.VOICE_MODEL || "gemini-3.5-flash-lite";
const SCHEMA = {
  type: "object",
  properties: {
    heard: { type: "string" },
    reply: { type: "string" },
    intent: { type: "string" },
    entities: {
      type: "array",
      items: { type: "object", properties: { key: { type: "string" }, value: { type: "string" } }, required: ["key", "value"] },
    },
  },
  required: ["heard", "reply", "intent", "entities"],
  propertyOrdering: ["heard", "reply", "intent", "entities"],
};

type Out = { heard: string; reply: string; intent: string; entities: { key: string; value: string }[] };
const json = (body: unknown, status = 200) => Response.json(body, { status });

/** One turn of the IA Bot chat demo (BotDemo): `text` in, reply + intent + entities out. No text: the greeting.
 *  Text only on purpose: the voice demo is the LiveKit call (/api/call), so this public route never spends audio. */
export const POST: APIRoute = async ({ request }) => {
  if (!allow(`voice:${clientIp(request)}`, 60, 10 * 60_000)) return json({ error: "Muchas consultas seguidas: probá de nuevo en unos minutos." }, 429);
  const body = await request.json().catch(() => null);
  const { scenario, history = [], text } = body ?? {};
  if (!isScenario(scenario)) return json({ error: "Escenario inválido" }, 400);
  const turns: Turn[] = Array.isArray(history) ? history : [];
  if (turns.length > MAX_TURNS * 2) return json({ error: "La demo termina acá: reiniciá la conversación." }, 429);
  if (turns.some((t) => (t?.role !== "user" && t?.role !== "bot") || typeof t.text !== "string" || t.text.length > 600))
    return json({ error: "Historial inválido" }, 400);
  if (text !== undefined && (typeof text !== "string" || !text.trim() || text.length > 500)) return json({ error: "Mensaje inválido" }, 400);
  const s = SCENARIOS[scenario];

  try {
    const t0 = Date.now();
    // First turn: the bot greets, no model call needed.
    if (text === undefined) return json({ heard: null, reply: s.greeting, intent: null, entities: [], ms: { think: 0 } });
    const contents: Content[] = [
      ...turns.map((t): Content => ({ role: t.role === "user" ? "user" : "model", parts: [{ text: t.text }] })),
      { role: "user", parts: [{ text }] },
    ];
    const out = await gemini<Out>(MODEL, contents, SCHEMA, `${s.prompt}\n\n${CHAT_STYLE}\n${INTENT_HINT}\nEn heard repetí el mensaje del cliente.`);
    return json({ ...out, ms: { think: Date.now() - t0 } });
  } catch (err) {
    const [status, error] = aiError(err);
    return json({ error }, status);
  }
};
