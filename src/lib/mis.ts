// MIS demo (the Billing portal, portal-billing-app): a PowerBI-like board that joins every platform's data.
// All numbers are fictitious; the board recomputes with whatever sources the visitor connects, and SAM's answers
// read those same numbers so they always match what is on screen.

export const SOURCES = {
  botmaker: { label: "Botmaker · WhatsApp", conv: [820, 790, 860, 910, 1180, 640, 510, 880, 905, 940, 1010, 1420, 720, 560], costPerConv: 0.031 },
  telefonia: { label: "Telefonía", conv: [410, 395, 430, 440, 520, 210, 150, 425, 430, 450, 470, 560, 230, 160], costPerConv: 0.12 },
  voicebot: { label: "Voicebot", conv: [260, 250, 270, 290, 360, 180, 140, 300, 310, 330, 350, 470, 220, 170], costPerConv: 0.05 },
  qualityiq: { label: "QualityIQ", conv: null, costPerConv: 0 },
  crm: { label: "CRM · ventas", conv: null, costPerConv: 0 },
} as const;
export type SourceId = keyof typeof SOURCES;

export const DAYS = ["L 3", "M 4", "X 5", "J 6", "V 7", "S 8", "D 9", "L 10", "M 11", "X 12", "J 13", "V 14", "S 15", "D 16"];
const SALES_RATE = 0.042; // ventas cerradas por conversación (CRM)
const TICKET = 38; // USD por venta
const QUALITY = 84; // nota promedio QualityIQ

export interface Board {
  perDay: number[];
  conversations: number;
  cost: number;
  costPerConv: number | null;
  sales: number | null;
  revenue: number | null;
  quality: number | null;
  weekChange: number | null; // second week vs first, %
  peak: { day: string; value: number } | null;
}

/** The board for a set of connected sources. Conversations come from the channels; QualityIQ and CRM add their KPI. */
export function board(on: SourceId[]): Board {
  const channels = on.filter((s) => SOURCES[s].conv);
  const perDay = DAYS.map((_, d) => channels.reduce((sum, s) => sum + (SOURCES[s].conv as readonly number[])[d], 0));
  const conversations = perDay.reduce((a, b) => a + b, 0);
  const cost = channels.reduce((sum, s) => sum + (SOURCES[s].conv as readonly number[]).reduce((a, b) => a + b, 0) * SOURCES[s].costPerConv, 0);
  const first = perDay.slice(0, 7).reduce((a, b) => a + b, 0);
  const second = perDay.slice(7).reduce((a, b) => a + b, 0);
  const peakIdx = conversations ? perDay.indexOf(Math.max(...perDay)) : -1;
  const sales = on.includes("crm") && conversations ? Math.round(conversations * SALES_RATE) : null;
  return {
    perDay,
    conversations,
    cost: Math.round(cost),
    costPerConv: conversations ? cost / conversations : null,
    sales,
    revenue: sales === null ? null : sales * TICKET,
    quality: on.includes("qualityiq") && conversations ? QUALITY : null,
    weekChange: first ? Math.round(((second - first) / first) * 100) : null,
    peak: peakIdx >= 0 ? { day: DAYS[peakIdx], value: perDay[peakIdx] } : null,
  };
}

const n = (x: number) => x.toLocaleString("es-AR");
/** Cost per conversation with a Spanish decimal comma: 0,057. */
export const perConv = (x: number) => x.toLocaleString("es-AR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const usd = (x: number) => `USD ${x.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

export const QUESTIONS = ["¿Qué pasó estas dos semanas?", "¿Por qué hubo un pico el viernes 14?", "Armame el resumen para el directorio"] as const;

/** SAM's answer to a suggested question, written from the numbers on the board. */
export function samAnswer(q: (typeof QUESTIONS)[number], b: Board, on: SourceId[]): string {
  if (!b.conversations) return "No tengo datos para analizar: conectá al menos un canal (Botmaker, Telefonía o Voicebot) y te cuento qué pasó.";
  const names = on.filter((s) => SOURCES[s].conv).map((s) => SOURCES[s].label).join(", ");
  if (q === QUESTIONS[0]) {
    const trend = b.weekChange! >= 0 ? `subieron un ${b.weekChange}%` : `bajaron un ${-b.weekChange!}%`;
    return `Entre ${names} atendiste ${n(b.conversations)} conversaciones. La segunda semana ${trend} contra la primera, con el pico el ${b.peak!.day} (${n(b.peak!.value)}). El costo total fue ${usd(b.cost)}, ${perConv(b.costPerConv!)} USD por conversación.${b.sales !== null ? ` El CRM cerró ${n(b.sales)} ventas por ${usd(b.revenue!)}.` : " Si conectás el CRM te digo cuánto vendiste."}`;
  }
  if (q === QUESTIONS[1]) {
    return `El viernes 14 se juntaron dos cosas: el envío de la campaña "Fin de mes" por WhatsApp${on.includes("botmaker") ? "" : " (conectá Botmaker para verla)"} y el cierre de facturación, que siempre trae consultas de saldo. Fueron ${n(b.peak!.value)} conversaciones, un ${Math.round((b.peak!.value / (b.conversations / 14) - 1) * 100)}% arriba del promedio diario.${on.includes("voicebot") ? " El voicebot absorbió la mayor parte sin cola." : " Con el voicebot conectado te muestro cuánto absorbió sin cola."}`;
  }
  return [
    `Resumen · 3 al 16 de noviembre`,
    `• ${n(b.conversations)} conversaciones (${b.weekChange! >= 0 ? "+" : ""}${b.weekChange}% la segunda semana).`,
    `• Costo ${usd(b.cost)} · ${perConv(b.costPerConv!)} USD por conversación.`,
    b.sales !== null ? `• ${n(b.sales)} ventas · ${usd(b.revenue!)} de ingresos.` : `• Ventas: falta conectar el CRM.`,
    b.quality !== null ? `• Calidad ${b.quality}/100 según QualityIQ.` : `• Calidad: falta conectar QualityIQ.`,
    `Lo dejé programado para que llegue todos los lunes a las 9 por mail.`,
  ].join("\n");
}
