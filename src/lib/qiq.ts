// QualityIQ demo: a fixed protocol, the analysis shape (a trimmed copy of quality-iq's ANALYSIS_SCHEMA in
// apps/api/src/services/gemini.ts) and a sample result so the dashboard works without uploading anything.

export const PROTOCOL = [
  { id: "saludo", name: "Saludo e identificación", description: "Saluda, dice su nombre y el de la empresa." },
  { id: "validacion", name: "Validación del cliente", description: "Valida la identidad antes de dar o cambiar datos." },
  { id: "indagacion", name: "Indagación", description: "Hace preguntas para entender el motivo real del contacto." },
  { id: "empatia", name: "Empatía", description: "Reconoce la situación del cliente con frases empáticas." },
  { id: "solucion", name: "Solución correcta", description: "Da una solución correcta y completa, sin promesas indebidas." },
  { id: "confirmacion", name: "Confirmación", description: "Confirma que el cliente entendió y está conforme." },
  { id: "cierre", name: "Cierre", description: "Ofrece ayuda adicional y se despide con cortesía." },
] as const;

export type ItemStatus = "met" | "partial" | "not_met" | "na";
export type Emotion = "alegria" | "tristeza" | "ira" | "miedo" | "sorpresa" | "desprecio";
export interface Analysis {
  evaluable: boolean;
  notEvaluableReason: string | null;
  summary: string;
  contactReason: string;
  resolution: "resuelto" | "no_resuelto" | "sin_dato";
  transcript: { t: string; speaker: "agente" | "cliente"; text: string }[];
  items: { id: string; status: ItemStatus; evidence: string; timestamp: string | null; better: string | null }[];
  sentiment: {
    agent: { score: number; label: string };
    client: { score: number; label: string; emotions: Record<Emotion, number> };
  };
  alerts: { type: string; severity: "alta" | "media"; timestamp: string | null; quote: string }[];
}

/** QualityIQ's score: met counts 1, partial half, n/a is left out. 0-100, or null when nothing applies. */
export function score(items: Analysis["items"]): number | null {
  const counted = items.filter((i) => i.status !== "na");
  if (!counted.length) return null;
  const pts = counted.reduce((s, i) => s + (i.status === "met" ? 1 : i.status === "partial" ? 0.5 : 0), 0);
  return Math.round((pts / counted.length) * 100);
}

const str = { type: "string" };
const nullableStr = { type: ["string", "null"] };
const sc = { type: "number", minimum: -1, maximum: 1 };
const pct = { type: "integer", minimum: 0, maximum: 100 };
const obj = (properties: Record<string, unknown>) => ({
  type: "object",
  properties,
  required: Object.keys(properties),
  propertyOrdering: Object.keys(properties),
});
export const ANALYSIS_SCHEMA = obj({
  evaluable: { type: "boolean" },
  notEvaluableReason: nullableStr,
  summary: str,
  contactReason: str,
  resolution: { type: "string", enum: ["resuelto", "no_resuelto", "sin_dato"] },
  transcript: { type: "array", items: obj({ t: str, speaker: { type: "string", enum: ["agente", "cliente"] }, text: str }) },
  items: {
    type: "array",
    items: obj({
      id: { type: "string", enum: PROTOCOL.map((p) => p.id) },
      status: { type: "string", enum: ["met", "partial", "not_met", "na"] },
      evidence: str,
      timestamp: nullableStr,
      better: nullableStr,
    }),
  },
  sentiment: obj({
    agent: obj({ score: sc, label: str }),
    client: obj({
      score: sc,
      label: str,
      emotions: obj({ alegria: pct, tristeza: pct, ira: pct, miedo: pct, sorpresa: pct, desprecio: pct }),
    }),
  }),
  alerts: {
    type: "array",
    items: obj({
      type: { type: "string", enum: ["insulto_cliente", "insulto_agente", "maltrato", "amenaza_baja", "promesa_indebida", "dato_sensible", "escalamiento"] },
      severity: { type: "string", enum: ["alta", "media"] },
      timestamp: nullableStr,
      quote: str,
    }),
  },
});

export const ANALYSIS_PROMPT = `Sos auditor de calidad de un contact center. Escuchá la llamada y devolvé:
- transcript: la transcripción completa por turnos, con t en formato mm:ss y speaker agente o cliente.
- items: una entrada por cada ítem del protocolo (usá su id), con status met, partial, not_met o na, la cita textual como evidence, su timestamp mm:ss y, si no es met, en better qué debió decir el agente.
- summary (2 o 3 oraciones), contactReason (pocas palabras) y resolution.
- sentiment del agente y del cliente (-1 a 1, con una etiqueta corta) y las emociones del cliente en porcentaje.
- alerts sólo si hay insultos (insulto_cliente o insulto_agente según quién insulta, siempre severidad alta y con la cita textual; una alerta por cada insulto), maltrato, amenaza de baja, promesas indebidas, datos sensibles dichos en voz alta o pedido de escalamiento.
Si el audio no es una conversación de atención al cliente, evaluable=false y explicá por qué en notEvaluableReason.
Protocolo:
${PROTOCOL.map((p) => `- ${p.id}: ${p.name}. ${p.description}`).join("\n")}`;

export const SAMPLE: Analysis = {
  evaluable: true,
  notEvaluableReason: null,
  summary:
    "La clienta llama porque le debitaron dos veces la cuota del plan. El agente valida su identidad, confirma el doble débito y gestiona el reintegro en 72 horas. La clienta queda conforme aunque menciona que pensó en dar de baja el servicio.",
  contactReason: "Doble débito en la factura",
  resolution: "resuelto",
  transcript: [
    { t: "00:02", speaker: "agente", text: "Buenas tardes, gracias por comunicarte con Conecta, te habla Julián. ¿En qué te puedo ayudar?" },
    { t: "00:07", speaker: "cliente", text: "Hola, mirá, me cobraron dos veces la cuota de este mes y ya es la segunda vez que me pasa." },
    { t: "00:14", speaker: "agente", text: "Uh, entiendo lo molesto que es. ¿Me decís tu DNI así reviso la cuenta?" },
    { t: "00:19", speaker: "cliente", text: "Sí, 28.456.913." },
    { t: "00:26", speaker: "agente", text: "Gracias, Laura. Sí, veo dos débitos del día 5 por el mismo importe." },
    { t: "00:33", speaker: "cliente", text: "Bueno, la verdad si sigue pasando me voy a dar de baja." },
    { t: "00:38", speaker: "agente", text: "Te entiendo. Ya generé el reintegro del segundo débito, lo vas a ver en la cuenta en 72 horas hábiles." },
    { t: "00:47", speaker: "cliente", text: "¿Y me queda algún comprobante?" },
    { t: "00:50", speaker: "agente", text: "Sí, te llega por mail con el número de gestión 4471. ¿Te quedó claro cómo sigue?" },
    { t: "00:56", speaker: "cliente", text: "Sí, perfecto, gracias." },
    { t: "00:58", speaker: "agente", text: "De nada, que tengas buena tarde." },
  ],
  items: [
    { id: "saludo", status: "met", evidence: "Gracias por comunicarte con Conecta, te habla Julián.", timestamp: "00:02", better: null },
    { id: "validacion", status: "met", evidence: "¿Me decís tu DNI así reviso la cuenta?", timestamp: "00:14", better: null },
    { id: "indagacion", status: "partial", evidence: "Veo dos débitos del día 5 por el mismo importe.", timestamp: "00:26", better: "Preguntar por el débito anterior que la clienta mencionó: \"¿Me contás cuándo te pasó la otra vez?\"" },
    { id: "empatia", status: "met", evidence: "Uh, entiendo lo molesto que es.", timestamp: "00:14", better: null },
    { id: "solucion", status: "met", evidence: "Ya generé el reintegro del segundo débito.", timestamp: "00:38", better: null },
    { id: "confirmacion", status: "met", evidence: "¿Te quedó claro cómo sigue?", timestamp: "00:50", better: null },
    { id: "cierre", status: "partial", evidence: "De nada, que tengas buena tarde.", timestamp: "00:58", better: "Ofrecer ayuda adicional antes de despedirse: \"¿Hay algo más en lo que te pueda ayudar?\"" },
  ],
  sentiment: {
    agent: { score: 0.6, label: "Cordial y resolutivo" },
    client: {
      score: 0.1,
      label: "Molesta al inicio, conforme al final",
      emotions: { alegria: 22, tristeza: 8, ira: 41, miedo: 4, sorpresa: 12, desprecio: 13 },
    },
  },
  alerts: [{ type: "amenaza_baja", severity: "media", timestamp: "00:33", quote: "Si sigue pasando me voy a dar de baja." }],
};
