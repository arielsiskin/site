// The agent workflow each demo scenario runs, drawn like the Arquitecto of the Agentic Bot: Maya (reception) takes the
// conversation and hands it to a specialist agent with its tools, or to the human team. The page only draws it;
// `route` guesses from the customer's words which branch is working.
// shortcut: routing by keywords on the client, not by the agent's real handoff; upgrade when the worker and /api/voice
// report the active agent.
import type { ScenarioId } from "./voicebot";

export type Branch = { id: string; kind: "agent" | "team"; title: string; detail: string; tools: string[]; words: RegExp; edge: "ai" | "code"; when: string };
export type Flow = { name: string; branches: Branch[] };

const human = (when: string): Branch => ({
  id: "humano",
  kind: "team",
  title: "Equipo humano",
  detail: "Recibe la conversación con todo el contexto",
  tools: ["transferir"],
  words: /persona|humano|asesor|operador|hablar con alguien|ejecutiv/i,
  edge: "code",
  when,
});

export const FLOWS: Record<ScenarioId, Flow> = {
  banco: {
    name: "Atención Banco Austral",
    branches: [
      { id: "tarjetas", kind: "agent", title: "Tarjetas", detail: "Bloqueo y reposición", tools: ["validar_identidad", "bloquear_tarjeta"], words: /tarjeta|perd|rob|bloque|extravi/i, edge: "ai", when: "La IA decide" },
      { id: "cuentas", kind: "agent", title: "Saldos y pagos", detail: "Consultas de cuenta", tools: ["consultar_saldo", "plan_de_pagos"], words: /saldo|pag|deud|cuota|resumen|plata|cuenta/i, edge: "ai", when: "La IA decide" },
      human("Si pide una persona"),
    ],
  },
  mayday: {
    name: "Ventas Mayday",
    branches: [
      { id: "productos", kind: "agent", title: "Productos", detail: "Responde con la base de conocimiento", tools: ["buscar_info_mayday"], words: /voicebot|quality|qu[eé] hace|producto|whatsapp|bot|omnicanal|mis\b|tablero/i, edge: "ai", when: "La IA decide" },
      { id: "ventas", kind: "agent", title: "Demo y precios", detail: "Califica y agenda", tools: ["cotizar", "agendar_demo"], words: /demo|precio|cost|cotiz|reuni|cu[aá]nto sale/i, edge: "ai", when: "La IA decide" },
      human("Si pide una persona"),
    ],
  },
  delivery: {
    name: "Pedidos RapiEnvío",
    branches: [
      { id: "pedidos", kind: "agent", title: "Estado del pedido", detail: "Seguimiento y demoras", tools: ["rastrear_pedido", "dar_cupon"], words: /pedido|lleg|demor|tard|\d{4,}/i, edge: "ai", when: "La IA decide" },
      { id: "cambios", kind: "agent", title: "Cambios", detail: "Dirección y reclamos", tools: ["cambiar_direccion", "abrir_reclamo"], words: /direcci|cambi|reclam|devol/i, edge: "ai", when: "La IA decide" },
      human("Si es un problema de pago"),
    ],
  },
};

/** The branch the customer's message goes to, or null if reception keeps it. A request for a person wins. */
export function route(scenario: ScenarioId, text: string): string | null {
  const bs = FLOWS[scenario].branches;
  const hit = bs.find((b) => b.kind === "team" && b.words.test(text)) ?? bs.find((b) => b.words.test(text));
  return hit?.id ?? null;
}
