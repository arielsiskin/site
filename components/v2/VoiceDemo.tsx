import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MAX_TURNS, SCENARIOS, type ScenarioId, type Turn } from "@/lib/voicebot";
import { toWavBase64 } from "@/lib/wav";
import { Aurora, SectionTitle, Wave } from "./ui";

type Phase = "idle" | "connecting" | "speaking" | "ready" | "recording" | "thinking";
const LABEL: Record<Phase, string> = {
  idle: "Iniciar llamada",
  connecting: "Conectando…",
  speaking: "Maya está hablando · tocá para interrumpir",
  ready: "Tocá para hablar",
  recording: "Escuchando · tocá para enviar",
  thinking: "Maya está pensando…",
};

export function VoiceDemo() {
  const [scenario, setScenario] = useState<ScenarioId>("mayday");
  const [phase, setPhase] = useState<Phase>("idle");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [ms, setMs] = useState<{ think: number; voice: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const rec = useRef<MediaRecorder | null>(null);
  const player = useRef<HTMLAudioElement | null>(null);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [turns, phase]);
  useEffect(() => () => hangUp(), []); // eslint-disable-line react-hooks/exhaustive-deps

  async function ask(history: Turn[], audio?: string) {
    const res = await fetch("/api/voice", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ scenario, history, audio, mime: audio ? "audio/wav" : undefined }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
    return json as { heard: string | null; reply: string; audio: string; ms: { think: number; voice: number } };
  }

  function speak(b64: string) {
    setPhase("speaking");
    const a = new Audio(`data:audio/mpeg;base64,${b64}`);
    player.current = a;
    a.onended = () => setPhase((p) => (p === "speaking" ? "ready" : p));
    a.play().catch(() => setPhase("ready"));
  }

  async function start() {
    setError(null);
    setTurns([]);
    setPhase("connecting");
    try {
      const r = await ask([]);
      setTurns([{ role: "bot", text: r.reply }]);
      setMs(r.ms);
      speak(r.audio);
    } catch (e) {
      setError((e as Error).message);
      setPhase("idle");
    }
  }

  async function record() {
    player.current?.pause(); // barge-in
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const chunks: Blob[] = [];
      const r = new MediaRecorder(stream);
      r.ondataavailable = (e) => chunks.push(e.data);
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        send(new Blob(chunks, { type: r.mimeType }));
      };
      rec.current = r;
      r.start();
      setPhase("recording");
    } catch {
      setError("Necesitamos permiso para usar el micrófono.");
      setPhase("ready");
    }
  }

  async function send(blob: Blob) {
    setPhase("thinking");
    try {
      const { data, seconds } = await toWavBase64(blob, 16000);
      if (seconds < 0.4) return setPhase("ready");
      const r = await ask(turns, data);
      const next: Turn[] = [...turns, { role: "user", text: r.heard || "…" }, { role: "bot", text: r.reply }];
      setTurns(next);
      setMs(r.ms);
      speak(r.audio);
    } catch (e) {
      setError((e as Error).message);
      setPhase("ready");
    }
  }

  function hangUp() {
    player.current?.pause();
    if (rec.current?.state === "recording") {
      rec.current.onstop = null;
      rec.current.stop();
      rec.current.stream.getTracks().forEach((t) => t.stop());
    }
    setPhase("idle");
  }

  function onMain() {
    if (phase === "idle") return start();
    if (phase === "recording") return rec.current?.stop();
    if (phase === "ready" || phase === "speaking") return record();
  }

  const live = phase !== "idle";
  const tooLong = turns.length >= MAX_TURNS * 2;

  return (
    <section id="voicebot" className="relative bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <SectionTitle
            eyebrow="Voicebot · desarrollado por Mayday"
            title={<>Atiende como una persona. Escala como software.</>}
            body="Maya entiende lo que dice el cliente, resuelve la gestión y deriva a un agente cuando hace falta. Elegí un escenario y hablale: es la misma tecnología que ponemos en producción."
          />
          <div className="mt-8 flex flex-wrap gap-2" role="radiogroup" aria-label="Escenario">
            {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
              <button
                key={id}
                role="radio"
                aria-checked={scenario === id}
                disabled={live}
                onClick={() => setScenario(id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  scenario === id ? "border-md-navy bg-md-navy text-white" : "border-md-line bg-white text-md-ink hover:bg-md-surface2"
                }`}
              >
                {SCENARIOS[id].label}
              </button>
            ))}
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["< 1,5 s", "de respuesta por turno"],
              ["24/7", "sin colas de espera"],
              ["100%", "de llamadas auditadas con QualityIQ"],
            ].map(([k, v]) => (
              <li key={k} className="rounded-2xl bg-md-bg p-4">
                <p className="font-display text-2xl font-extrabold text-md-ink">{k}</p>
                <p className="mt-1 text-sm text-md-muted">{v}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-[32px] bg-md-sky p-5 md:p-8">
          <Aurora />
          <div className="relative mx-auto max-w-md rounded-[28px] border border-md-dark-line bg-[#060834] p-4 text-md-dark-text shadow-[0_24px_60px_rgba(1,1,54,0.35)]">
            <div className="flex items-center justify-between px-1">
              <div>
                <p className="text-sm font-semibold">Maya · {SCENARIOS[scenario].label}</p>
                <p className="font-data text-[11px] text-md-dark-muted">
                  {live ? "en llamada" : "lista para atender"}
                  {ms && live && ` · IA ${(ms.think / 1000).toFixed(1)} s · voz ${(ms.voice / 1000).toFixed(1)} s`}
                </p>
              </div>
              {live && (
                <button onClick={hangUp} className="rounded-full bg-[#dc2626] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#b91c1c]">
                  Colgar
                </button>
              )}
            </div>

            <div ref={list} className="mt-4 h-72 space-y-2 overflow-y-auto px-1" aria-live="polite">
              {!turns.length && (
                <div className="grid h-full place-items-center text-center text-sm text-md-dark-muted">
                  <p>
                    {SCENARIOS[scenario].hint}
                    <br />
                    <span className="text-xs opacity-70">Usa tu micrófono. Nada se graba ni se guarda.</span>
                  </p>
                </div>
              )}
              <AnimatePresence initial={false}>
                {turns.map((t, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-snug ${
                      t.role === "bot" ? "bg-[#13163F] text-md-dark-text" : "ml-auto bg-md-cyan text-md-navy"
                    }`}
                  >
                    {t.text}
                  </motion.p>
                ))}
              </AnimatePresence>
            </div>

            {error && <p className="mt-3 rounded-xl bg-[#7f1d1d] px-3 py-2 text-xs text-[#fecaca]">{error}</p>}

            <div className="mt-4 flex flex-col items-center gap-3 pb-2">
              <Wave active={phase === "speaking" || phase === "recording"} bars={24} className={phase === "recording" ? "text-md-cyan" : "text-[#A9B4FF]"} />
              <button
                onClick={onMain}
                disabled={phase === "connecting" || phase === "thinking" || (tooLong && live)}
                aria-label={LABEL[phase]}
                className={`relative grid h-16 w-16 place-items-center rounded-full transition disabled:opacity-60 ${
                  phase === "recording" ? "bg-md-cyan text-md-navy" : "bg-white text-md-navy hover:scale-105"
                }`}
              >
                {phase === "recording" && <span className="absolute inset-0 animate-ping rounded-full bg-md-cyan/40" />}
                <svg viewBox="0 0 24 24" className="relative h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {phase === "idle" ? (
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
                  ) : (
                    <>
                      <rect x="9" y="2" width="6" height="12" rx="3" />
                      <path d="M5 10a7 7 0 0 0 14 0M12 19v3" />
                    </>
                  )}
                </svg>
              </button>
              <p className="text-xs text-md-dark-muted">{tooLong && live ? "Fin de la demo: colgá y volvé a empezar." : LABEL[phase]}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
