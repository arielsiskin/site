import { forwardRef, useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { AnimatedBeam } from "./AnimatedBeam";
import { Glow, MayaAvatar, PillLink, Reveal, SectionTitle } from "./ui";


// The solutions hub (Magic UI patterns: Ripple, Orbiting Circles, Magic Card, Animated Beam): customer channels orbit the
// Mayday hub and beams feed each solution card. Beams follow real element positions, so the layout is plain CSS grid.

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
  { title: "Voicebot", body: "Maya atiende y resuelve por teléfono, con acento local.", stat: "< 1 s por turno", href: "/#voicebot", icon: ICONS.mic, color: "#A78BFA" },
  { title: "IA Bot", body: "Agentic WhatsApp, webchat y redes que entienden y resuelven.", stat: "24/7", href: "/#iabot", icon: ICONS.bot, color: "#4ADE80" },
  { title: "Omnichannel", body: "Todos los canales y el CRM en una sola bandeja para tus agentes.", stat: "1 bandeja", href: "/#omnichannel", icon: ICONS.inbox, color: "#04CCDB" },
  { title: "QualityIQ", body: "Audita cada conversación con IA y arma el coaching de cada agente.", stat: "100% auditado", href: "/#quality", icon: ICONS.shield, color: "#FBBF24" },
  { title: "MIS", body: "Todos tus datos en un tablero, con SAM como analista.", stat: "SAM analista IA", href: "/#mis", icon: ICONS.chart, color: "#F472B6" },
];

function useRefs(n: number) {
  // Fixed-length list of refs; the hooks run in the same order on every render.
  return Array.from({ length: n }, () => useRef<HTMLAnchorElement>(null)) as RefObject<HTMLAnchorElement>[];
}

/** Magic UI "Magic Card": a glass card whose border and surface light up where the pointer is. */
const SolutionCard = forwardRef<HTMLAnchorElement, (typeof SOLUTIONS)[number]>(({ title, body, stat, href, icon, color }, ref) => (
  <a
    ref={ref}
    href={href}
    onPointerMove={(e) => {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
      e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
    }}
    style={{ "--c": color } as CSSProperties}
    className="magic-card group relative z-10 block rounded-2xl p-px transition duration-300 hover:-translate-y-1"
  >
    <div className="relative h-full overflow-hidden rounded-[15px] bg-[#0A0D3F] p-5">
      <div aria-hidden className="magic-card-glow pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="relative flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl p-2.5" style={{ background: `${color}22`, color }}>
          {icon}
        </span>
        <div className="min-w-0">
          <p className="font-display text-lg font-extrabold text-white">{title}</p>
          <p className="mt-1 text-[13px] leading-snug text-md-dark-muted">{body}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-data text-[11px] text-white/80">
            <span className="size-1.5 rounded-full" style={{ background: color }} aria-hidden />
            {stat}
          </p>
        </div>
      </div>
      <span aria-hidden className="absolute right-4 top-4 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-white">→</span>
    </div>
  </a>
));

/** The hub: ripple rings, a spinning light border, and the customer channels orbiting it (Magic UI Ripple + Orbiting Circles). */
const Hub = forwardRef<HTMLDivElement>((_, ref) => (
  <div className="relative mx-auto grid size-[300px] place-items-center md:size-[340px]">
    {[0, 1, 2].map((i) => (
      <span key={i} aria-hidden className="hub-ripple absolute rounded-full border border-md-cyan/20 bg-md-cyan/[0.03]" style={{ width: 150 + i * 75, height: 150 + i * 75, animationDelay: `${i * 0.4}s` }} />
    ))}
    <svg aria-hidden className="pointer-events-none absolute inset-0 size-full">
      <circle cx="50%" cy="50%" r="120" fill="none" stroke="rgba(169,180,255,0.18)" strokeDasharray="2 6" />
    </svg>
    {CHANNELS.map((c, i) => (
      <div
        key={c.label}
        title={c.label}
        className="hub-orbit absolute grid size-10 place-items-center rounded-full border border-white/15 bg-[#13163F] p-2.5 text-white shadow-[0_0_20px_rgba(4,204,219,0.25)]"
        style={{ "--angle": (360 / CHANNELS.length) * i, "--radius": 120 } as CSSProperties}
      >
        {c.icon}
        <span className="sr-only">{c.label}</span>
      </div>
    ))}
    <div ref={ref} className="hub-core relative z-10 grid size-32 place-items-center rounded-full p-[2px]">
      <div className="grid size-full place-items-center rounded-full bg-md-navy text-center">
        <div>
          <img src="/assets/logo.svg" alt="" className="mx-auto h-9 w-auto" />
          <p className="mt-1 font-display text-[11px] font-extrabold tracking-[0.18em] text-white">MAYDAY</p>
          <p className="mx-auto max-w-[90px] text-[9px] font-semibold uppercase leading-tight tracking-[0.12em] text-md-cyan">Hub de soluciones</p>
        </div>
      </div>
    </div>
  </div>
));

function HubDiagram() {
  const box = useRef<HTMLDivElement>(null);
  const hub = useRef<HTMLDivElement>(null);
  const outs = useRefs(SOLUTIONS.length);
  const card = (i: number) => <SolutionCard key={SOLUTIONS[i].title} ref={outs[i]} {...SOLUTIONS[i]} />;
  return (
    <div ref={box} className="hub-panel relative overflow-hidden rounded-[32px] bg-md-navy px-4 py-10 md:px-10 md:py-14">
      <div className="relative grid items-center gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-x-10 md:gap-y-8">
        <div className="order-2 grid gap-4 md:order-none md:gap-8">{[0, 1].map(card)}</div>
        <div className="order-1 md:order-none">
          <Hub ref={hub} />
          <p className="mt-1 text-center text-xs text-md-dark-muted">Teléfono · WhatsApp · Webchat · Email · Redes</p>
        </div>
        <div className="order-3 grid gap-4 md:order-none md:gap-8">{[2, 3].map(card)}</div>
        <div className="order-4 md:col-span-3 md:mx-auto md:w-[380px]">{card(4)}</div>
      </div>
      {outs.map((r, i) => (
        <AnimatedBeam
          key={i}
          className="hidden md:block"
          containerRef={box}
          fromRef={hub}
          toRef={r}
          curvature={[40, -40, 40, -40, 0][i]}
          duration={3}
          delay={i * 0.35}
          pathColor="#A9B4FF"
          pathOpacity={0.15}
          gradientStartColor="#04CCDB"
          gradientStopColor={SOLUTIONS[i].color}
        />
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
