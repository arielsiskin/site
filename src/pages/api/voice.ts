import type { APIRoute } from "astro";
import { aiError, gemini, tts, type Content } from "@/lib/ai";
import { allow, clientIp } from "@/lib/ratelimit";
import { CHAT_STYLE, INTENT_HINT, isScenario, MAX_TURNS, SCENARIOS, STYLE, type Turn } from "@/lib/voicebot";

export const prerender = false;

// Same model the QualityIQ practice worker uses for its simulated client: fast and cheap per turn.
const MODEL = process.env.VOICE_MODEL || "gemini-3.5-flash-lite";
const MAX_AUDIO_B64 = 3_000_000; // ~2.2 MB of 16 kHz wav: about a minute of speech
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

/**
 * One turn of the demo bot. Voice (default): `audio` in, transcript + reply + mp3 out. Chat: `text` in and
 * `speak: false`, so no TTS. Neither audio nor text: the scenario's greeting.
 */
export const POST: APIRoute = async ({ request }) => {
  if (!allow(`voice:${clientIp(request)}`, 60, 10 * 60_000)) return json({ error: "Muchas consultas seguidas: probá de nuevo en unos minutos." }, 429);
  const body = await request.json().catch(() => null);
  const { scenario, history = [], audio, mime, text, speak = true } = body ?? {};
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
    if (!audio && text === undefined) {
      const voice = speak ? await tts(s.greeting) : null;
      return json({ heard: null, reply: s.greeting, intent: null, entities: [], audio: voice, ms: { think: 0, voice: Date.now() - t0 } });
    }

    let last: Content;
    if (text !== undefined) {
      last = { role: "user", parts: [{ text }] };
    } else {
      if (typeof audio !== "string" || audio.length > MAX_AUDIO_B64) return json({ error: "Audio demasiado largo" }, 413);
      if (typeof mime !== "string" || !mime.startsWith("audio/")) return json({ error: "Formato de audio inválido" }, 400);
      last = {
        role: "user",
        parts: [
          { inlineData: { mimeType: mime.split(";")[0], data: audio } },
          { text: "Transcribí textual lo que dijo el cliente en este audio (heard) y respondé como Maya (reply)." },
        ],
      };
    }
    const contents: Content[] = [
      ...turns.map((t): Content => ({ role: t.role === "user" ? "user" : "model", parts: [{ text: t.text }] })),
      last,
    ];
    const system = `${s.prompt}\n\n${text !== undefined ? CHAT_STYLE : STYLE}\n${INTENT_HINT}${text !== undefined ? "\nEn heard repetí el mensaje del cliente." : ""}`;
    const out = await gemini<Out>(MODEL, contents, SCHEMA, system);
    const t1 = Date.now();
    const voice = speak ? await tts(out.reply) : null;
    return json({ ...out, audio: voice, ms: { think: t1 - t0, voice: Date.now() - t1 } });
  } catch (err) {
    const [status, error] = aiError(err);
    return json({ error }, status);
  }
};
