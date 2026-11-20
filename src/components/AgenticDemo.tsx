import { useState } from "react";
import { SCENARIOS, type ScenarioId } from "@/lib/voicebot";
import { ChatAgent } from "./BotDemo";
import { CallAgent } from "./VoiceDemo";
import { SectionTitle } from "./ui";

// Agentic IA: one team of agents, tried by WhatsApp or by phone. Switching channel unmounts the other panel
// (which hangs up a call in progress).
const CHANNELS = { voice: "Llamada", whatsapp: "WhatsApp" } as const;
type Channel = keyof typeof CHANNELS;

const chip = (on: boolean) =>
  `rounded-full border px-4 py-2 text-sm font-medium transition ${on ? "border-md-navy bg-md-navy text-white" : "border-md-line bg-white text-md-ink hover:bg-md-surface2"}`;

export function AgenticDemo() {
  const [scenario, setScenario] = useState<ScenarioId>("banco");
  const [channel, setChannel] = useState<Channel>("voice");
  return (
    <section id="agentic" className="relative overflow-hidden bg-md-bg py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-end gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <SectionTitle
            eyebrow="Agentic IA · Mayday Global"
            title="Un equipo de agentes de IA, por teléfono y por WhatsApp."
            body="No es un menú ni un bot de respuestas: Maya atiende, entiende qué necesita el cliente y lo pasa al agente especialista, que usa las herramientas de tu sistema o deriva a una persona con todo el contexto. El mismo equipo, en cada canal. Probá la herramienta en vivo: elegí el canal y el escenario de la demo."
          />
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-md-muted">Canal</p>
              <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Canal">
                {(Object.keys(CHANNELS) as Channel[]).map((id) => (
                  <button key={id} role="radio" aria-checked={channel === id} onClick={() => setChannel(id)} className={chip(channel === id)}>
                    {CHANNELS[id]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-md-muted">Escenario</p>
              <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Escenario">
                {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
                  <button key={id} role="radio" aria-checked={scenario === id} onClick={() => setScenario(id)} className={chip(scenario === id)}>
                    {SCENARIOS[id].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10">{channel === "whatsapp" ? <ChatAgent scenario={scenario} /> : <CallAgent scenario={scenario} />}</div>
      </div>
    </section>
  );
}
