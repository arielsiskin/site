import { AnimatePresence, motion } from "framer-motion";
import type { Room } from "livekit-client";
import { useEffect, useRef, useState } from "react";
import { callsUsed, MAX_CALLS, SCENARIOS, type ScenarioId, type Turn } from "@/lib/voicebot";
import { DEMO_WHATSAPP_URL } from "@/lib/utils";
import { Aurora, SectionTitle, Wave } from "./ui";

// Llamada en vivo con Maya por LiveKit: /api/call abre la sala y el worker (voice-agent/) contesta. Se la puede
// interrumpir hablando encima. Los eventos del canal de datos los manda voice-agent/src/worker.ts.
type Phase = "idle" | "connecting" | "live";
type DemoEvent = { type: "partial"; text: string } | { type: "transcript"; role: "user" | "bot"; text: string } | { type: "closed"; reason: string };

const cookieUsed = () => callsUsed(document.cookie.match(/(?:^|; )mayday_demo_calls=(\d+)/)?.[1]);

export function VoiceDemo() {
  const [scenario, setScenario] = useState<ScenarioId>("mayday");
  const [phase, setPhase] = useState<Phase>("idle");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [partial, setPartial] = useState("");
  const [speaker, setSpeaker] = useState<"bot" | "user" | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const room = useRef<Room | null>(null);
  const audio = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => setLeft(MAX_CALLS - cookieUsed()), []);
  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [turns, partial]);
  useEffect(() => () => void room.current?.disconnect(), []);
  useEffect(() => {
    if (phase !== "live" || seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, seconds]);

  async function start() {
    setError(null);
    setNote(null);
    setTurns([]);
    setPartial("");
    setPhase("connecting");
    try {
      const res = await fetch("/api/call", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ scenario }) });
      const s = await res.json().catch(() => ({}));
      if (typeof s.left === "number") setLeft(s.left);
      if (!res.ok) throw new Error(s.error || `Error ${res.status}`);

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
      r.on(RoomEvent.ActiveSpeakersChanged, (ps) =>
        setSpeaker(!ps.length ? null : ps.some((p) => p.identity === r.localParticipant.identity) ? "user" : "bot"));
      r.on(RoomEvent.AudioPlaybackStatusChanged, () => setBlocked(!r.canPlaybackAudio));
      r.on(RoomEvent.Disconnected, () => {
        if (audio.current) audio.current.innerHTML = "";
        setSpeaker(null);
        setPartial("");
        setPhase("idle");
      });
      await r.connect(s.url, s.token);
      await r.localParticipant.setMicrophoneEnabled(true).catch(() => {
        throw new Error("Necesitamos permiso para usar el micrófono.");
      });
      // Maya greets when this arrives (voice-agent/src/worker.ts): the visitor is connected and listening.
      await r.localParticipant.publishData(new TextEncoder().encode(JSON.stringify({ type: "hello" })), { reliable: true });
      setSeconds(s.maxSeconds);
      setPhase("live");
    } catch (e) {
      setError((e as Error).message);
      void room.current?.disconnect();
      setPhase("idle");
    }
  }

  const hangUp = () => void room.current?.disconnect();
  const live = phase !== "idle";
  const out = left === 0 && !live;
  const label = phase === "connecting" ? "Conectando…" : phase === "live"
    ? speaker === "bot" ? "Maya está hablando · hablale encima para interrumpirla" : speaker === "user" ? "Te escucha…" : "Hablá cuando quieras"
    : out ? "Usaste tus pruebas" : "Iniciar llamada";

  return (
    <section id="voicebot" className="relative bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <SectionTitle
            eyebrow="Voicebot · desarrollado por Mayday"
            title={<>Atiende como una persona. Escala como software.</>}
            body="Maya entiende lo que dice el cliente, resuelve la gestión y deriva a un agente cuando hace falta. Elegí un escenario y llamala: conversación en tiempo real, la podés interrumpir como a una persona. Es la misma tecnología que ponemos en producción."
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
              ["< 1 s", "de respuesta por turno"],
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
                  {phase === "live"
                    ? `en llamada · ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
                    : left === null ? "lista para atender" : `${left} de ${MAX_CALLS} llamadas disponibles`}
                </p>
              </div>
              {live && (
                <button onClick={hangUp} className="rounded-full bg-[#dc2626] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#b91c1c]">
                  Colgar
                </button>
              )}
            </div>

            <div ref={list} className="mt-4 h-72 space-y-2 overflow-y-auto px-1" aria-live="polite">
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
            {note && !error && <p className="mt-3 rounded-xl bg-[#13163F] px-3 py-2 text-xs text-md-dark-muted">{note}</p>}
            {error && <p className="mt-3 rounded-xl bg-[#7f1d1d] px-3 py-2 text-xs text-[#fecaca]">{error}</p>}

            <div className="mt-4 flex flex-col items-center gap-3 pb-2">
              <Wave active={speaker !== null} bars={24} className={speaker === "user" ? "text-md-cyan" : "text-[#A9B4FF]"} />
              <button
                onClick={phase === "idle" ? start : undefined}
                disabled={phase === "connecting" || out}
                aria-label={label}
                className={`relative grid h-16 w-16 place-items-center rounded-full transition disabled:opacity-60 ${
                  phase === "live" ? "bg-md-cyan text-md-navy" : "bg-white text-md-navy hover:scale-105"
                }`}
              >
                {phase === "live" && speaker === "user" && <span className="absolute inset-0 animate-ping rounded-full bg-md-cyan/40" />}
                <svg viewBox="0 0 24 24" className="relative h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {phase === "live" ? (
                    <>
                      <rect x="9" y="2" width="6" height="12" rx="3" />
                      <path d="M5 10a7 7 0 0 0 14 0M12 19v3" />
                    </>
                  ) : (
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
                  )}
                </svg>
              </button>
              <p className="text-xs text-md-dark-muted">{label}</p>
              {out && (
                <a href={DEMO_WHATSAPP_URL} className="text-xs font-semibold text-md-cyan hover:underline">
                  Pedí una demo completa por WhatsApp →
                </a>
              )}
            </div>
            <div ref={audio} hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
