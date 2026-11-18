import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SCENARIOS, type ScenarioId, type Turn } from "@/lib/voicebot";
import { SectionTitle } from "./ui";

const QUICK: Record<ScenarioId, string[]> = {
  mayday: ["¿Qué hace Mayday?", "¿Tienen voicebot?", "Quiero una demo"],
  banco: ["Perdí mi tarjeta", "¿Cuál es mi saldo?", "Quiero hablar con una persona"],
  delivery: ["Mi pedido no llegó", "Es el pedido 48213", "Quiero cambiar la dirección"],
};
type Insight = { intent: string | null; entities: { key: string; value: string }[]; ms: number };

export function BotDemo() {
  const [scenario, setScenario] = useState<ScenarioId>("banco");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const section = useRef<HTMLElement>(null);

  async function call(history: Turn[], text?: string) {
    const res = await fetch("/api/voice", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ scenario, history, text, speak: false }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
    return json as { reply: string; intent: string | null; entities: Insight["entities"]; ms: { think: number } };
  }

  async function greet() {
    setTurns([]);
    setInsights([]);
    setError(null);
    setTyping(true);
    try {
      const r = await call([]);
      setTurns([{ role: "bot", text: r.reply }]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setTyping(false);
    }
  }

  // Greet when the section first scrolls into view, and again on every scenario change.
  useEffect(() => {
    if (started.current) return void greet();
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        greet();
        io.disconnect();
      }
    }, { threshold: 0.3 });
    if (section.current) io.observe(section.current);
    return () => io.disconnect();
  }, [scenario]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [turns, typing]);

  async function send(text: string) {
    if (!text.trim() || typing) return;
    const history = turns;
    setTurns([...history, { role: "user", text }]);
    setDraft("");
    setError(null);
    setTyping(true);
    try {
      const r = await call(history, text);
      setTurns((t) => [...t, { role: "bot", text: r.reply }]);
      setInsights((i) => [{ intent: r.intent, entities: r.entities, ms: r.ms.think }, ...i].slice(0, 5));
    } catch (e) {
      setError((e as Error).message);
      setTurns(history);
      setDraft(text);
    } finally {
      setTyping(false);
    }
  }

  const last = insights[0];

  return (
    <section id="iabot" ref={section} className="relative overflow-hidden bg-md-bg py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* phone */}
        <div className="order-2 lg:order-1">
          <div className="relative mx-auto max-w-sm">
            <div aria-hidden className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(4,204,219,0.35),transparent_65%)] blur-2xl" />
            <div className="relative overflow-hidden rounded-[40px] border-[10px] border-md-navy bg-[#EFEAE2] shadow-[0_24px_60px_rgba(1,1,54,0.3)]">
              <div className="flex items-center gap-3 bg-[#0B5C4E] px-4 py-3 text-white">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-sm font-bold">M</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Maya · {SCENARIOS[scenario].label}</p>
                  <p className="text-[11px] text-white/70">{typing ? "escribiendo…" : "en línea"}</p>
                </div>
                <button onClick={greet} className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] hover:bg-white/25" aria-label="Reiniciar conversación">Reiniciar</button>
              </div>
              <div ref={list} className="h-[400px] space-y-2 overflow-y-auto px-3 py-4" aria-live="polite">
                <AnimatePresence initial={false}>
                  {turns.map((t, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`max-w-[82%] rounded-xl px-3 py-2 text-[13px] leading-snug shadow-sm ${t.role === "user" ? "ml-auto rounded-tr-sm bg-[#D9FDD3] text-[#111]" : "rounded-tl-sm bg-white text-[#111]"}`}
                    >
                      {t.text}
                    </motion.p>
                  ))}
                </AnimatePresence>
                {typing && (
                  <p className="flex w-14 gap-1 rounded-xl bg-white px-3 py-3 shadow-sm" aria-label="escribiendo">
                    {[0, 1, 2].map((d) => (
                      <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-[#8696a0]" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }} />
                    ))}
                  </p>
                )}
                {error && <p className="rounded-xl bg-md-err-bg px-3 py-2 text-xs text-md-err-fg">{error}</p>}
              </div>
              <div className="flex gap-1.5 overflow-x-auto px-3 pb-2">
                {QUICK[scenario].map((q) => (
                  <button key={q} onClick={() => send(q)} disabled={typing} className="shrink-0 rounded-full border border-[#0B5C4E]/30 bg-white px-3 py-1 text-xs text-[#0B5C4E] disabled:opacity-50">{q}</button>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); send(draft); }} className="flex gap-2 bg-[#F0F2F5] p-2">
                <input value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={500} placeholder="Escribí un mensaje" aria-label="Mensaje" className="h-10 flex-1 rounded-full bg-white px-4 text-sm text-[#111] outline-none" />
                <button disabled={typing || !draft.trim()} className="grid h-10 w-10 place-items-center rounded-full bg-[#0B5C4E] text-white disabled:opacity-50" aria-label="Enviar">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M2 21 23 12 2 3v7l15 2-15 2z" /></svg>
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <SectionTitle
            eyebrow="IA Bot · WhatsApp Solution Provider oficial"
            title="Un bot que entiende, no un menú de opciones."
            body="Procesamiento de lenguaje natural sobre WhatsApp, Instagram, webchat y mail. Entiende la intención, extrae los datos y resuelve, o deriva con todo el contexto. Escribile como le escribirías a una persona."
          />
          <div className="mt-6 flex flex-wrap gap-2" role="radiogroup" aria-label="Escenario">
            {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
              <button key={id} role="radio" aria-checked={scenario === id} onClick={() => setScenario(id)} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${scenario === id ? "border-md-navy bg-md-navy text-white" : "border-md-line bg-white text-md-ink hover:bg-md-surface2"}`}>
                {SCENARIOS[id].label}
              </button>
            ))}
          </div>

          {/* what the bot understood */}
          <div className="mt-8 rounded-[24px] border border-md-line bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[1.4px] text-md-muted">Lo que entiende el bot</p>
              {last && <span className="font-data text-[11px] text-md-muted">{(last.ms / 1000).toFixed(1)} s</span>}
            </div>
            {!last ? (
              <p className="mt-3 text-sm text-md-muted">Mandá un mensaje y acá vas a ver la intención y los datos que detecta en cada turno.</p>
            ) : (
              <AnimatePresence mode="popLayout">
                <motion.div key={insights.length} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                  <p className="text-xs text-md-muted">Intención</p>
                  <p className="mt-1 inline-block rounded-full bg-md-info-bg px-3 py-1 font-data text-sm text-md-blue">{last.intent}</p>
                  <p className="mt-4 text-xs text-md-muted">Datos extraídos</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {last.entities.length ? last.entities.map((e) => (
                      <span key={e.key} className="rounded-lg bg-md-chip px-2.5 py-1 font-data text-xs text-md-ink">{e.key}: <b>{e.value}</b></span>
                    )) : <span className="text-sm text-md-muted">—</span>}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
            {insights.length > 1 && (
              <ol className="mt-5 flex flex-wrap gap-1.5 border-t border-md-line pt-4" aria-label="Intenciones anteriores">
                {insights.slice(1).map((i, k) => (
                  <li key={k} className="rounded-full bg-md-surface2 px-2.5 py-0.5 font-data text-[11px] text-md-muted">{i.intent}</li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
