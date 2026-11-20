import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

// The technology hub, after bestwebsitetemplate.com: real screens of each demo on a curved carousel, then (pinned) the
// screens and one round sticker per vertical float up past the centred headline as you scroll. Screens are 2x webp shown
// at or below native size, full bleed (no frame), so they stay sharp. One rAF loop, only while on screen; with reduced
// motion everything renders still.

const SCREENS = [
  { label: "Voicebot", href: "/#voicebot", src: "/assets/hub/voice.webp" },
  { label: "QualityIQ", href: "/#quality", src: "/assets/hub/quality.webp" },
  { label: "Agentic WhatsApp", href: "/#iabot", src: "/assets/hub/whatsapp.webp", tall: true },
  { label: "MIS + SAM", href: "/#mis", src: "/assets/hub/mis.webp" },
  { label: "Omnichannel", href: "/#omnichannel", src: "/assets/hub/omni.webp" },
  { label: "Coaching", href: "/#quality", src: "/assets/hub/coaching.webp" },
];

/** Lucide-style stroke icons (ISC), inline so the site needs no icon package. */
const I = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full" aria-hidden>
    {children}
  </svg>
);

const STICKERS = [
  { label: "Telefonía", href: "/#omnichannel", bg: "#04CCDB", fg: "#010136", icon: <I><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></I> },
  { label: "IA Bot", href: "/#iabot", bg: "#010136", fg: "#FFFFFF", icon: <I><path d="M12 8V4H8" /><rect x="4" y="8" width="16" height="12" rx="2" /><path d="M2 14h2M20 14h2M15 13v2M9 13v2" /></I> },
  { label: "SAM analista IA", href: "/#mis", bg: "#FBBF24", fg: "#010136", icon: <I><path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96l-6.14 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z" /></I> },
  { label: "Webchat", href: "/#iabot", bg: "#2E4BB0", fg: "#FFFFFF", icon: <I><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></I> },
  { label: "CRM", href: "/#omnichannel", bg: "#F472B6", fg: "#010136", icon: <I><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0" /></I> },
  { label: "Email", href: "/#omnichannel", bg: "#4ADE80", fg: "#010136", icon: <I><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></I> },
];

type Dims = { w: number; h: number };
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const r = (x: number) => Math.round(x * 100) / 100; // same numbers on server and client (no hydration mismatch)
const screenW = (d: Dims, tall?: boolean) => (d.w < 768 ? (tall ? 120 : 200) : tall ? 210 : 360);

/** A real screen of a demo: full bleed, rounded, with its name. */
function Screen({ s, w, refCb, style }: { s: (typeof SCREENS)[number]; w: number; refCb?: (el: HTMLAnchorElement | null) => void; style?: CSSProperties }) {
  return (
    <a ref={refCb} href={s.href} aria-label={`${s.label}: ver la demo`} className="group absolute left-1/2 top-1/2 block" style={{ width: w, marginLeft: -w / 2, ...style }}>
      <img
        src={s.src}
        alt=""
        draggable={false}
        className={`block w-full rounded-2xl object-cover object-top shadow-[0_28px_60px_-18px_rgba(1,1,54,0.45)] transition group-hover:-translate-y-1 ${s.tall ? "aspect-[2/3]" : "aspect-[16/10]"}`}
      />
      <span className="mt-2 inline-block rounded-full bg-md-navy px-2.5 py-0.5 text-[11px] font-semibold text-white">{s.label}</span>
    </a>
  );
}

/** Round sticker: the vertical's name running around the edge (slowly spinning), its icon in the middle. */
function Sticker({ k, size, refCb, style }: { k: (typeof STICKERS)[number]; size: number; refCb: (el: HTMLAnchorElement | null) => void; style?: CSSProperties }) {
  const text = `${k.label} • ${k.label} • `.toUpperCase();
  return (
    <a ref={refCb} href={k.href} aria-label={`${k.label}: ver la demo`} className="absolute left-1/2 top-1/2 block" style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, ...style }}>
      <span className="relative grid h-full w-full place-items-center rounded-full shadow-[0_20px_40px_-14px_rgba(1,1,54,0.45)]" style={{ background: k.bg, color: k.fg }}>
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[spin_14s_linear_infinite] motion-reduce:animate-none" aria-hidden>
          <defs>
            <path id={`ring-${k.label}`} d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
          </defs>
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.8" />
          <text fill="currentColor" fontSize="9.5" fontWeight="700" letterSpacing="2.2" className="font-data">
            <textPath href={`#ring-${k.label}`} textLength="228">{text}</textPath>
          </text>
        </svg>
        <span className="h-[30%] w-[30%]">{k.icon}</span>
      </span>
    </a>
  );
}

// Curved carousel: 12 slots on a cylinder (each screen twice), turning with time and scroll.
const RING = [...SCREENS, ...SCREENS];
function ringPlace(i: number, turn: number, d: Dims) {
  const step = (Math.PI * 2) / RING.length;
  const w = screenW(d);
  const R = (w + (d.w < 768 ? 18 : 30)) / step;
  let a = i * step - turn;
  a = Math.atan2(Math.sin(a), Math.cos(a)); // wrap to -π..π
  const front = Math.cos(a);
  return {
    transform: `translate3d(${r(R * Math.sin(a))}px, -50%, ${r(R * front - R)}px) rotateY(${r(a)}rad)`,
    opacity: r(clamp(front * 2.2 - 0.3)),
  };
}

// Floating phase: every item rises from below the screen to above it, staggered, in lanes beside the headline.
// Listed in the order they rise; sides alternate so there is always something on both sides of the text.
const ITEMS = (
  [
    ["screen", 0, -0.32], ["sticker", 0, 0.38], ["screen", 3, 0.32], ["sticker", 1, -0.4],
    ["screen", 1, -0.3], ["sticker", 2, 0.26], ["screen", 2, 0.36], ["sticker", 3, -0.26],
    ["screen", 4, -0.34], ["sticker", 4, 0.4], ["screen", 5, 0.31], ["sticker", 5, -0.42],
  ] as const
).map(([kind, i, lane], n) => ({ kind, i, lane, start: -0.4 + n * 0.115 }));
function floatPlace(n: number, q: number, s: number, d: Dims) {
  const it = ITEMS[n];
  const mobile = d.w < 768;
  const u = (q - it.start) / 0.56; // 0 = just below the screen, 1 = just above it
  const y = (0.5 - u) * (d.h + 420);
  const x = it.lane * d.w * (mobile ? 0.95 : 1) + Math.sin(s * 0.6 + n) * 6;
  const tilt = Math.sin(n * 2.7) * 5 + Math.sin(s * 0.5 + n) * 1.5;
  return `translate3d(${r(x)}px, ${r(y)}px, 0) rotate(${r(tilt)}deg)`;
}

export function Solutions() {
  const [dims, setDims] = useState<Dims>({ w: 1366, h: 800 });
  const [still, setStill] = useState(false);
  const intro = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const ring = useRef<(HTMLAnchorElement | null)[]>([]);
  const floats = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const read = () => setDims({ w: innerWidth, h: innerHeight });
    read();
    setStill(matchMedia("(prefers-reduced-motion: reduce)").matches);
    addEventListener("resize", read);
    return () => removeEventListener("resize", read);
  }, []);

  useEffect(() => {
    const frame = (turn: number, q: number, s: number) => {
      ring.current.forEach((el, i) => {
        if (!el) return;
        const p = ringPlace(i, turn, dims);
        el.style.transform = p.transform;
        el.style.opacity = String(p.opacity);
        el.style.pointerEvents = p.opacity > 0.6 ? "auto" : "none";
      });
      floats.current.forEach((el, n) => {
        if (el) el.style.transform = floatPlace(n, q, s, dims);
      });
    };
    if (still) return frame(0, 0.35, 0);

    let raf = 0;
    let visible = 0;
    const t0 = performance.now();
    const loop = () => {
      const s = (performance.now() - t0) / 1000;
      const a = intro.current?.getBoundingClientRect();
      const b = pin.current?.getBoundingClientRect();
      const turn = s * 0.08 + (a ? -a.top / 900 : 0);
      const q = b ? -b.top / Math.max(1, b.height - innerHeight) : 0;
      frame(turn, q, s);
      if (visible > 0) raf = requestAnimationFrame(loop);
    };
    // Only animate while some part of the hub is on screen.
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (visible += e.isIntersecting ? 1 : -1));
      visible = Math.max(0, visible);
      cancelAnimationFrame(raf);
      if (visible > 0) raf = requestAnimationFrame(loop);
    });
    [intro.current, pin.current].forEach((el) => el && io.observe(el));
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [dims, still]);

  const mobile = dims.w < 768;
  const sticker = mobile ? 92 : 150;
  return (
    <section id="soluciones" className="relative overflow-x-clip bg-white">
      {/* part 1: headline + curved carousel of real screens */}
      <div ref={intro} className="mx-auto max-w-6xl px-4 pt-24 text-center md:pt-32">
        <p className="text-[13px] font-medium text-md-muted">Hub de soluciones con IA</p>
        <h2 className="mx-auto mt-3 max-w-3xl font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-md-ink md:text-7xl">
          Un hub. Todo tu contact center.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-md-muted md:text-lg">
          Voz, chats, calidad y datos en un solo lugar. Cada solución funciona sola y, conectadas, comparten el contexto de cada cliente.
        </p>
      </div>
      <div className="relative mt-10 [perspective:1400px] md:mt-12" style={{ height: screenW(dims) * 0.62 + 90 }}>
        <div className="absolute inset-0 [transform-style:preserve-3d] [transform:rotateX(-6deg)]">
          {RING.map((s, i) => (
            <Screen key={i} s={{ ...s, tall: false }} w={screenW(dims)} refCb={(el) => (ring.current[i] = el)} style={ringPlace(i, 0, dims)} />
          ))}
        </div>
      </div>

      {/* part 2 (pinned): screens and stickers float up past the headline */}
      <div ref={pin} className={still ? "relative" : "relative h-[270vh]"}>
        <div className={`${still ? "relative" : "sticky top-0"} h-[100svh] min-h-[600px] overflow-hidden [mask-image:linear-gradient(transparent,#000_7%,#000_93%,transparent)]`}>
          {ITEMS.map((it, n) =>
            it.kind === "screen" ? (
              <Screen key={n} s={SCREENS[it.i]} w={screenW(dims, SCREENS[it.i].tall)} refCb={(el) => (floats.current[n] = el)} style={{ transform: floatPlace(n, still ? 0.35 : 0, 0, dims) }} />
            ) : (
              <Sticker key={n} k={STICKERS[it.i]} size={sticker} refCb={(el) => (floats.current[n] = el)} style={{ transform: floatPlace(n, still ? 0.35 : 0, 0, dims) }} />
            ),
          )}
          <div className="pointer-events-none absolute inset-0 grid place-items-center px-6 text-center">
            {/* soft white halo so the text stays readable when something floats behind it (mostly on mobile) */}
            <div className="pointer-events-auto relative max-w-[320px] px-6 py-12 [background:radial-gradient(closest-side,#fff_72%,rgba(255,255,255,0))] md:max-w-[440px] md:[background:none]">
              <p className="inline-block rounded-full border border-md-line px-3 py-1 font-data text-[11px] uppercase tracking-wider text-md-muted">12 soluciones · 1 hub</p>
              <h3 className="mt-4 font-display text-3xl font-extrabold leading-[1.02] tracking-tight text-md-ink md:text-5xl">
                Conectadas.
                <br />
                Probalas en vivo.
              </h3>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-md-muted md:text-base">
                Lo que pasa en un canal lo audita QualityIQ, lo mide MIS y lo resuelve la IA o tu agente. Tocá una pantalla para ver su demo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
