// Server-only: Gemini and ElevenLabs over plain fetch (no SDK needed for two calls). Keys come from .env.local.
const GEMINI = "https://generativelanguage.googleapis.com/v1beta/models";

export class AiNotConfigured extends Error {}

type Part = { text: string } | { inlineData: { mimeType: string; data: string } };
export type Content = { role: "user" | "model"; parts: Part[] };

export async function gemini<T>(model: string, contents: Content[], schema: object, system?: string): Promise<T> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new AiNotConfigured("Esta demo todavía no está configurada (falta GEMINI_API_KEY).");
  const res = await fetch(`${GEMINI}/${model}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      contents,
      ...(system && { systemInstruction: { parts: [{ text: system }] } }),
      generationConfig: { responseMimeType: "application/json", responseJsonSchema: schema },
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${json?.error?.message ?? "error"}`);
  const text: string | undefined = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini no devolvió respuesta");
  return JSON.parse(text) as T;
}

/** Text to speech with the account's Spanish voice: base64 mp3. */
export async function tts(text: string): Promise<string> {
  const key = process.env.ELEVEN_API_KEY;
  if (!key) throw new AiNotConfigured("La voz de esta demo todavía no está configurada (falta ELEVEN_API_KEY).");
  const voice = process.env.ELEVEN_VOICE_ID || "EXAVITQu4vr4xnSDxMaL";
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_64`, {
    method: "POST",
    headers: { "content-type": "application/json", "xi-api-key": key },
    body: JSON.stringify({ text, model_id: "eleven_flash_v2_5", language_code: "es" }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 160)}`);
  return Buffer.from(await res.arrayBuffer()).toString("base64");
}

/** The status and message an API route answers with when an AI call fails. */
export function aiError(err: unknown): [number, string] {
  if (err instanceof AiNotConfigured) return [503, err.message];
  return [502, (err as Error).message ?? "Error del proveedor de IA"];
}
