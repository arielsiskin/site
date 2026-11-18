import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { board, DAYS, perConv, QUESTIONS, samAnswer, SOURCES, type SourceId } from "@/lib/mis";
import { SectionTitle } from "./ui";

// MIS (the Billing portal): a PowerBI-like board that joins every platform, with SAM as the analyst. The visitor
// connects or disconnects sources and the board and SAM's answers recompute (src/lib/mis.ts, fictitious data).
const ALL = Object.keys(SOURCES) as SourceId[];
const fmt = (x: number) => x.toLocaleString("es-AR");

function Kpi({ label, value, hint }: { label: string; value: string | null; hint: string }) {
  return (
    <div className="rounded-2xl border border-md-line bg-white p-4">
      <p className="text-xs text-md-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold tabular-nums text-md-ink">{value ?? "—"}</p>
      <p className="mt-0.5 text-[11px] text-md-muted">{value === null ? hint : " "}</p>
    </div>
  );
}

/** Conversations per day: one series, one axis, value on hover (dataviz rules). */
function Bars({ values }: { values: number[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...values, 1);
  const top = Math.ceil(max / 1000) * 1000 || 1000;
  const shown = hover ?? values.indexOf(max);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold text-md-ink">Conversaciones por día</p>
        <p className="font-data text-xs tabular-nums text-md-muted" aria-live="polite">
          {values[shown] ? `${DAYS[shown]} · ${fmt(values[shown])}` : "sin datos"}
        </p>
      </div>
      <div className="relative mt-3 h-44" role="img" aria-label="Gráfico de conversaciones por día; los valores están en la tabla">
        {[1, 0.5, 0].map((f) => (
          <div key={f} className="absolute inset-x-0 border-t border-md-line" style={{ bottom: `${f * 100}%` }}>
            <span className="absolute -top-2 left-0 bg-white pr-1 font-data text-[10px] text-md-muted">{fmt(top * f)}</span>
          </div>
        ))}
        <div className="absolute inset-0 left-9 flex items-end gap-[2px]">
          {values.map((v, i) => (
            <div key={i} className="flex h-full flex-1 items-end" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <motion.div
                className={`w-full rounded-t-[4px] ${i === shown ? "bg-md-blue" : "bg-md-blue/55"}`}
                initial={false}
                animate={{ height: `${(v / top) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="ml-9 mt-1 flex gap-[2px]">
        {DAYS.map((d, i) => (
          <span key={d} className={`flex-1 text-center font-data text-[9px] ${i % 2 ? "text-transparent sm:text-md-muted" : "text-md-muted"}`}>{d.split(" ")[1]}</span>
        ))}
      </div>
      <table className="sr-only">
        <caption>Conversaciones por día</caption>
        <tbody>{values.map((v, i) => <tr key={i}><th>{DAYS[i]}</th><td>{v}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

export function MisDemo() {
  const [on, setOn] = useState<SourceId[]>(ALL);
  const [question, setQuestion] = useState<(typeof QUESTIONS)[number] | null>(null);
  const [typed, setTyped] = useState("");
  const b = useMemo(() => board(on), [on]);
  const answer = question ? samAnswer(question, b, on) : "";

  // SAM "writes" the answer; with reduced motion it appears at once.
  useEffect(() => {
    if (!answer) return setTyped("");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setTyped(answer);
    setTyped("");
    let i = 0;
    const t = setInterval(() => {
      i += 3;
      setTyped(answer.slice(0, i));
      if (i >= answer.length) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [answer]);

  const toggle = (s: SourceId) => setOn((o) => (o.includes(s) ? o.filter((x) => x !== s) : [...o, s]));

  return (
    <section id="mis" className="relative bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle
          eyebrow="MIS · inteligencia de negocio"
          title={<>Todos tus datos. Un solo tablero.</>}
          body="Como un Power BI para tu contact center: MIS integra conversaciones, costos, ventas y calidad de todas tus plataformas en tableros listos y reportes que llegan solos por mail. Y SAM, nuestro analista con IA, lee cada reporte y te explica qué pasó. Conectá y desconectá fuentes para ver cómo cambia."
        />

        <div className="mt-10 overflow-hidden rounded-[28px] border border-md-line bg-md-bg shadow-[0_24px_60px_rgba(1,1,54,0.08)]">
          {/* app bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-md-line bg-white px-5 py-3">
            <p className="font-display text-sm font-bold text-md-ink">MIS <span className="font-body font-normal text-md-muted">· Tablero general</span></p>
            <p className="font-data text-xs text-md-muted">3 al 16 de noviembre · {on.length} de {ALL.length} fuentes</p>
          </div>

          <div className="grid gap-5 p-5 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-5">
              {/* sources */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[1.4px] text-md-muted">Fuentes de datos</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ALL.map((s) => {
                    const active = on.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => toggle(s)}
                        aria-pressed={active}
                        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${active ? "border-md-blue bg-white text-md-ink" : "border-dashed border-md-line bg-transparent text-md-muted"}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${active ? "bg-[#16a34a]" : "bg-md-line"}`} />
                        {SOURCES[s].label}
                        <span className="text-[10px] text-md-muted">{active ? "conectado" : "conectar"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Kpi label="Conversaciones" value={b.conversations ? fmt(b.conversations) : null} hint="Conectá un canal" />
                <Kpi label="Costo por conversación" value={b.costPerConv === null ? null : `USD ${perConv(b.costPerConv)}`} hint="Conectá un canal" />
                <Kpi label="Ventas" value={b.sales === null ? null : fmt(b.sales)} hint="Conectá el CRM" />
                <Kpi label="Calidad QualityIQ" value={b.quality === null ? null : `${b.quality}/100`} hint="Conectá QualityIQ" />
              </div>

              <div className="rounded-2xl border border-md-line bg-white p-4">
                <Bars values={b.perDay} />
              </div>
            </div>

            {/* SAM */}
            <div className="flex flex-col rounded-2xl bg-md-navy p-4 text-md-dark-text">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-md-cyan to-md-blue font-display text-sm font-extrabold text-white">SAM</span>
                <div>
                  <p className="text-sm font-semibold">SAM</p>
                  <p className="text-[11px] text-md-dark-muted">Analista con IA · lee este tablero</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuestion(q)}
                    className={`rounded-full border px-3 py-1.5 text-left text-xs transition ${question === q ? "border-md-cyan bg-md-cyan text-md-navy" : "border-md-dark-line text-md-dark-text hover:bg-[#13163F]"}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="mt-4 min-h-[220px] flex-1 rounded-xl bg-[#0A0D3F] p-3" aria-live="polite">
                <AnimatePresence mode="wait">
                  {question ? (
                    <motion.p key={question} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-pre-line text-[13px] leading-relaxed">
                      {typed}
                      {typed.length < answer.length && <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-md-cyan align-middle" />}
                    </motion.p>
                  ) : (
                    <p className="grid h-full place-items-center text-center text-sm text-md-dark-muted">Elegí una pregunta y SAM la responde con los datos del tablero.</p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
