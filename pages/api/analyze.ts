import type { NextApiRequest, NextApiResponse } from "next";
import { aiError, gemini } from "@/lib/ai";
import { ANALYSIS_PROMPT, ANALYSIS_SCHEMA, type Analysis } from "@/lib/qiq";

// shortcut: audio goes inline as base64 (max ~8 MB). Netlify functions cap bodies at 6 MB; for longer calls upload
// to a bucket and pass Gemini a file URI, like QualityIQ does.
export const config = { api: { bodyParser: { sizeLimit: "12mb" } } };

const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash"; // pinned, same as QualityIQ
const MAX_AUDIO_B64 = 11_000_000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { audio, mime } = req.body ?? {};
  if (typeof audio !== "string" || !audio) return res.status(400).json({ error: "Falta el audio" });
  if (audio.length > MAX_AUDIO_B64) return res.status(413).json({ error: "El audio supera 8 MB: probá con una llamada más corta." });
  if (typeof mime !== "string" || !mime.startsWith("audio/")) return res.status(400).json({ error: "El archivo no es un audio" });
  try {
    const analysis = await gemini<Analysis>(
      MODEL,
      [{ role: "user", parts: [{ inlineData: { mimeType: mime, data: audio } }, { text: ANALYSIS_PROMPT }] }],
      ANALYSIS_SCHEMA,
    );
    res.json(analysis);
  } catch (err) {
    const [status, error] = aiError(err);
    res.status(status).json({ error });
  }
}
