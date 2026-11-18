import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { agentsNeeded, HOURS, INTRADAY, serviceLevel } from "@/lib/erlang";
import { SectionTitle } from "./ui";

const GOALS = [
  { id: "80/20", goal: 0.8, sec: 20 },
  { id: "90/20", goal: 0.9, sec: 20 },
  { id: "80/30", goal: 0.8, sec: 30 },
] as const;
const fmt = (n: number) => Math.round(n).toLocaleString("es-AR");

function Slider({ label, value, min, max, step, onChange, show }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; show: string }) {
  return (
    <label className="block">
      <span className="flex justify-between text-sm">
        <span className="text-md-muted">{label}</span>
        <span className="font-data font-semibold text-md-ink">{show}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-[#2A449E]" />
    </label>
  );
}

export function WfmDemo() {
  const [daily, setDaily] = useState(8000);
  const [aht, setAht] = useState(240);
  const [goalId, setGoalId] = useState<(typeof GOALS)[number]["id"]>("80/20");
  const [shrink, setShrink] = useState(30);
  const [compare, setCompare] = useState(true);
  const [hover, setHover] = useState<number | null>(null);
  const g = GOALS.find((x) => x.id === goalId)!;

  const m = useMemo(() => {
    const hours = INTRADAY.map((share, i) => {
      const calls = daily * share;
      const need = agentsNeeded(calls, aht, g.goal, g.sec);
      return { hour: HOURS[i], calls, need, staffed: Math.ceil(need / (1 - shrink / 100)) };
    });
    // The common alternative: the same total hours spread flat over the day.
    const flat = Math.round(hours.reduce((s, h) => s + h.need, 0) / hours.length);
    const withFlat = hours.map((h) => ({ ...h, flatSl: serviceLevel(flat, h.calls, aht, g.sec) }));
    const flatSl = withFlat.reduce((s, h) => s + h.flatSl * h.calls, 0) / daily;
    return {
      hours: withFlat,
      flat,
      peak: Math.max(...hours.map((h) => h.staffed)),
      agentHours: hours.reduce((s, h) => s + h.staffed, 0),
      flatSl,
      under: withFlat.filter((h) => h.flatSl < g.goal).length,
    };
  }, [daily, aht, g, shrink]);

  const max = Math.max(...m.hours.map((h) => h.need), m.flat) * 1.1;
  const h = hover != null ? m.hours[hover] : null;

  return (
    <section id="wfm" className="relative bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle
          eyebrow="Synergy WFM"
          title="La gente justa, en la hora justa."
          body="Pronóstico de demanda, dimensionamiento con Erlang C, turnos optimizados y adherencia en tiempo real. Mové los valores de tu operación y mirá cuántos agentes necesitás en cada hora."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-[320px_1fr]">
          <div className="space-y-6 rounded-[24px] bg-md-bg p-6">
            <Slider label="Llamadas por día" value={daily} min={1000} max={30000} step={500} onChange={setDaily} show={fmt(daily)} />
            <Slider label="Tiempo medio de atención" value={aht} min={90} max={600} step={10} onChange={setAht} show={`${Math.floor(aht / 60)}:${String(aht % 60).padStart(2, "0")} min`} />
            <Slider label="Ausentismo y pausas" value={shrink} min={10} max={45} step={1} onChange={setShrink} show={`${shrink}%`} />
            <div>
              <p className="text-sm text-md-muted">Nivel de servicio objetivo</p>
              <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-[#E7EBF5] p-1" role="radiogroup" aria-label="Nivel de servicio objetivo">
                {GOALS.map((x) => (
                  <button key={x.id} role="radio" aria-checked={goalId === x.id} onClick={() => setGoalId(x.id)} className={`rounded-lg py-1.5 font-data text-sm transition ${goalId === x.id ? "bg-white text-md-ink shadow-[0_1px_3px_rgba(1,1,54,0.12)]" : "text-md-muted"}`}>
                    {x.id}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-md-muted">{g.goal * 100}% de llamadas atendidas en menos de {g.sec} s</p>
            </div>
            <label className="flex items-center gap-3 text-sm text-md-ink">
              <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} className="h-4 w-4 accent-[#2A449E]" />
              Comparar con dotación fija
            </label>
          </div>

          <div className="rounded-[24px] border border-md-line p-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-md-surface2 p-4">
                <p className="text-xs text-md-muted">Pico de agentes conectados</p>
                <p className="mt-1 font-display text-3xl font-extrabold text-md-ink">{fmt(m.peak)}</p>
              </div>
              <div className="rounded-2xl bg-md-surface2 p-4">
                <p className="text-xs text-md-muted">Horas-agente por día</p>
                <p className="mt-1 font-display text-3xl font-extrabold text-md-ink">{fmt(m.agentHours)}</p>
              </div>
              <div className="rounded-2xl bg-md-surface2 p-4">
                <p className="text-xs text-md-muted">{compare ? "Nivel de servicio con dotación fija" : "Nivel de servicio con WFM"}</p>
                <p className="mt-1 font-display text-3xl font-extrabold text-md-ink">{compare ? `${Math.round(m.flatSl * 100)}%` : `≥ ${g.goal * 100}%`}</p>
                {compare && m.under > 0 && <p className="mt-1 text-xs font-medium text-md-err-fg">⚠ {m.under} de {m.hours.length} horas bajo objetivo</p>}
              </div>
            </div>

            {/* agents on the phones per hour: one series, one axis */}
            <div className="mt-6">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-semibold text-md-ink">Agentes en línea necesarios por hora</p>
                <p className="min-h-[1rem] font-data text-xs text-md-muted" aria-live="polite">
                  {h ? `${h.hour} · ${fmt(h.calls)} llamadas · ${h.need} agentes (${h.staffed} programados)${compare ? ` · fija: ${Math.round(h.flatSl * 100)}%` : ""}` : "Pasá el mouse por una barra"}
                </p>
              </div>
              <div className="relative mt-4 h-56" onMouseLeave={() => setHover(null)}>
                {[0.25, 0.5, 0.75, 1].map((f) => (
                  <div key={f} className="absolute inset-x-0 border-t border-[#EEF1F8]" style={{ bottom: `${f * 100}%` }}>
                    <span className="absolute -top-2 left-0 bg-white pr-1 font-data text-[10px] text-md-muted">{Math.round(max * f)}</span>
                  </div>
                ))}
                <div className="absolute inset-0 left-8 flex items-end gap-[2px]">
                  {m.hours.map((x, i) => {
                    const short = compare && x.flatSl < g.goal;
                    return (
                      <button
                        key={x.hour}
                        onMouseEnter={() => setHover(i)}
                        onFocus={() => setHover(i)}
                        aria-label={`${x.hour}: ${x.need} agentes${short ? ", dotación fija bajo objetivo" : ""}`}
                        className="group relative flex h-full flex-1 items-end"
                      >
                        <motion.span
                          className={`w-full rounded-t ${short ? "bg-[#B42318]" : "bg-md-blue"} ${hover === i ? "opacity-100" : hover != null ? "opacity-60" : ""}`}
                          animate={{ height: `${(x.need / max) * 100}%` }}
                          transition={{ type: "spring", stiffness: 200, damping: 26 }}
                        />
                      </button>
                    );
                  })}
                  {compare && (
                    <motion.div className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-md-ink" animate={{ bottom: `${(m.flat / max) * 100}%` }} transition={{ type: "spring", stiffness: 200, damping: 26 }}>
                      <span className="absolute -top-6 right-0 rounded bg-md-ink px-1.5 py-0.5 font-data text-[10px] text-white">dotación fija: {m.flat}</span>
                    </motion.div>
                  )}
                </div>
              </div>
              <div className="ml-8 mt-2 flex gap-[2px]">
                {m.hours.map((x, i) => (
                  <span key={x.hour} className="flex-1 text-center font-data text-[10px] text-md-muted">{i % 2 === 0 ? x.hour.slice(0, 2) : ""}</span>
                ))}
              </div>
              {compare && (
                <p className="mt-4 text-sm text-md-muted">
                  Con las mismas horas repartidas parejo, las horas pico quedan <b className="text-md-err-fg">en rojo</b>: la cola crece y el nivel de servicio cae al {Math.round(m.flatSl * 100)}%. Synergy arma los turnos siguiendo la curva.
                </p>
              )}
            </div>
          </div>
        </div>

        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["Optimización de turnos", "Turnos y descansos que siguen la curva de demanda."],
            ["Autogestión de licencias", "Los agentes piden cambios y licencias desde el celular."],
            ["Adherencia en tiempo real", "Alertas cuando la operación se desvía del plan."],
          ].map(([t, d]) => (
            <li key={t} className="rounded-2xl border border-md-line p-4">
              <p className="font-semibold text-md-ink">{t}</p>
              <p className="mt-1 text-sm text-md-muted">{d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
