import { forwardRef, useEffect, useRef, type ReactNode, type RefObject } from "react";
import { AnimatedBeam } from "./AnimatedBeam";
import { Glow, MayaAvatar, PillLink, Reveal, SectionTitle } from "./ui";


// The solutions hub, drawn like Magic UI's "animated beam, multiple outputs": customer channels flow into the Mayday
// hub, and the hub feeds every solution. Beams follow the real element positions, so the layout can be plain flexbox.

/** Lucide-style stroke icons (ISC), inline so the site needs no icon package. */
const I = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full" aria-hidden>
    {children}
  </svg>
);
const ICONS = {
  phone: <I><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></I>,
  whatsapp: <img src="/assets/ia-bot/whatsapp.svg" alt="" className="h-full w-full" />,
  web: <I><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></I>,
  mail: <I><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></I>,
  social: <I><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" /></I>,
  mic: <I><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" /></I>,
  bot: <I><path d="M12 8V4H8" /><rect x="4" y="8" width="16" height="12" rx="2" /><path d="M2 14h2M20 14h2M15 13v2M9 13v2" /></I>,
  inbox: <I><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></I>,
  shield: <I><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></I>,
  chart: <I><path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3" /></I>,
};

const CHANNELS = [
  { label: "Teléfono", icon: ICONS.phone },
  { label: "WhatsApp", icon: ICONS.whatsapp },
  { label: "Webchat", icon: ICONS.web },
  { label: "Email", icon: ICONS.mail },
  { label: "Redes", icon: ICONS.social },
];
const SOLUTIONS = [
  { title: "Voicebot", body: "Maya atiende con acento local", href: "/#voicebot", icon: ICONS.mic, color: "#7A5CFF" },
  { title: "IA Bot", body: "Agentic WhatsApp que resuelve", href: "/#iabot", icon: ICONS.bot, color: "#16a34a" },
  { title: "Omnichannel", body: "Todos los canales, una bandeja", href: "/#omnichannel", icon: ICONS.inbox, color: "#04CCDB" },
  { title: "QualityIQ", body: "Audita el 100% con IA", href: "/#quality", icon: ICONS.shield, color: "#F59E0B" },
  { title: "MIS", body: "Tus datos, con SAM como analista", href: "/#mis", icon: ICONS.chart, color: "#E1306C" },
];
// Gentle fan: outer rows bend more, so beams don't overlap near the hub.
const CURVE = [-60, -25, 0, 25, 60];

const Node = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(({ children, className = "" }, ref) => (
  <div ref={ref} className={`z-10 grid size-11 shrink-0 place-items-center rounded-full border border-md-line bg-white p-2.5 text-md-navy shadow-[0_0_20px_-10px_rgba(1,1,54,0.5)] md:size-14 md:p-3.5 ${className}`}>
    {children}
  </div>
));

function useRefs(n: number) {
  // Fixed-length list of refs; the hooks run in the same order on every render.
  return Array.from({ length: n }, () => useRef<HTMLDivElement>(null)) as RefObject<HTMLDivElement>[];
}

function HubDiagram() {
  const box = useRef<HTMLDivElement>(null);
  const hub = useRef<HTMLDivElement>(null);
  const ins = useRefs(CHANNELS.length);
  const outs = useRefs(SOLUTIONS.length);
  return (
    <div
      ref={box}
      className="relative flex items-center justify-between gap-3 overflow-hidden rounded-[32px] border border-md-line bg-md-bg px-4 py-8 md:px-14 md:py-12 [background-image:radial-gradient(rgba(42,68,158,0.12)_1px,transparent_1px)] [background-size:18px_18px]"
    >
      {/* channels */}
      <div className="flex flex-col gap-4 md:gap-6">
        <p className="text-center text-[10px] font-bold uppercase tracking-[1.4px] text-md-muted md:text-[11px]">Tus clientes</p>
        {CHANNELS.map((c, i) => (
          <div key={c.label} className="flex flex-col items-center gap-1">
            <Node ref={ins[i]}>{c.icon}</Node>
            <span className="text-[10px] font-medium text-md-muted md:text-xs">{c.label}</span>
          </div>
        ))}
      </div>

      {/* hub */}
      <div ref={hub} className="z-10 grid size-24 shrink-0 place-items-center rounded-full border border-md-cyan/40 bg-md-navy text-center shadow-[0_0_50px_-5px_rgba(4,204,219,0.6)] md:size-36">
        <div>
          <img src="/assets/logo.svg" alt="" className="mx-auto h-7 w-auto md:h-10" />
          <p className="mt-1 font-display text-[10px] font-extrabold tracking-[0.18em] text-white md:text-xs">MAYDAY</p>
          <p className="mx-auto max-w-[90px] text-[8px] font-semibold uppercase leading-tight tracking-[0.12em] text-md-cyan md:text-[10px]">Hub de soluciones</p>
        </div>
      </div>

      {/* solutions */}
      <ul className="flex flex-col gap-4 md:gap-5">
        <li className="text-center text-[10px] font-bold uppercase tracking-[1.4px] text-md-muted md:text-left md:text-[11px]">Tus soluciones</li>
        {SOLUTIONS.map((s, i) => (
          <li key={s.title}>
            <a href={s.href} className="group flex flex-col items-center gap-1 md:flex-row md:gap-3">
              <Node ref={outs[i]} className="transition group-hover:scale-110">
                <span style={{ color: s.color }} className="h-full w-full">{s.icon}</span>
              </Node>
              <span className="text-center md:text-left">
                <span className="block text-[10px] font-semibold text-md-ink md:font-display md:text-base md:font-extrabold">{s.title}</span>
                <span className="hidden text-xs text-md-muted md:block md:w-48">{s.body}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      {ins.map((r, i) => (
        <AnimatedBeam key={`in${i}`} containerRef={box} fromRef={r} toRef={hub} curvature={CURVE[i]} duration={3.5} delay={i * 0.25} />
      ))}
      {outs.map((r, i) => (
        <AnimatedBeam key={`out${i}`} containerRef={box} fromRef={hub} toRef={r} curvature={-CURVE[i]} duration={3.5} delay={1.2 + i * 0.25} gradientStartColor="#04CCDB" gradientStopColor={SOLUTIONS[i].color} />
      ))}
    </div>
  );
}

export function Solutions() {
  return (
    <section id="soluciones" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle
          eyebrow="Hub de soluciones"
          title={<>Un hub de soluciones, todo tu contact center <Glow>conectado</Glow>.</>}
          body="Mayday reúne voz, chats, calidad y datos en un solo lugar. Cada solución funciona sola y, conectadas, comparten el contexto: lo que pasa en un canal lo audita QualityIQ, lo mide MIS y lo resuelve la IA o tu agente."
        />

        <Reveal className="mt-12">
          <HubDiagram />
        </Reveal>

      </div>
    </section>
  );
}

/** Full-bleed looping video (Veo-generated, public/assets/equipo-ia.mp4) with the headline on top, Preymaker style. */
export function TeamVideo() {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    // Respect reduced motion: keep the poster frame instead of the loop.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) video.current?.pause();
  }, []);
  return (
    <section className="relative isolate flex min-h-[560px] items-end overflow-hidden bg-md-navy md:min-h-[88vh]">
      <video
        ref={video}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        poster="/assets/equipo-ia.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      >
        <source src="/assets/equipo-ia-sm.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/assets/equipo-ia.mp4" type="video/mp4" />
      </video>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-md-navy via-md-navy/40 to-md-navy/10" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-md-navy/70 to-transparent" />
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 md:pb-24">
        <Reveal className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-1.5 pr-3 backdrop-blur">
            <MayaAvatar className="h-7 w-7" />
            <span className="text-xs font-semibold text-white">Maya y tu equipo, atendiendo juntos</span>
          </div>
          <h2 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-white md:text-7xl">Personas e IA, en el mismo equipo.</h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
            La IA atiende lo repetitivo a cualquier hora y tus agentes se quedan con lo que necesita una persona. En cada derivación, el hub les
            pasa la conversación completa: nadie le vuelve a preguntar nada al cliente.
          </p>
          <div className="mt-8">
            <PillLink href="/#voicebot" variant="light">Hablar con Maya</PillLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
