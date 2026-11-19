import { useState, type CSSProperties } from "react";
import { Glow, MayaAvatar, PillLink, Reveal, SectionTitle } from "./ui";

// The solutions hub: Mayday in the middle and each product around it. Positions live in the SVG's 1000x560 space so
// lines and cards line up at any width; below md the cards become a plain list under the hub.
const SOLUTIONS = [
  { title: "Omnichannel", body: "Telefonía, CRM y canales digitales en una sola bandeja.", href: "/#omnichannel", x: 170, y: 130, dot: "#04CCDB" },
  { title: "Voicebot", body: "Maya atiende y resuelve, con acento local.", href: "/#voicebot", x: 830, y: 130, dot: "#A9B4FF" },
  { title: "IA Bot", body: "Agentic WhatsApp, web y redes que resuelven solos.", href: "/#iabot", x: 160, y: 420, dot: "#4ade80" },
  { title: "QualityIQ", body: "Auditoría con IA del 100% de las conversaciones.", href: "/#quality", x: 840, y: 420, dot: "#FBBF24" },
  { title: "MIS", body: "Todos tus datos en un tablero, con SAM como analista.", href: "/#mis", x: 500, y: 470, dot: "#F472B6" },
] as const;
const HUB = { x: 500, y: 230 };
const CHANNELS = ["Teléfono", "WhatsApp", "Webchat", "Email", "Redes", "CRM", "Tus APIs"];
const pos = (x: number, y: number) => ({ "--x": `${x / 10}%`, "--y": `${(y / 560) * 100}%` }) as CSSProperties;

export function Solutions() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section id="soluciones" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle
          eyebrow="Hub de soluciones"
          title={<>Un hub de soluciones, todo tu contact center <Glow>conectado</Glow>.</>}
          body="Mayday reúne voz, chats, calidad y datos en un solo lugar. Cada solución funciona sola y, conectadas, comparten el contexto: lo que pasa en un canal lo audita QualityIQ, lo mide MIS y lo resuelve la IA o tu agente."
        />

        <Reveal className="mt-12">
          <div className="relative overflow-hidden rounded-[32px] bg-md-navy p-5 md:aspect-[1000/560] md:p-0">
            <div aria-hidden className="absolute left-1/2 top-[42%] h-[70%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-md-cyan/20 blur-3xl" />

            <svg aria-hidden viewBox="0 0 1000 560" className="absolute inset-0 hidden h-full w-full md:block">
              {[110, 190, 280].map((r) => (
                <ellipse key={r} cx={HUB.x} cy={HUB.y} rx={r * 1.6} ry={r} fill="none" stroke="rgba(169,180,255,0.12)" />
              ))}
              {SOLUTIONS.map((p, i) => (
                <g key={p.title}>
                  <line x1={HUB.x} y1={HUB.y} x2={p.x} y2={p.y} stroke={active === i ? p.dot : "rgba(169,180,255,0.25)"} strokeWidth={active === i ? 2 : 1.2} />
                  {/* data travelling from the hub to each product */}
                  <line x1={HUB.x} y1={HUB.y} x2={p.x} y2={p.y} stroke={p.dot} strokeWidth="2.5" strokeLinecap="round" className="hub-flow" style={{ animationDelay: `${i * -0.4}s` }} />
                </g>
              ))}
            </svg>

            <div
              className="relative mx-auto mb-5 grid h-32 w-32 place-items-center rounded-full border border-md-cyan/40 bg-[#0A0D3F] text-center shadow-[0_0_60px_rgba(4,204,219,0.35)] md:absolute md:left-[var(--x)] md:top-[var(--y)] md:mb-0 md:h-36 md:w-36 md:-translate-x-1/2 md:-translate-y-1/2"
              style={pos(HUB.x, HUB.y)}
            >
              <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-md-cyan/40 [animation-duration:3s] motion-reduce:animate-none" />
              <div>
                <img src="/assets/logo.svg" alt="" className="mx-auto h-8 w-auto" />
                <p className="mt-1 font-display text-xs font-extrabold tracking-[0.18em] text-white">MAYDAY</p>
                <p className="mx-auto max-w-[90px] text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-md-cyan">Hub de soluciones</p>
              </div>
            </div>

            <ul className="relative grid gap-3 md:static">
              {SOLUTIONS.map((p, i) => (
                <li key={p.title} className="md:absolute md:left-[var(--x)] md:top-[var(--y)] md:w-[23%] md:-translate-x-1/2 md:-translate-y-1/2" style={pos(p.x, p.y)}>
                  <a
                    href={p.href}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    className="group flex flex-col rounded-2xl border border-md-dark-line bg-[#0A0D3F]/90 p-4 text-white backdrop-blur transition hover:-translate-y-1 hover:border-md-cyan/60"
                  >
                    <span className="flex items-center gap-2 font-display text-lg font-extrabold">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.dot }} aria-hidden />
                      {p.title}
                    </span>
                    <span className="mt-1 text-[13px] leading-snug text-md-dark-muted">{p.body}</span>
                    <span className="mt-2 text-xs font-semibold text-md-cyan transition group-hover:translate-x-1">Probalo en vivo →</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-md-muted">Se conecta con</span>
          {CHANNELS.map((c) => (
            <span key={c} className="rounded-full border border-md-line bg-md-bg px-3 py-1 text-xs font-medium text-md-ink">{c}</span>
          ))}
        </div>

        {/* people + AI */}
        <Reveal className="mt-16 grid items-center gap-8 md:grid-cols-[1.25fr_1fr] md:gap-12">
          <div className="relative overflow-hidden rounded-[28px] shadow-[0_24px_60px_rgba(1,1,54,0.15)]">
            <img
              src="/assets/personas-ia.webp"
              alt="Una mujer habla por teléfono con una asistente de inteligencia artificial"
              width={1600}
              height={761}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover object-[30%_center] md:aspect-[16/10]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-md-navy/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 py-1.5 pl-1.5 pr-3 shadow backdrop-blur">
              <MayaAvatar className="h-7 w-7" />
              <span className="text-xs font-semibold text-md-ink">Maya está atendiendo · 00:42</span>
            </div>
          </div>
          <div>
            <h3 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-md-ink md:text-4xl">Personas e IA, en el mismo equipo.</h3>
            <p className="mt-4 leading-relaxed text-md-muted">
              La IA atiende lo repetitivo a cualquier hora y tus agentes se quedan con lo que necesita una persona. En cada derivación, el hub
              les pasa la conversación completa: nadie le vuelve a preguntar nada al cliente.
            </p>
            <div className="mt-6">
              <PillLink href="/#voicebot">Hablar con Maya</PillLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
