import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { PROTOCOL, SAMPLE, score, type Analysis, type Emotion, type ItemStatus } from "@/lib/qiq";
import { toWavBase64 } from "@/lib/wav";
import { SectionTitle } from "./ui";

const STATUS: Record<ItemStatus, { label: string; cls: string }> = {
  met: { label: "Cumple", cls: "bg-md-ok-bg text-md-ok-fg" },
  partial: { label: "Parcial", cls: "bg-md-warn-bg text-md-warn-fg" },
  not_met: { label: "No cumple", cls: "bg-md-err-bg text-md-err-fg" },
  na: { label: "N/A", cls: "bg-md-chip text-md-muted" },
};
const EMOTIONS: Record<Emotion, string> = { alegria: "Alegría", tristeza: "Tristeza", ira: "Ira", miedo: "Miedo", sorpresa: "Sorpresa", desprecio: "Desprecio" };
const ALERTS: Record<string, string> = {
  insulto_cliente: "Insulto del cliente",
  insulto_agente: "Insulto del agente",
  maltrato: "Maltrato",
  amenaza_baja: "Amenaza de baja",
  promesa_indebida: "Promesa indebida",
  dato_sensible: "Dato sensible",
  escalamiento: "Pedido de escalamiento",
};
const STEPS = ["Subiendo el audio", "Transcribiendo y separando hablantes", "Evaluando el protocolo", "Midiendo emociones y alertas"];
const secs = (t: string | null) => (t ? t.split(":").reduce((s, p) => s * 60 + Number(p), 0) : null);

function Ring({ value }: { value: number | null }) {
  const v = value ?? 0;
  const c = 2 * Math.PI * 42;
  const color = v >= 85 ? "#1C7A4C" : v >= 60 ? "#C4731C" : "#B42318";
  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#E9EDF6" strokeWidth="9" />
        <motion.circle
          cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - v / 100) }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-display text-3xl font-extrabold text-md-ink">{value ?? "–"}</p>
          <p className="text-[10px] uppercase tracking-wider text-md-muted">Calidad</p>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ a, audioUrl, onReset }: { a: Analysis; audioUrl: string | null; onReset: () => void }) {
  const [open, setOpen] = useState<string | null>(a.items.find((i) => i.status !== "met")?.id ?? null);
  const [hl, setHl] = useState<string | null>(null);
  const player = useRef<HTMLAudioElement>(null);
  const lines = useRef<Record<number, HTMLLIElement | null>>({});
  const total = score(a.items);
  const name = (id: string) => PROTOCOL.find((p) => p.id === id)?.name ?? id;

  function jump(t: string | null) {
    if (!t) return;
    setHl(t);
    const idx = a.transcript.findIndex((l) => l.t >= t);
    lines.current[idx >= 0 ? idx : a.transcript.length - 1]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    const s = secs(t);
    if (player.current && s != null) {
      player.current.currentTime = s;
      player.current.play().catch(() => {});
    }
  }

  if (!a.evaluable)
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-[0_1px_3px_rgba(1,1,54,0.1)]">
        <p className="font-display text-xl font-bold text-md-ink">No pudimos evaluar esta llamada</p>
        <p className="mt-2 text-md-muted">{a.notEvaluableReason}</p>
        <button onClick={onReset} className="mt-6 rounded-full bg-md-navy px-5 py-2.5 text-sm font-semibold text-white">Probar con otro audio</button>
      </div>
    );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[28px] border border-md-line bg-md-bg shadow-[0_24px_60px_rgba(1,1,54,0.12)]">
      {/* app chrome */}
      <div className="flex items-center justify-between border-b border-md-line bg-md-navy px-5 py-3 text-white">
        <p className="font-display text-sm font-bold">Quality<span className="text-md-cyan">IQ</span> <span className="ml-2 font-body text-xs font-normal text-md-dark-muted">Interacción analizada</span></p>
        <button onClick={onReset} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20">Analizar otra</button>
      </div>

      <div className="grid gap-4 p-4 md:p-6 lg:grid-cols-[1.15fr_1fr]">
        <div className="space-y-4">
          <div className="flex flex-col gap-5 rounded-2xl border border-md-line bg-white p-5 sm:flex-row sm:items-center">
            <Ring value={total} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${a.resolution === "resuelto" ? STATUS.met.cls : a.resolution === "no_resuelto" ? STATUS.not_met.cls : STATUS.na.cls}`}>
                  {a.resolution === "resuelto" ? "Resuelto" : a.resolution === "no_resuelto" ? "No resuelto" : "Sin dato"}
                </span>
                <span className="rounded-full bg-md-info-bg px-2.5 py-1 text-xs font-semibold text-md-blue">{a.contactReason}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-md-ink">{a.summary}</p>
            </div>
          </div>

          {a.alerts.length > 0 && (
            <div className="space-y-2">
              {a.alerts.map((al, i) => (
                <button key={i} onClick={() => jump(al.timestamp)} className="flex w-full items-start gap-3 rounded-2xl border border-[#E7B3B9] bg-[#FBE7E9] p-3 text-left text-sm">
                  <span className="mt-0.5 rounded-full bg-[#C4303F] px-2 py-0.5 text-[10px] font-bold uppercase text-white">{al.severity}</span>
                  <span>
                    <b className="text-[#A32634]">{ALERTS[al.type] ?? al.type}</b>
                    <span className="text-md-ink"> · “{al.quote}”</span>
                    {al.timestamp && <span className="ml-1 font-data text-xs text-md-muted">{al.timestamp}</span>}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="rounded-2xl border border-md-line bg-white p-2">
            <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[1.4px] text-md-muted">Protocolo</p>
            <ul>
              {a.items.map((it) => (
                <li key={it.id} className="border-t border-md-line first:border-0">
                  <button
                    onClick={() => { setOpen(open === it.id ? null : it.id); jump(it.timestamp); }}
                    aria-expanded={open === it.id}
                    className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-md-surface2"
                  >
                    <span className="text-sm font-medium text-md-ink">{name(it.id)}</span>
                    <span className="flex items-center gap-2">
                      {it.timestamp && <span className="font-data text-[11px] text-md-muted">{it.timestamp}</span>}
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS[it.status].cls}`}>{STATUS[it.status].label}</span>
                    </span>
                  </button>
                  <AnimatePresence>
                    {open === it.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="space-y-2 px-3 pb-3 text-sm">
                          <p className="text-md-muted">“{it.evidence}”</p>
                          {it.better && (
                            <p className="rounded-xl bg-md-info-bg p-3 text-md-ink">
                              <b className="text-md-blue">Cómo mejorarlo: </b>
                              {it.better}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {(["agent", "client"] as const).map((who) => {
              const s = a.sentiment[who];
              return (
                <div key={who} className="rounded-2xl border border-md-line bg-white p-4">
                  <p className="text-xs text-md-muted">{who === "agent" ? "Agente" : "Cliente"}</p>
                  <div className="mt-2 h-1.5 rounded-full bg-gradient-to-r from-[#B42318] via-[#C4731C] to-[#1C7A4C]">
                    <span className="relative block h-3 w-3 -translate-y-[3px] rounded-full border-2 border-white bg-md-navy" style={{ left: `calc(${((s.score + 1) / 2) * 100}% - 6px)` }} />
                  </div>
                  <p className="mt-3 text-sm font-medium leading-snug text-md-ink">{s.label}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-md-line bg-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-[1.4px] text-md-muted">Emociones del cliente</p>
            <ul className="mt-3 space-y-2">
              {(Object.keys(EMOTIONS) as Emotion[]).map((e) => (
                <li key={e} className="grid grid-cols-[80px_1fr_36px] items-center gap-2 text-xs">
                  <span className="text-md-muted">{EMOTIONS[e]}</span>
                  <span className="h-2 overflow-hidden rounded-full bg-md-chip">
                    <motion.span className="block h-full rounded-full bg-gradient-to-r from-md-blue to-md-cyan" initial={{ width: 0 }} animate={{ width: `${a.sentiment.client.emotions[e]}%` }} transition={{ duration: 0.8 }} />
                  </span>
                  <span className="text-right font-data text-md-ink">{a.sentiment.client.emotions[e]}%</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-md-line bg-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-[1.4px] text-md-muted">Transcripción</p>
            {audioUrl && <audio ref={player} src={audioUrl} controls className="mt-3 h-9 w-full" />}
            <ul className="mt-3 max-h-80 space-y-1 overflow-y-auto pr-1">
              {a.transcript.map((l, i) => (
                <li key={i} ref={(el) => { lines.current[i] = el; }}>
                  <button
                    onClick={() => jump(l.t)}
                    className={`grid w-full grid-cols-[44px_1fr] gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] transition ${hl === l.t ? "bg-md-info-bg" : "hover:bg-md-surface2"}`}
                  >
                    <span className="font-data text-[11px] text-md-muted">{l.t}</span>
                    <span>
                      <b className={l.speaker === "agente" ? "text-md-blue" : "text-md-cyan-dark"}>{l.speaker === "agente" ? "Agente" : "Cliente"}: </b>
                      <span className="text-md-ink">{l.text}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function QualityDemo() {
  const [result, setResult] = useState<Analysis | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [step, setStep] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);
  useEffect(() => {
    if (step < 1 || step >= STEPS.length - 1) return;
    const id = setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 3500);
    return () => clearTimeout(id);
  }, [step]);

  async function analyze(file: File) {
    setError(null);
    if (!file.type.startsWith("audio/") && !/\.(mp3|wav|m4a|ogg|webm|aac|flac)$/i.test(file.name)) return setError("Elegí un archivo de audio (mp3, wav, m4a…).");
    if (file.size > 40_000_000) return setError("El archivo supera 40 MB.");
    setStep(0);
    try {
      const { data, seconds } = await toWavBase64(file, 8000); // 8 kHz mono: telephony quality, ~1 MB per minute
      if (seconds > 480) throw new Error("Para la demo usá una llamada de hasta 8 minutos.");
      setStep(1);
      const res = await fetch("/api/analyze", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ audio: data, mime: "audio/wav" }) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
      setAudioUrl(URL.createObjectURL(file));
      setResult(json as Analysis);
    } catch (e) {
      setError((e as Error).message.includes("decode") ? "No pudimos leer ese audio." : (e as Error).message);
    } finally {
      setStep(-1);
    }
  }

  function reset() {
    setResult(null);
    setAudioUrl(null);
  }

  return (
    <section id="quality" className="relative bg-md-bg py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle
          center
          eyebrow="QualityIQ · auditoría con IA"
          title={<>Subí una llamada. Mirá lo que vemos nosotros.</>}
          body="QualityIQ escucha el 100% de las interacciones, evalúa tu protocolo ítem por ítem, detecta emociones y alertas, y le dice a cada agente cómo mejorar."
        />

        <div className="mt-12">
          {result ? (
            <Dashboard a={result} audioUrl={audioUrl} onReset={reset} />
          ) : (
            <div className="mx-auto max-w-3xl">
              <label
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) analyze(f); }}
                className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[28px] border-2 border-dashed bg-white px-6 py-14 text-center transition ${
                  drag ? "border-md-blue bg-md-info-bg" : "border-[#B8C1DE] hover:border-md-blue"
                } ${step >= 0 ? "pointer-events-none" : ""}`}
              >
                <input ref={input} type="file" accept="audio/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) analyze(f); }} />
                {step >= 0 ? (
                  <div className="w-full max-w-sm space-y-3 text-left" aria-live="polite">
                    {STEPS.map((s, i) => (
                      <div key={s} className={`flex items-center gap-3 text-sm transition ${i <= step ? "text-md-ink" : "text-md-muted/50"}`}>
                        <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${i < step ? "bg-md-ok-bg text-md-ok-fg" : i === step ? "bg-md-blue text-white" : "bg-md-chip"}`}>
                          {i < step ? "✓" : i === step ? <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> : ""}
                        </span>
                        {s}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-md-info-bg text-md-blue">
                      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></svg>
                    </span>
                    <p className="mt-4 font-display text-xl font-bold text-md-ink">Arrastrá una grabación o hacé clic para elegirla</p>
                    <p className="mt-1 text-sm text-md-muted">mp3, wav o m4a · hasta 8 minutos · el audio no se guarda</p>
                  </>
                )}
              </label>
              {error && <p className="mt-4 rounded-2xl bg-md-err-bg px-4 py-3 text-sm text-md-err-fg">{error}</p>}
              <div className="mt-6 text-center">
                <button onClick={() => setResult(SAMPLE)} disabled={step >= 0} className="rounded-full px-4 py-2 text-sm font-semibold text-md-blue underline-offset-4 hover:underline disabled:opacity-50">
                  ¿No tenés una a mano? Ver una llamada de ejemplo →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
