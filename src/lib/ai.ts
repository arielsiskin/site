// Server-only: Gemini over plain fetch (no SDK needed for one call). The key comes from .env.local or Secret Manager.
const GEMINI = "https://generativelanguage.googleapis.com/v1beta/models";

export class AiNotConfigured extends Error {}

type Part = { text: string } | { inlineData: { mimeType: string; data: string } };
export type Content = { role: "user" | "model"; parts: Part[] };

export async function gemini<T>(model: string, contents: Content[], schema: object, system?: string): Promise<T> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new AiNotConfigured("Esta demo todavía no está configurada.");
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

/** The status and message an API route answers with when an AI call fails. */
export function aiError(err: unknown): [number, string] {
  if (err instanceof AiNotConfigured) return [503, err.message];
  // The provider's message stays in the server log: it can name the account, quota or model, never for visitors.
  console.error("[ai]", err);
  return [502, "La IA no respondió. Probá de nuevo en un momento."];
}
