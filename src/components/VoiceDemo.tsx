import { AnimatePresence, motion } from "framer-motion";
import type { Room } from "livekit-client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { callsUsed, COUNTRIES, MAX_CALLS, SCENARIOS, type CountryId, type ScenarioId, type Turn } from "@/lib/voicebot";
import { DEMO_WHATSAPP_URL } from "@/lib/utils";
import { Aurora, SectionTitle, Wave } from "./ui";

// Llamada en vivo con Maya por LiveKit, como un softphone (igual que el coaching de QualityIQ): el visitante llama,
// suena hasta que Maya atiende, y en la llamada puede silenciarse o colgar. /api/call abre la sala con la voz del país
// elegido y el worker (voice-agent/) contesta; se la puede interrumpir hablando encima.
type Phase = "listo" | "llamando" | "en_curso" | "terminada";
type DemoEvent = { type: "partial"; text: string } | { type: "transcript"; role: "user" | "bot"; text: string } | { type: "closed"; reason: string };

const cookieUsed = () => callsUsed(document.cookie.match(/(?:^|; )mayday_demo_calls=(\d+)/)?.[1]);
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** El tono de llamada saliente (425 Hz, 1 s sonando y 4 s de pausa), con Web Audio: sin archivos. Devuelve cómo pararlo. */
function ringback() {
  const ac = new AudioContext();
  const gain = ac.createGain();
  gain.gain.value = 0;
  gain.connect(ac.destination);
  const osc = ac.createOscillator();
  osc.frequency.value = 425;
  osc.connect(gain);
  osc.start();
  const beat = () => {
    const t = ac.currentTime;
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.setValueAtTime(0, t + 1);
  };
  beat();
  const id = setInterval(beat, 5000);
  return () => { clearInterval(id); void ac.close(); };
}

const PHONE = "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z";
const Icon = ({ d, className = "h-6 w-6" }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);
const MIC = "M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM5 10a7 7 0 0 0 14 0M12 19v3";
const MIC_OFF = "M2 2l20 20M9 9v2a3 3 0 0 0 5.1 2.1M15 9.3V5a3 3 0 0 0-5.9-.7M17 16.9A7 7 0 0 1 5 10M19 10a7 7 0 0 1-.1 1.2M12 19v3";

/** Botón redondo del teléfono con su leyenda debajo. */
function PhoneButton({ label, onClick, tone, disabled, children }: { label: string; onClick: () => void; tone: "start" | "end" | "neutral" | "on"; disabled?: boolean; children: ReactNode }) {
  const color = { start: "bg-[#16a34a] text-white hover:bg-[#15803d]", end: "bg-[#dc2626] text-white hover:bg-[#b91c1c]", neutral: "bg-[#13163F] text-md-dark-text hover:bg-[#1c2054]", on: "bg-white text-md-navy" }[tone];
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button onClick={onClick} disabled={disabled} aria-label={label} className={`grid h-14 w-14 place-items-center rounded-full transition disabled:opacity-50 ${color}`}>
        {children}
      </button>
      <span className="text-[11px] text-md-dark-muted">{label}</span>
    </div>
  );
}

export function VoiceDemo() {
  const [scenario, setScenario] = useState<ScenarioId>("banco");
  const [country, setCountry] = useState<CountryId>("ar");
  const [phase, setPhase] = useState<Phase>("listo");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [partial, setPartial] = useState("");
  const [speaker, setSpeaker] = useState<"bot" | "user" | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [maxSeconds, setMaxSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const room = useRef<Room | null>(null);
  const stopRing = useRef<(() => void) | null>(null);
  const audio = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => setLeft(MAX_CALLS - cookieUsed()), []);
  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [turns, partial]);
  useEffect(() => () => { stopRing.current?.(); void room.current?.disconnect(); }, []);
  useEffect(() => {
    if (phase !== "en_curso") return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  /** Atendió: deja de sonar y corre el reloj. Lo dispara la primera vez que Maya habla (o el respaldo de 8 s). */
  function answered() {
    stopRing.current?.();
    stopRing.current = null;
    setPhase((p) => (p === "llamando" ? "en_curso" : p));
  }

  async function call() {
    setError(null);
    setNote(null);
    setTurns([]);
    setPartial("");
    setElapsed(0);
    setMuted(false);
    setPhase("llamando");
    stopRing.current = ringback();
    try {
      const res = await fetch("/api/call", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ scenario, country }) });
      const s = await res.json().catch(() => ({}));
      if (typeof s.left === "number") setLeft(s.left);
      if (!res.ok) throw new Error(s.error || `Error ${res.status}`);
      setMaxSeconds(s.maxSeconds);

      const { Room, RoomEvent, Track } = await import("livekit-client");
      const r = new Room();
      room.current = r;
      r.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind === Track.Kind.Audio) audio.current?.appendChild(track.attach());
      });
      r.on(RoomEvent.DataReceived, (payload) => {
        let e: DemoEvent;
        try { e = JSON.parse(new TextDecoder().decode(payload)); } catch { return; }
        if (e.type === "partial") setPartial(e.text);
        else if (e.type === "transcript") {
          if (e.role === "user") setPartial("");
          setTurns((t) => [...t, { role: e.role, text: e.text }]);
        } else if (e.type === "closed") { setNote(e.reason); void r.disconnect(); }
      });
      r.on(RoomEvent.ActiveSpeakersChanged, (ps) => {
        const who = !ps.length ? null : ps.some((p) => p.identity === r.localParticipant.identity) ? "user" : "bot";
        if (who === "bot") answered();
        setSpeaker(who);
      });
      r.on(RoomEvent.AudioPlaybackStatusChanged, () => setBlocked(!r.canPlaybackAudio));
      r.on(RoomEvent.Disconnected, () => {
        stopRing.current?.();
        stopRing.current = null;
        if (audio.current) audio.current.innerHTML = "";
        setSpeaker(null);
        setPartial("");
        setPhase("terminada");
      });
      await r.connect(s.url, s.token);
      await r.localParticipant.setMicrophoneEnabled(true).catch(() => {
        throw new Error("Necesitamos permiso para usar el micrófono.");
      });
      // Maya greets when this arrives (voice-agent/src/worker.ts): the visitor is connected and listening.
      await r.localParticipant.publishData(new TextEncoder().encode(JSON.stringify({ type: "hello" })), { reliable: true });
      setTimeout(() => room.current === r && answered(), 8000); // si el indicador de quién habla no llega, igual deja de sonar
    } catch (e) {
      setError((e as Error).message);
      stopRing.current?.();
      stopRing.current = null;
      void room.current?.disconnect();
      setPhase("listo");
    }
  }

  const hangUp = () => void room.current?.disconnect();
  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    void room.current?.localParticipant.setMicrophoneEnabled(!next);
  };
  const busy = phase === "llamando" || phase === "en_curso";
  const out = left === 0 && !busy;
  const status = {
    listo: left === null ? "Lista para atender" : `${left} de ${MAX_CALLS} llamadas disponibles`,
    llamando: "Llamando…",
    en_curso: `${mmss(elapsed)} / ${mmss(maxSeconds)}${speaker === "bot" ? " · hablando" : speaker === "user" ? " · te escucha" : ""}`,
    terminada: note || `Llamada finalizada · ${mmss(elapsed)}`,
  }[phase];

  return (
    <section id="voicebot" className="relative bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <SectionTitle
            eyebrow="Voicebot · desarrollado por Mayday"
            title={<>La voz de tus agentes, con acento local.</>}
            body="Maya atiende como una persona de tu país: con su acento, sus modismos y sus documentos. Entiende, resuelve la gestión y deriva a un agente cuando hace falta. Elegí tu país, llamala y probá interrumpirla: es la misma tecnología que ponemos en producción."
          />
          <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-md-muted">¿Desde dónde llamás?</p>
          <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="País">
            {(Object.keys(COUNTRIES) as CountryId[]).map((id) => (
              <button
                key={id}
                role="radio"
                aria-checked={country === id}
                disabled={busy}
                onClick={() => setCountry(id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  country === id ? "border-md-navy bg-md-navy text-white" : "border-md-line bg-white text-md-ink hover:bg-md-surface2"
                }`}
              >
                {COUNTRIES[id].label}
              </button>
            ))}
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-md-muted">¿A quién llamás?</p>
          <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Escenario">
            {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
              <button
                key={id}
                role="radio"
                aria-checked={scenario === id}
                disabled={busy}
                onClick={() => setScenario(id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  scenario === id ? "border-md-cyan-dark bg-md-cyan-dark text-white" : "border-md-line bg-white text-md-ink hover:bg-md-surface2"
                }`}
              >
                {SCENARIOS[id].label}
              </button>
            ))}
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["< 1 s", "de respuesta por turno"],
              ["6 acentos", "y modismos de cada país"],
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
          <div className="relative mx-auto max-w-md rounded-[28px] border border-md-dark-line bg-[#060834] p-5 text-md-dark-text shadow-[0_24px_60px_rgba(1,1,54,0.35)]">
            {/* El teléfono */}
            <div className="flex flex-col items-center pt-2 text-center">
              <div className="relative grid h-20 w-20 place-items-center rounded-full bg-[#13163F]">
                {phase === "llamando" && <span className="absolute inset-0 animate-ping rounded-full bg-md-cyan/30 motion-reduce:animate-none" />}
                {phase === "en_curso" && speaker === "bot" && <span className="absolute -inset-1 rounded-full ring-2 ring-md-cyan" />}
                <span className="relative font-display text-2xl font-extrabold text-white">M</span>
              </div>
              <p className="mt-3 font-display text-lg font-bold">Maya</p>
              <p className="text-xs text-md-dark-muted">{SCENARIOS[scenario].label} · acento {COUNTRIES[country].accent}</p>
              <p className={`mt-1 font-data text-xs tabular-nums ${phase === "en_curso" ? "text-[#4ade80]" : "text-md-dark-muted"}`} aria-live="polite">{status}</p>
            </div>

            <div className="mt-4 flex justify-center">
              <Wave active={speaker !== null} bars={24} className={speaker === "user" ? "text-md-cyan" : "text-[#A9B4FF]"} />
            </div>

            {/* La transcripción */}
            <div ref={list} className="mt-3 h-56 space-y-2 overflow-y-auto rounded-2xl bg-[#0A0D3F] p-3" aria-live="polite">
              {!turns.length && !partial && (
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
              {partial && <p className="ml-auto max-w-[85%] rounded-2xl bg-md-cyan/50 px-3 py-2 text-[13px] italic leading-snug text-md-navy">{partial}</p>}
            </div>

            {blocked && (
              <button onClick={() => void room.current?.startAudio().then(() => setBlocked(false))} className="mt-3 w-full rounded-xl bg-[#78350f] px-3 py-2 text-xs text-[#fde68a]">
                El navegador pausó el audio de Maya · tocá para activarlo
              </button>
            )}
            {error && <p className="mt-3 rounded-xl bg-[#7f1d1d] px-3 py-2 text-xs text-[#fecaca]">{error}</p>}

            {/* Los botones del teléfono */}
            <div className="mt-5 flex justify-center gap-10 pb-1">
              {phase === "llamando" && (
                <PhoneButton label="Cortar" tone="end" onClick={hangUp}>
                  <Icon d={PHONE} className="h-6 w-6 rotate-[135deg]" />
                </PhoneButton>
              )}
              {phase === "en_curso" && (
                <>
                  <PhoneButton label={muted ? "Silenciado" : "Silenciar"} tone={muted ? "on" : "neutral"} onClick={toggleMute}>
                    <Icon d={muted ? MIC_OFF : MIC} />
                  </PhoneButton>
                  <PhoneButton label="Colgar" tone="end" onClick={hangUp}>
                    <Icon d={PHONE} className="h-6 w-6 rotate-[135deg]" />
                  </PhoneButton>
                </>
              )}
              {(phase === "listo" || phase === "terminada") && (
                <PhoneButton label={out ? "Sin llamadas" : phase === "terminada" ? "Volver a llamar" : "Llamar"} tone="start" onClick={() => void call()} disabled={out}>
                  <Icon d={PHONE} />
                </PhoneButton>
              )}
            </div>
            {out && (
              <p className="mt-2 text-center">
                <a href={DEMO_WHATSAPP_URL} className="text-xs font-semibold text-md-cyan hover:underline">
                  Usaste tus llamadas de prueba · pedí una demo completa por WhatsApp →
                </a>
              </p>
            )}
            <div ref={audio} hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
