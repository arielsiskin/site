import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { INSULT } from "@/lib/insults";
import { Aurora, SectionTitle } from "./ui";

// Simulated agent desktop: contacts from every channel land in one inbox, get routed by skill, and the customer
// card shows their history across channels. Everything is local state: no API, no cost.
type Channel = "whatsapp" | "voz" | "email" | "instagram" | "web";
const CH: Record<Channel, { label: string; color: string; short: string }> = {
  whatsapp: { label: "WhatsApp", color: "#1FA971", short: "WA" },
  voz: { label: "Llamada", color: "#2A449E", short: "☎" },
  email: { label: "Email", color: "#C4731C", short: "@" },
  instagram: { label: "Instagram", color: "#A966C4", short: "IG" },
  web: { label: "Webchat", color: "#0896A4", short: "W" },
};
type Msg = { from: "cliente" | "agente"; text: string };
type Conv = { id: number; customer: string; channel: Channel; skill: string; agent: string; msgs: Msg[]; at: string; unread: boolean };
type Customer = { plan: string; since: string; value: string; history: { channel: Channel; when: string; text: string }[] };

const CUSTOMERS: Record<string, Customer> = {
  "Laura Gómez": { plan: "Fibra 500 + TV", since: "2019", value: "Alto", history: [{ channel: "voz", when: "hace 3 días", text: "Reclamo por doble débito · resuelto" }, { channel: "email", when: "hace 2 meses", text: "Pidió factura A" }] },
  "Martín Ruiz": { plan: "Móvil Pro", since: "2022", value: "Medio", history: [{ channel: "web", when: "ayer", text: "Consultó portabilidad" }] },
  "Sofía Herrera": { plan: "Fibra 300", since: "2021", value: "Alto", history: [{ channel: "instagram", when: "hace 1 semana", text: "Elogió la atención técnica" }, { channel: "voz", when: "hace 1 mes", text: "Visita técnica agendada" }] },
  "Diego Pereyra": { plan: "Prospecto", since: "—", value: "Nuevo", history: [] },
  "Valentina Sosa": { plan: "Móvil Básico", since: "2020", value: "Medio", history: [{ channel: "whatsapp", when: "hace 5 días", text: "Recargó saldo con el bot" }] },
  "Carlos Méndez": { plan: "Fibra 1000", since: "2018", value: "Alto", history: [{ channel: "email", when: "hace 2 semanas", text: "Aviso de corte programado" }] },
};

const POOL: Record<Channel, Omit<Conv, "id" | "at" | "unread" | "agent">[]> = {
  whatsapp: [
    { customer: "Valentina Sosa", channel: "whatsapp", skill: "Ventas", msgs: [{ from: "cliente", text: "Hola! Quiero pasarme al plan con más gigas 🙌" }] },
    { customer: "Martín Ruiz", channel: "whatsapp", skill: "Ventas", msgs: [{ from: "cliente", text: "Sigo con lo de la portabilidad, ¿qué necesito?" }] },
  ],
  voz: [
    { customer: "Laura Gómez", channel: "voz", skill: "Facturación", msgs: [{ from: "cliente", text: "(llamada) Quería confirmar que me llegó el reintegro." }] },
    { customer: "Carlos Méndez", channel: "voz", skill: "Soporte técnico", msgs: [{ from: "cliente", text: "(llamada) Se me cortó internet hace una hora." }] },
  ],
  email: [{ customer: "Carlos Méndez", channel: "email", skill: "Facturación", msgs: [{ from: "cliente", text: "Asunto: Factura de octubre. Adjunto comprobante de pago." }] }],
  instagram: [{ customer: "Diego Pereyra", channel: "instagram", skill: "Ventas", msgs: [{ from: "cliente", text: "Vi su publicidad, ¿llegan con fibra a Palermo?" }] }],
  web: [{ customer: "Sofía Herrera", channel: "web", skill: "Soporte técnico", msgs: [{ from: "cliente", text: "El módem tiene una luz roja titilando." }] }],
};
const AGENTS: Record<string, string> = { Ventas: "Lucía", Facturación: "Tomás", "Soporte técnico": "Ana" };
const QUICK = ["Ya lo reviso, dame un minuto 🙂", "Te comparto el detalle por este canal.", "¿Me confirmás tu DNI?"];

const Badge = ({ ch, size = 28 }: { ch: Channel; size?: number }) => (
  <span className="grid shrink-0 place-items-center rounded-full text-[11px] font-bold text-white" style={{ background: CH[ch].color, width: size, height: size }} aria-label={CH[ch].label}>
    {CH[ch].short}
  </span>
);
const now = () => new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

const SEED: Conv[] = [
  { id: 1, customer: "Sofía Herrera", channel: "whatsapp", skill: "Soporte técnico", agent: "Ana", at: "10:42", unread: false, msgs: [{ from: "cliente", text: "Hola, no me anda el wifi en el cuarto 😕" }, { from: "agente", text: "Hola Sofía, ¿probaste reiniciar el módem?" }] },
  { id: 2, customer: "Laura Gómez", channel: "email", skill: "Facturación", agent: "Tomás", at: "10:35", unread: false, msgs: [{ from: "cliente", text: "Asunto: Doble débito. Me cobraron dos veces este mes." }] },
];

export function OmniDemo() {
  const [convs, setConvs] = useState<Conv[]>(SEED);
  const [sel, setSel] = useState(1);
  const [draft, setDraft] = useState("");
  const [counter, setCounter] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const conv = convs.find((c) => c.id === sel) ?? convs[0];
  const cust = CUSTOMERS[conv.customer];

  function incoming(ch: Channel) {
    const pool = POOL[ch];
    const t = pool[counter % pool.length];
    const id = Date.now();
    setCounter((n) => n + 1);
    setConvs((cs) => [{ ...t, id, at: now(), unread: true, agent: AGENTS[t.skill] }, ...cs].slice(0, 7));
  }

  function open(id: number) {
    setSel(id);
    setBlocked(false);
    setConvs((cs) => cs.map((c) => (c.id === id ? { ...c, unread: false } : c)));
  }

  function reply(text: string) {
    if (!text.trim()) return;
    // The agent cannot send an insult: the message stays in the box so they can rewrite it.
    if (INSULT.test(text)) return setBlocked(true);
    setBlocked(false);
    const id = conv.id;
    const add = (m: Msg) => setConvs((cs) => cs.map((c) => (c.id === id ? { ...c, msgs: [...c.msgs, m] } : c)));
    add({ from: "agente", text });
    setDraft("");
    setTimeout(() => add({ from: "cliente", text: "¡Genial, gracias! 👌" }), 1400);
  }

  const counts = (Object.keys(CH) as Channel[]).map((ch) => [ch, convs.filter((c) => c.channel === ch).length] as const);

  return (
    <section id="omnichannel" className="relative bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <SectionTitle
            eyebrow="Omnichannel"
            title="Todos los canales. Una sola pantalla."
            body="Central telefónica web, WhatsApp, email, redes y webchat en el mismo escritorio, con ruteo por habilidad y la historia completa del cliente. Probalo: simulá contactos entrantes."
          />
          <div className="flex flex-wrap gap-2" aria-label="Simular contacto entrante">
            {(Object.keys(CH) as Channel[]).map((ch) => (
              <button key={ch} onClick={() => incoming(ch)} className="inline-flex items-center gap-2 rounded-full border border-md-line bg-white py-1.5 pl-1.5 pr-3 text-sm font-medium text-md-ink transition hover:border-md-blue hover:bg-md-surface2">
                <Badge ch={ch} size={24} /> + {CH[ch].label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-[32px] bg-md-sky p-3 md:p-6">
          <Aurora className="opacity-80" />
          <div className="relative grid overflow-hidden rounded-[24px] border border-md-line bg-white shadow-[0_24px_60px_rgba(1,1,54,0.15)] md:h-[520px] md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr_260px]">
            {/* inbox */}
            <div className="border-b border-md-line bg-md-surface2 md:border-b-0 md:border-r">
              <div className="flex items-center justify-between px-4 py-3">
                <p className="text-sm font-bold text-md-ink">Bandeja unificada</p>
                <span className="rounded-full bg-md-info-bg px-2 py-0.5 font-data text-[11px] text-md-blue">{convs.length} abiertas</span>
              </div>
              <ul className="max-h-60 overflow-y-auto md:max-h-[460px]">
                <AnimatePresence initial={false}>
                  {convs.map((c) => (
                    <motion.li key={c.id} layout initial={{ opacity: 0, x: -20, backgroundColor: "#E8ECFA" }} animate={{ opacity: 1, x: 0, backgroundColor: "rgba(0,0,0,0)" }} transition={{ duration: 0.5 }}>
                      <button onClick={() => open(c.id)} className={`flex w-full gap-3 border-l-[3px] px-4 py-3 text-left transition ${c.id === conv.id ? "border-md-blue bg-white" : "border-transparent hover:bg-white/70"}`}>
                        <Badge ch={c.channel} />
                        <span className="min-w-0 flex-1">
                          <span className="flex justify-between gap-2">
                            <span className={`truncate text-sm ${c.unread ? "font-bold text-md-ink" : "font-medium text-md-ink"}`}>{c.customer}</span>
                            <span className="font-data text-[10px] text-md-muted">{c.at}</span>
                          </span>
                          <span className="block truncate text-xs text-md-muted">{c.msgs[c.msgs.length - 1].text}</span>
                          <span className="mt-1 block text-[10px] text-md-muted">
                            {c.skill} → <b className="text-md-ink">{c.agent}</b>
                          </span>
                        </span>
                        {c.unread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-md-blue" aria-label="sin leer" />}
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>

            {/* conversation */}
            <div className="flex min-h-[380px] flex-col">
              <div className="flex items-center gap-3 border-b border-md-line px-5 py-3">
                <Badge ch={conv.channel} />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-md-ink">{conv.customer}</p>
                  <p className="text-xs text-md-muted">
                    {conv.channel === "voz" ? "Llamada en curso · grabando para QualityIQ" : `${CH[conv.channel].label} · ruteado a ${conv.agent} (${conv.skill})`}
                  </p>
                </div>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto bg-md-bg/50 px-5 py-4">
                {conv.msgs.map((m, i) => (
                  <motion.p key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`max-w-[80%] rounded-2xl px-3 py-2 text-[13px] ${m.from === "agente" ? "ml-auto bg-md-navy text-white" : "bg-white text-md-ink shadow-[0_1px_3px_rgba(1,1,54,0.08)]"}`}>
                    {m.text}
                  </motion.p>
                ))}
              </div>
              <div className="border-t border-md-line p-3">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {QUICK.map((q) => (
                    <button key={q} onClick={() => reply(q)} className="rounded-full bg-md-chip px-3 py-1 text-xs text-md-ink hover:bg-[#E0E5F4]">{q}</button>
                  ))}
                </div>
                {blocked && (
                  <p role="alert" className="mb-2 flex items-center gap-2 rounded-xl border border-[#E7B3B9] bg-[#FBE7E9] px-3 py-2 text-xs text-[#A32634]">
                    <span className="rounded-full bg-[#C4303F] px-2 py-0.5 text-[10px] font-bold uppercase text-white">Alerta</span>
                    Insulto detectado: el mensaje no va a ser enviado.
                  </p>
                )}
                <form onSubmit={(e) => { e.preventDefault(); reply(draft); }} className="flex gap-2">
                  <input value={draft} onChange={(e) => { setDraft(e.target.value); setBlocked(false); }} placeholder={`Responder por ${CH[conv.channel].label}…`} aria-label="Respuesta" className="h-10 flex-1 rounded-full border border-md-line px-4 text-sm outline-none focus:border-md-blue" />
                  <button className="h-10 rounded-full bg-md-blue px-4 text-sm font-semibold text-white hover:bg-md-indigo">Enviar</button>
                </form>
              </div>
            </div>

            {/* customer 360 */}
            <aside className="hidden border-l border-md-line p-5 lg:block">
              <p className="text-[11px] font-bold uppercase tracking-[1.4px] text-md-muted">Cliente 360</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-md-blue to-md-indigo font-bold text-white">{conv.customer.split(" ").map((w) => w[0]).join("")}</span>
                <div>
                  <p className="font-semibold text-md-ink">{conv.customer}</p>
                  <p className="text-xs text-md-muted">Cliente desde {cust.since}</p>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-md-surface2 p-2"><dt className="text-md-muted">Plan</dt><dd className="font-semibold text-md-ink">{cust.plan}</dd></div>
                <div className="rounded-xl bg-md-surface2 p-2"><dt className="text-md-muted">Valor</dt><dd className="font-semibold text-md-ink">{cust.value}</dd></div>
              </dl>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[1.4px] text-md-muted">Historial en todos los canales</p>
              <ol className="mt-3 space-y-3">
                {cust.history.length === 0 && <li className="text-xs text-md-muted">Primer contacto: se crea el lead en el CRM.</li>}
                {cust.history.map((h, i) => (
                  <li key={i} className="flex gap-2 text-xs">
                    <Badge ch={h.channel} size={20} />
                    <span><span className="text-md-ink">{h.text}</span><br /><span className="text-md-muted">{h.when}</span></span>
                  </li>
                ))}
              </ol>
            </aside>
          </div>

          <div className="relative mt-4 flex flex-wrap gap-2">
            {counts.map(([ch, n]) => (
              <span key={ch} className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs text-md-ink backdrop-blur">
                <span className="h-2 w-2 rounded-full" style={{ background: CH[ch].color }} />
                {CH[ch].label} <b className="font-data">{n}</b>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
