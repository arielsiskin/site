import type { NextApiRequest, NextApiResponse } from "next";
import { aiError, gemini, tts, type Content } from "@/lib/ai";
import { CHAT_STYLE, INTENT_HINT, isScenario, MAX_TURNS, SCENARIOS, STYLE, type Turn } from "@/lib/voicebot";

export const config = { api: { bodyParser: { sizeLimit: "4mb" } } };

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

/**
 * One turn of the demo bot. Voice (default): `audio` in, transcript + reply + mp3 out. Chat: `text` in and
 * `speak: false`, so no TTS. Neither audio nor text: the scenario's greeting.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { scenario, history = [], audio, mime, text, speak = true } = req.body ?? {};
  if (!isScenario(scenario)) return res.status(400).json({ error: "Escenario inválido" });
  const turns: Turn[] = Array.isArray(history) ? history : [];
  if (turns.length > MAX_TURNS * 2) return res.status(429).json({ error: "La demo termina acá: reiniciá la conversación." });
  if (turns.some((t) => (t?.role !== "user" && t?.role !== "bot") || typeof t.text !== "string" || t.text.length > 600))
    return res.status(400).json({ error: "Historial inválido" });
  if (text !== undefined && (typeof text !== "string" || !text.trim() || text.length > 500))
    return res.status(400).json({ error: "Mensaje inválido" });
  const s = SCENARIOS[scenario];

  try {
    const t0 = Date.now();
    // First turn: the bot greets, no model call needed.
    if (!audio && text === undefined) {
      const voice = speak ? await tts(s.greeting) : null;
      return res.json({ heard: null, reply: s.greeting, intent: null, entities: [], audio: voice, ms: { think: 0, voice: Date.now() - t0 } });
    }

    let last: Content;
    if (text !== undefined) {
      last = { role: "user", parts: [{ text }] };
    } else {
      if (typeof audio !== "string" || audio.length > MAX_AUDIO_B64) return res.status(413).json({ error: "Audio demasiado largo" });
      if (typeof mime !== "string" || !mime.startsWith("audio/")) return res.status(400).json({ error: "Formato de audio inválido" });
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
    res.json({ ...out, audio: voice, ms: { think: t1 - t0, voice: Date.now() - t1 } });
  } catch (err) {
    const [status, error] = aiError(err);
    res.status(status).json({ error });
  }
}
