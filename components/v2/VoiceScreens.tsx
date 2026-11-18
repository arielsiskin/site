import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { SectionTitle, Wave } from "./ui";

// Product screens of the voicebot console, drawn in HTML with the app's dark tokens (composer surfaces).
const TABS = [
  { id: "flow", label: "Diseño del agente", note: "Armá el flujo con nodos: intención, herramientas, derivación." },
  { id: "live", label: "Consola en vivo", note: "Escuchá cada llamada en curso con transcripción y latencia." },
  { id: "metrics", label: "Métricas", note: "Contención, tiempo medio y satisfacción, por día y por intención." },
] as const;
type Tab = (typeof TABS)[number]["id"];

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-md-dark-line bg-md-dark-card p-4 ${className}`}>{children}</div>
);

function Flow() {
  const nodes = [
    { x: 6, y: 42, label: "Entrada", sub: "Llamada entrante", c: "#64748B" },
    { x: 30, y: 42, label: "Maya", sub: "Agente IA", c: "#2A449E" },
    { x: 56, y: 16, label: "Bloquear tarjeta", sub: "API core bancario", c: "#C4731C" },
    { x: 56, y: 42, label: "Consultar saldo", sub: "API cuentas", c: "#C4731C" },
    { x: 56, y: 68, label: "Derivar", sub: "Cola humana", c: "#A966C4" },
    { x: 82, y: 42, label: "Fin + QualityIQ", sub: "Auditoría automática", c: "#0896A4" },
  ];
  const edges = [[0, 1], [1, 2], [1, 3], [1, 4], [2, 5], [3, 5], [4, 5]];
  return (
    <Card className="relative h-[360px] overflow-hidden bg-[radial-gradient(#22246A_1px,transparent_1px)] [background-size:18px_18px]">
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
        {edges.map(([a, b], i) => (
          <motion.path
            key={i}
            d={`M${nodes[a].x + 12} ${nodes[a].y + 6} C ${(nodes[a].x + nodes[b].x) / 2 + 6} ${nodes[a].y + 6}, ${(nodes[a].x + nodes[b].x) / 2 + 6} ${nodes[b].y + 6}, ${nodes[b].x} ${nodes[b].y + 6}`}
            fill="none"
            stroke="#7A8BCB"
            strokeWidth="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.1 * i, duration: 0.6 }}
          />
        ))}
      </svg>
      {nodes.map((n, i) => (
        <motion.div
          key={n.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 * i }}
          className="absolute w-[13%] min-w-[96px] rounded-xl border border-md-dark-line bg-[#13163F] p-2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <span className="mb-1 block h-1 w-6 rounded-full" style={{ background: n.c }} />
          <p className="text-[11px] font-semibold text-md-dark-text">{n.label}</p>
          <p className="text-[10px] text-md-dark-muted">{n.sub}</p>
        </motion.div>
      ))}
    </Card>
  );
}

function Live() {
  const calls = [
    { id: "C-20931", who: "+54 11 •••• 4471", intent: "Bloqueo de tarjeta", t: "01:42", mood: "😐", lat: 820 },
    { id: "C-20932", who: "+52 55 •••• 1180", intent: "Estado de pedido", t: "00:37", mood: "🙂", lat: 640 },
    { id: "C-20933", who: "+56 9 •••• 3302", intent: "Derivada a humano", t: "03:10", mood: "😠", lat: 910 },
  ];
  return (
    <div className="grid gap-3 md:h-[360px] md:grid-cols-[1fr_1.3fr]">
      <Card className="space-y-2 overflow-hidden">
        <p className="text-xs font-semibold uppercase tracking-wider text-md-dark-muted">En curso · 3</p>
        {calls.map((c, i) => (
          <div key={c.id} className={`rounded-xl p-3 ${i === 0 ? "bg-[#1E2170]" : "bg-[#13163F]"}`}>
            <div className="flex justify-between font-data text-[11px] text-md-dark-muted">
              <span>{c.id}</span>
              <span>{c.t}</span>
            </div>
            <p className="mt-1 text-sm text-md-dark-text">{c.intent}</p>
            <p className="font-data text-[11px] text-md-dark-muted">
              {c.who} · {c.lat} ms · {c.mood}
            </p>
          </div>
        ))}
      </Card>
      <Card className="flex flex-col">
        <div className="flex items-center justify-between">
          <p className="font-data text-xs text-md-dark-muted">C-20931 · Banco Austral</p>
          <Wave active bars={14} className="h-5 text-md-cyan" />
        </div>
        <div className="mt-3 flex-1 space-y-2 overflow-hidden text-[13px]">
          {[
            ["cliente", "Perdí la tarjeta en el subte, ¿la pueden bloquear?"],
            ["maya", "Claro. ¿Me confirmás los últimos 4 dígitos de tu DNI?"],
            ["cliente", "4471"],
            ["maya", "Listo, tu tarjeta terminada en 0932 quedó bloqueada. ¿Querés pedir una nueva?"],
          ].map(([w, t], i) => (
            <p key={i} className={w === "maya" ? "text-md-dark-text" : "text-md-cyan"}>
              <span className="mr-2 font-data text-[10px] uppercase text-md-dark-muted">{w}</span>
              {t}
            </p>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 font-data text-[11px]">
          {[["STT", "210 ms"], ["LLM", "430 ms"], ["TTS", "180 ms"]].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-[#13163F] px-2 py-1.5 text-md-dark-muted">
              {k} <span className="text-md-dark-text">{v}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Metrics() {
  const days = [62, 66, 64, 70, 71, 69, 74, 76, 73, 78, 80, 79, 82, 84];
  return (
    <div className="grid gap-3 md:h-[360px] md:grid-cols-3">
      {[
        ["Contención", "78%", "+6 pts vs. mes anterior"],
        ["Tiempo medio", "1:54", "-38 s"],
        ["CSAT", "4,6", "sobre 5 · 2.140 encuestas"],
      ].map(([k, v, s]) => (
        <Card key={k}>
          <p className="text-xs text-md-dark-muted">{k}</p>
          <p className="mt-1 font-display text-3xl font-extrabold text-white">{v}</p>
          <p className="mt-1 text-xs text-md-cyan">{s}</p>
        </Card>
      ))}
      <Card className="md:col-span-3">
        <p className="text-xs text-md-dark-muted">Contención diaria · últimos 14 días</p>
        <div className="mt-4 flex h-32 items-end gap-2">
          {days.map((d, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-md bg-gradient-to-t from-md-blue to-md-cyan"
              initial={{ height: 0 }}
              animate={{ height: `${d}%` }}
              transition={{ delay: i * 0.03, duration: 0.5 }}
              title={`${d}%`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

export function VoiceScreens() {
  const [tab, setTab] = useState<Tab>("flow");
  return (
    <section className="relative overflow-hidden bg-md-navy py-24 text-white md:py-32">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-md-blue/40 blur-[120px]" />
      <div className="relative mx-auto max-w-6xl px-4">
        <SectionTitle
          dark
          center
          eyebrow="La consola del voicebot"
          title="Diseñás, escuchás y medís. En un solo lugar."
          body="La misma consola que usa tu equipo de operaciones: sin código para el flujo, con cada llamada visible en tiempo real."
        />
        <div className="mx-auto mt-10 flex w-fit flex-wrap justify-center gap-1 rounded-full bg-white/5 p-1" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${tab === t.id ? "bg-white text-md-navy" : "text-md-dark-muted hover:text-white"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-md-dark-muted">{TABS.find((t) => t.id === tab)!.note}</p>
        <div className="mx-auto mt-8 max-w-5xl rounded-[28px] border border-white/10 bg-white/[0.03] p-3 shadow-[0_0_60px_rgba(4,204,219,0.15)] md:p-5">
          <div className="mb-3 flex gap-1.5 px-1" aria-hidden>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              {tab === "flow" ? <Flow /> : tab === "live" ? <Live /> : <Metrics />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
