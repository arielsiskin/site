import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

// The technology hub, after puture.co.kr: glossy 3D tiles (one per Mayday vertical) over a perspective grid. While the
// section is pinned, scrolling turns the spinning carousel into tiles floating around the headline. Pure CSS 3D driven by
// one rAF loop (no WebGL); with reduced motion it renders the final layout, still and unpinned.

/** Lucide-style stroke icons (ISC), inline so the site needs no icon package. */
const I = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full" aria-hidden>
    {children}
  </svg>
);

const TILES = [
  { label: "Voicebot", href: "/#voicebot", icon: <I><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" /></I> },
  { label: "Agentic WhatsApp", href: "/#iabot", icon: <I><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></I> },
  { label: "QualityIQ", href: "/#quality", icon: <I><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></I> },
  { label: "MIS", href: "/#mis", icon: <I><path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3" /></I> },
  { label: "Omnichannel", href: "/#omnichannel", icon: <I><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></I> },
  { label: "SAM · analista IA", href: "/#mis", icon: <I><path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96l-6.14 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z" /></I> },
  { label: "IA Bot", href: "/#iabot", icon: <I><path d="M12 8V4H8" /><rect x="4" y="8" width="16" height="12" rx="2" /><path d="M2 14h2M20 14h2M15 13v2M9 13v2" /></I> },
  { label: "Coaching", href: "/#quality", icon: <I><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c3 3 9 3 12 0v-5M22 10v6" /></I> },
  { label: "Telefonía", href: "/#omnichannel", icon: <I><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></I> },
  { label: "Webchat", href: "/#iabot", icon: <I><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></I> },
  { label: "CRM", href: "/#omnichannel", icon: <I><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0" /></I> },
  { label: "Email", href: "/#omnichannel", icon: <I><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></I> },
];
const N = TILES.length;

type Dims = { w: number; h: number };
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => x * x * (3 - 2 * x);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const r = (x: number) => Math.round(x * 100) / 100;
const tileSize = (d: Dims) => (d.w < 768 ? 60 : 104);

/** Where tile i sits for scroll progress p (0..1) at time s (seconds). */
function place(i: number, p: number, s: number, d: Dims) {
  const mobile = d.w < 768;
  const t = smooth(clamp((p - 0.22) / 0.45));
  // Carousel: a ring spinning around the vertical axis, above the headline.
  const R = mobile ? d.w * 0.62 : Math.min(d.w * 0.4, 600);
  const a = (i / N) * Math.PI * 2 + s * 0.12 + p * 1.6;
  const ring = { x: R * Math.sin(a), y: d.h * (mobile ? -0.16 : -0.13) + Math.sin(i * 1.7) * 14, z: R * Math.cos(a) - R * 0.55, ry: Math.sin(a) * 0.7, rx: -0.12 }; // tiles keep facing the camera, tilted toward the sides
  // Scatter: around the centred headline (desktop: an ellipse; mobile: bands above and below the text).
  let sx: number, sy: number;
  if (mobile) {
    const row = Math.floor(i / 3), col = i % 3;
    sx = (col - 1) * d.w * 0.28 + Math.sin(i * 2.3) * 8;
    sy = [-0.34, -0.215, 0.25, 0.375][row] * d.h;
  } else {
    const f = (i / N) * Math.PI * 2 + 0.26;
    sx = Math.cos(f) * d.w * 0.4;
    sy = Math.sin(f) * d.h * 0.36;
  }
  const scatter = {
    x: sx,
    y: sy + Math.sin(s * 0.9 + i) * 8,
    z: (((i * 37) % 3) - 1) * 80,
    ry: Math.sin(i * 2.1) * 0.32 + Math.sin(s * 0.5 + i) * 0.1,
    rx: Math.cos(i * 1.3) * 0.3,
  };
  const facing = (Math.cos(a) + 1) / 2; // 1 when the ring tile faces the camera
  return {
    // Rounded so server and browser print the same numbers (no hydration mismatch).
    transform: `translate3d(${r(mix(ring.x, scatter.x, t))}px, ${r(mix(ring.y, scatter.y, t))}px, ${r(mix(ring.z, scatter.z, t))}px) rotateY(${r(mix(ring.ry, scatter.ry, t))}rad) rotateX(${r(mix(ring.rx, scatter.rx, t))}rad)`,
    shade: r(mix(0.7 * (1 - facing), 0, t)),
    t,
  };
}

const FACE = "absolute inset-0 rounded-[22%] [backface-visibility:hidden]";
const FRONT: CSSProperties = {
  background: "linear-gradient(150deg, #9BDCFF 0%, #4C8DFF 42%, #2448D8 100%)",
  boxShadow: "inset 0 2px 1px rgba(255,255,255,0.75), inset 0 -12px 24px rgba(8,18,90,0.35), 0 20px 40px rgba(20,60,200,0.35)",
};

/** A glossy block: front, back and four sides, `d` px deep. */
function Tile({ s, d, tile, refCb, initial }: { s: number; d: number; tile: (typeof TILES)[number]; refCb: (el: HTMLAnchorElement | null) => void; initial: ReturnType<typeof place> }) {
  const side = (w: number, h: number, tf: string, bg: string): CSSProperties => ({ width: w, height: h, left: (s - w) / 2, top: (s - h) / 2, transform: tf, background: bg });
  return (
    <a
      ref={refCb}
      href={tile.href}
      aria-label={`${tile.label}: ver la demo`}
      className="group absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
      style={{ width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2, transform: initial.transform, "--shade": initial.shade } as CSSProperties}
    >
      <div className="absolute rounded-[6px]" style={side(d, s * 0.9, `rotateY(90deg) translateZ(${s / 2 - 1}px)`, "#1D3BB5")} />
      <div className="absolute rounded-[6px]" style={side(d, s * 0.9, `rotateY(-90deg) translateZ(${s / 2 - 1}px)`, "#2F5BE6")} />
      <div className="absolute rounded-[6px]" style={side(s * 0.9, d, `rotateX(90deg) translateZ(${s / 2 - 1}px)`, "#7FB6FF")} />
      <div className="absolute rounded-[6px]" style={side(s * 0.9, d, `rotateX(-90deg) translateZ(${s / 2 - 1}px)`, "#172F99")} />
      <div className={FACE} style={{ transform: `rotateY(180deg) translateZ(${d / 2}px)`, background: "linear-gradient(150deg, #3B6EF0, #1A35A8)" }} />
      <div className={`${FACE} grid place-items-center text-white transition group-hover:brightness-110`} style={{ ...FRONT, transform: `translateZ(${d / 2}px)` }}>
        <div className="h-[42%] w-[42%] drop-shadow-[0_2px_4px_rgba(10,20,90,0.35)]">{tile.icon}</div>
        <div aria-hidden className="absolute inset-0 rounded-[22%] bg-[#020318]" style={{ opacity: "var(--shade)" }} />
        <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur md:text-xs">
          {tile.label}
        </span>
      </div>
    </a>
  );
}

// Fixed star field (deterministic, so server and client render the same).
const STARS = Array.from({ length: 46 }, (_, i) => ({ l: (i * 47.3) % 100, t: (i * 29.7) % 100, o: 0.25 + ((i * 13) % 6) / 10 }));

export function Solutions() {
  const [dims, setDims] = useState<Dims>({ w: 1366, h: 800 });
  const [still, setStill] = useState(false);
  const section = useRef<HTMLElement>(null);
  const tiles = useRef<(HTMLAnchorElement | null)[]>([]);
  const grid = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const outro = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const read = () => setDims({ w: innerWidth, h: innerHeight });
    read();
    setStill(matchMedia("(prefers-reduced-motion: reduce)").matches);
    addEventListener("resize", read);
    return () => removeEventListener("resize", read);
  }, []);

  useEffect(() => {
    const frame = (p: number, s: number) => {
      let t = 0;
      tiles.current.forEach((el, i) => {
        if (!el) return;
        const r = place(i, p, s, dims);
        el.style.transform = r.transform;
        el.style.setProperty("--shade", String(r.shade));
        t = r.t;
      });
      if (grid.current) grid.current.style.backgroundPosition = `center ${p * 900}px`;
      if (intro.current) {
        intro.current.style.opacity = String(clamp(1 - t * 2.2));
        intro.current.style.transform = `translateY(${-t * 60}px)`;
        intro.current.style.pointerEvents = t < 0.4 ? "auto" : "none";
      }
      if (outro.current) {
        outro.current.style.opacity = String(clamp((t - 0.55) * 2.4));
        outro.current.style.transform = `translateY(${(1 - t) * 40}px)`;
        outro.current.style.pointerEvents = t > 0.6 ? "auto" : "none";
      }
    };
    if (still) return frame(1, 0);

    let raf = 0;
    let visible = false;
    const t0 = performance.now();
    const loop = () => {
      const el = section.current;
      if (el) {
        const r = el.getBoundingClientRect();
        frame(clamp(-r.top / Math.max(1, r.height - innerHeight)), (performance.now() - t0) / 1000);
      }
      if (visible) raf = requestAnimationFrame(loop);
    };
    // Only animate while the section is on screen.
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    if (section.current) io.observe(section.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [dims, still]);

  const s = tileSize(dims);
  return (
    <section id="soluciones" ref={section} className={`relative bg-[#02031A] ${still ? "" : "h-[320vh]"}`}>
      <div className={`${still ? "relative" : "sticky top-0"} h-[100svh] min-h-[620px] overflow-hidden`}>
        {/* light beam + grid + stars */}
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_90%_at_100%_0%,rgba(47,107,255,0.75),transparent_60%)]" />
        <div aria-hidden className="absolute -right-1/4 -top-1/4 h-[150%] w-[60%] rotate-[25deg] bg-[linear-gradient(90deg,transparent,rgba(64,120,255,0.28),transparent)] blur-2xl" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[75%] [perspective:700px] [mask-image:linear-gradient(to_top,black_30%,transparent)]">
          <div ref={grid} className="hub-grid absolute left-1/2 top-0 h-[220%] w-[320%] origin-top [transform:translateX(-50%)_rotateX(62deg)]" />
        </div>
        {STARS.map((st, i) => (
          <span key={i} aria-hidden className="absolute size-[2px] rounded-full bg-white" style={{ left: `${st.l}%`, top: `${st.t}%`, opacity: st.o }} />
        ))}

        {/* tiles */}
        <div className="absolute inset-0 [perspective:1100px]">
          <div className="absolute inset-0 [transform-style:preserve-3d]">
            {TILES.map((tile, i) => (
              <Tile key={tile.label} s={s} d={s * 0.26} tile={tile} refCb={(el) => (tiles.current[i] = el)} initial={place(i, still ? 1 : 0, 0, dims)} />
            ))}
          </div>
        </div>

        {/* phase 1: headline under the carousel */}
        <div ref={intro} className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-14 md:pb-20" style={{ opacity: still ? 0 : 1 }}>
          <p className="text-[13px] font-medium text-white/70">Hub de soluciones con IA</p>
          <div className="mt-3 grid items-end gap-6 md:grid-cols-[1.3fr_1fr]">
            <h2 className="font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-white md:text-7xl">
              Un hub.
              <br />
              Todo tu contact center.
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-white/70 md:text-base">
              Voz, chats, calidad y datos en un solo lugar. Cada solución funciona sola y, conectadas, comparten el contexto de cada cliente.
            </p>
          </div>
        </div>

        {/* phase 2: centred, tiles around it */}
        <div ref={outro} className="absolute inset-0 grid place-items-center px-6 text-center" style={{ opacity: still ? 1 : 0 }}>
          <div className="max-w-[250px] md:max-w-xl">
            <p className="inline-block rounded-full border border-white/20 px-3 py-1 font-data text-[11px] uppercase tracking-wider text-white/80">{N} soluciones · 1 hub</p>
            <h3 className="mt-4 font-display text-3xl font-extrabold leading-[1.02] tracking-tight text-white md:text-6xl">
              Conectadas.
              <br />
              Probalas en vivo.
            </h3>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/70 md:text-base">
              Lo que pasa en un canal lo audita QualityIQ, lo mide MIS y lo resuelve la IA o tu agente. Tocá una solución para ver su demo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
