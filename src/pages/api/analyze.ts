import type { APIRoute } from "astro";
import { aiError, gemini } from "@/lib/ai";
import { allow, clientIp } from "@/lib/ratelimit";
import { ANALYSIS_PROMPT, ANALYSIS_SCHEMA, type Analysis } from "@/lib/qiq";

export const prerender = false;

// shortcut: audio goes inline as base64 (max ~8 MB, Cloud Run takes 32 MB bodies). For longer calls upload to a
// bucket and pass Gemini a file URI, like QualityIQ does.
const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash"; // pinned, same as QualityIQ
const MAX_AUDIO_B64 = 11_000_000;
const json = (body: unknown, status = 200) => Response.json(body, { status });

export const POST: APIRoute = async ({ request }) => {
  if (!allow(`analyze:${clientIp(request)}`, 6, 60 * 60_000)) return json({ error: "Llegaste al límite de análisis de la demo por esta hora." }, 429);
  if (Number(request.headers.get("content-length") ?? 0) > MAX_AUDIO_B64 + 1000)
    return json({ error: "El audio supera 8 MB: probá con una llamada más corta." }, 413);
  const { audio, mime } = (await request.json().catch(() => null)) ?? {};
  if (typeof audio !== "string" || !audio) return json({ error: "Falta el audio" }, 400);
  if (audio.length > MAX_AUDIO_B64) return json({ error: "El audio supera 8 MB: probá con una llamada más corta." }, 413);
  if (typeof mime !== "string" || !mime.startsWith("audio/")) return json({ error: "El archivo no es un audio" }, 400);
  try {
    const analysis = await gemini<Analysis>(
      MODEL,
      [{ role: "user", parts: [{ inlineData: { mimeType: mime, data: audio } }, { text: ANALYSIS_PROMPT }] }],
      ANALYSIS_SCHEMA,
    );
    return json(analysis);
  } catch (err) {
    const [status, error] = aiError(err);
    return json({ error }, status);
  }
};
