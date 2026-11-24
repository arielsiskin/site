import type { ReactNode } from "react";
import { FLOWS } from "@/lib/flows";
import type { ScenarioId } from "@/lib/voicebot";

// The scenario's agent workflow, drawn like the Arquitecto of Mayday's Agentic Bot (dot grid, entry pill, agent nodes,
// dashed edges where the AI decides and solid ones where a condition does), lit up as the conversation moves.

type Status = "idle" | "running" | "ok";

const ICON = {
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z",
  chat: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z",
  agent: "M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3ZM21 16v2a4 4 0 0 1-4 4h-5",
  team: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8m13 10v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  tool: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9l-3.8 3.8z",
};
const Svg = ({ d, className = "h-3.5 w-3.5" }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

const KIND = {
  entry: { label: "Entrada", color: "#16A34A" },
  agent: { label: "Agente", color: "#2E4BB0" },
  team: { label: "Equipo", color: "#7C3AED" },
};

function Badge({ status }: { status: Status }) {
  if (status === "running") return <span className="size-3 shrink-0 animate-spin rounded-full border-2 border-[#F59E0B] border-t-transparent motion-reduce:animate-none" aria-label="En curso" />;
  if (status === "ok")
    return (
      <span className="grid size-4 shrink-0 place-items-center rounded-full bg-[#16A34A] text-white" aria-label="Listo">
        <svg viewBox="0 0 24 24" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="4" aria-hidden><path d="m5 12 5 5L20 7" /></svg>
      </span>
    );
  return null;
}

/** An agent or team node: icon, kind, title, what it does and its tools. */
function Node({ kind, title, detail, tools, status, lit, children }: { kind: "agent" | "team"; title: string; detail: string; tools?: string[]; status: Status; lit?: boolean; children?: ReactNode }) {
  const k = KIND[kind];
  return (
    <div
      className="relative rounded-[10px] border bg-white p-2 text-left shadow-[0_1px_2px_rgba(1,1,54,0.06)] transition duration-300 md:p-2.5"
      style={{ borderColor: status === "idle" ? `${k.color}40` : k.color, boxShadow: status === "idle" ? undefined : `0 0 0 3px ${k.color}22, 0 8px 20px -8px ${k.color}66` }}
    >
      <div className="flex items-start gap-1.5">
        <span className="grid size-5 shrink-0 place-items-center rounded-[5px] text-white md:size-6" style={{ background: k.color }}>
          <Svg d={kind === "team" ? ICON.team : ICON.agent} className="size-3 md:size-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-bold uppercase tracking-[0.06em] md:text-[10px]" style={{ color: k.color }}>{k.label}</p>
          <p className="text-[11px] font-semibold leading-tight text-md-ink md:text-[13px]">{title}</p>
        </div>
        <Badge status={status} />
      </div>
      <p className="mt-1 hidden text-[11px] leading-snug text-md-muted sm:block">{detail}</p>
      {tools && (
        <ul className="mt-1.5 flex flex-wrap gap-1">
          {tools.map((t) => (
            <li
              key={t}
              className={`flex max-w-full items-center gap-1 break-words rounded-md px-1.5 py-0.5 font-data text-[9px] transition md:text-[10px] ${lit ? "bg-[#FEF3C7] text-[#92400E]" : "bg-md-chip text-md-muted"}`}
            >
              <Svg d={ICON.tool} className="hidden size-2.5 shrink-0 sm:block" />
              {/* wrap after "_" (validar_ / identidad), never mid-word */}
              <span className="min-w-0">{t.replaceAll("_", "_​")}</span>
            </li>
          ))}
        </ul>
      )}
      {children}
    </div>
  );
}

/** A vertical edge between two rows: dashed while idle, a moving dash once the conversation has passed. */
function Edge({ on, dashed, color }: { on: boolean; dashed?: boolean; color: string }) {
  return (
    <svg viewBox="0 0 2 28" className="mx-auto h-7 w-0.5 overflow-visible" aria-hidden>
      <line x1="1" y1="0" x2="1" y2="28" stroke={on ? color : "#C9CEE6"} strokeWidth="2" strokeDasharray={dashed ? "4 4" : undefined} className={on ? "flow-dash" : undefined} />
    </svg>
  );
}

export function AgentFlow({ channel, scenario, started, active, busy, footer }: { channel: "voice" | "whatsapp"; scenario: ScenarioId; started: boolean; active: string | null; busy: boolean; footer?: ReactNode }) {
  const flow = FLOWS[scenario];
  const reception: Status = !started ? "idle" : active ? "ok" : busy ? "running" : "ok";
  return (
    <div className="overflow-hidden rounded-[24px] border border-md-line bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-md-line px-4 py-2.5">
        <p className="truncate text-sm font-bold text-md-ink">
          Arquitecto <span className="font-normal text-md-muted">· {flow.name}</span>
        </p>
        <span className="shrink-0 rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[11px] font-semibold text-[#166534]">Publicado</span>
      </div>

      <div className="bg-md-bg bg-[radial-gradient(#C9CEE6_1px,transparent_1px)] px-2 py-5 [background-size:16px_16px] md:px-5 md:py-6">
        {/* entry */}
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border bg-white py-1 pl-1 pr-3" style={{ borderColor: started ? KIND.entry.color : `${KIND.entry.color}55` }}>
          <span className="grid size-7 place-items-center rounded-full text-white" style={{ background: KIND.entry.color }}>
            <Svg d={channel === "voice" ? ICON.phone : ICON.chat} />
          </span>
          <span className="text-left">
            <span className="block text-[9px] font-bold uppercase tracking-[0.06em]" style={{ color: KIND.entry.color }}>Entrada</span>
            <span className="block text-xs font-semibold text-md-ink">{channel === "voice" ? "Llamada entrante" : "WhatsApp entrante"}</span>
          </span>
          <Badge status={started ? "ok" : "idle"} />
        </div>
        <Edge on={started} color={KIND.entry.color} />

        {/* reception */}
        <div className="mx-auto max-w-[260px]">
          <Node kind="agent" title="Maya · Recepción" detail="Saluda, entiende el motivo y deriva al especialista" status={reception} />
        </div>

        {/* fan-out to the specialists */}
        <svg viewBox="0 0 300 36" preserveAspectRatio="none" className="h-9 w-full" aria-hidden>
          {flow.branches.map((b, i) => {
            const x = 50 + i * 100;
            const on = active === b.id;
            return (
              <path
                key={b.id}
                d={`M150 0 C150 22 ${x} 14 ${x} 36`}
                fill="none"
                vectorEffect="non-scaling-stroke"
                stroke={on ? (b.edge === "ai" ? "#0891B2" : "#4338CA") : "#C9CEE6"}
                strokeWidth={on ? 2.5 : 1.5}
                strokeDasharray={b.edge === "ai" ? "5 4" : undefined}
                className={on ? "flow-dash" : undefined}
              />
            );
          })}
        </svg>
        <div className="grid grid-cols-3 gap-1.5 md:gap-3">
          {flow.branches.map((b) => {
            const on = active === b.id;
            return (
              <div key={b.id}>
                <p className={`mx-auto mb-1.5 w-fit rounded-full px-1.5 py-0.5 text-center text-[9px] font-medium md:text-[10px] ${on ? "bg-white text-md-ink shadow-sm" : "text-md-muted"}`}>{b.when}</p>
                <Node kind={b.kind} title={b.title} detail={b.detail} tools={b.tools} status={on ? (busy ? "running" : "ok") : "idle"} lit={on && !busy} />
              </div>
            );
          })}
        </div>

        {/* legend, as on the real canvas */}
        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-md-muted">
          <span className="flex items-center gap-1.5"><svg width="18" height="2" aria-hidden><line x1="0" y1="1" x2="18" y2="1" stroke="#0891B2" strokeWidth="2" strokeDasharray="4 3" /></svg>La IA decide</span>
          <span className="flex items-center gap-1.5"><svg width="18" height="2" aria-hidden><line x1="0" y1="1" x2="18" y2="1" stroke="#4338CA" strokeWidth="2" /></svg>Por condición</span>
          <span className="flex items-center gap-1.5"><Svg d={ICON.tool} className="size-3" />Herramienta de tu sistema</span>
        </div>
      </div>
      {footer && <div className="border-t border-md-line px-4 py-3">{footer}</div>}
    </div>
  );
}
