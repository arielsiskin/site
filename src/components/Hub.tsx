import { useEffect, useRef, useState, type ReactNode } from "react";

// The solutions hub: one card per solution (colour + icon) on a curved carousel that turns with time and scroll.
// Each card jumps to its live demo. One rAF loop, only while on screen; with reduced motion it renders still.

/** Lucide-style stroke icons (ISC), inline so the site needs no icon package. */
const I = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full" aria-hidden>
    {children}
  </svg>
);

const CARDS = [
  { label: "Agentic IA", line: "Agentes que atienden por voz y WhatsApp", href: "/#agentic", bg: "#010136", fg: "#FFFFFF", icon: <I><path d="M12 8V4H8" /><rect x="4" y="8" width="16" height="12" rx="2" /><path d="M2 14h2M20 14h2M15 13v2M9 13v2" /></I> },
  { label: "QualityIQ", line: "Audita el 100% de las conversaciones", href: "/#quality", bg: "#04CCDB", fg: "#010136", icon: <I><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></I> },
  { label: "Omnichannel", line: "Todos los canales en una bandeja", href: "/#omnichannel", bg: "#2A449E", fg: "#FFFFFF", icon: <I><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 9h8M8 13h5" /></I> },
  { label: "MIS + SAM", line: "Tus datos y un analista de IA", href: "/#mis", bg: "#E8EEFB", fg: "#0B0D3A", icon: <I><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="M7 16v-3M11 16V9M15 16v-5M19 16V6" /></I> },
  { label: "Coaching", line: "Feedback con IA para cada agente", href: "/#quality", bg: "#1E1656", fg: "#FFFFFF", icon: <I><path d="M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0z" /><path d="M22 10v6M6 12.5V16a6 3 0 0 0 12 0v-3.5" /></I> },
  { label: "Telefonía", line: "Tu central en la nube, con IA", href: "/#omnichannel", bg: "#0896A4", fg: "#FFFFFF", icon: <I><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></I> },
];

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const r = (x: number) => Math.round(x * 100) / 100; // same numbers on server and client (no hydration mismatch)
const cardW = (vw: number) => (vw < 768 ? 168 : 240);

// 12 slots on a cylinder (each card twice).
const RING = [...CARDS, ...CARDS];
function ringPlace(i: number, turn: number, vw: number) {
  const step = (Math.PI * 2) / RING.length;
  const R = (cardW(vw) + (vw < 768 ? 16 : 28)) / step;
  let a = i * step - turn;
  a = Math.atan2(Math.sin(a), Math.cos(a)); // wrap to -π..π
  const front = Math.cos(a);
  return {
    transform: `translate3d(${r(R * Math.sin(a))}px, -50%, ${r(R * front - R)}px) rotateY(${r(a)}rad)`,
    opacity: r(clamp(front * 2.2 - 0.3)),
  };
}

export function Solutions() {
  const [vw, setVw] = useState(1366);
  const [still, setStill] = useState(false);
  const box = useRef<HTMLElement>(null);
  const ring = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const read = () => setVw(innerWidth);
    read();
    setStill(matchMedia("(prefers-reduced-motion: reduce)").matches);
    addEventListener("resize", read);
    return () => removeEventListener("resize", read);
  }, []);

  useEffect(() => {
    const frame = (turn: number) =>
      ring.current.forEach((el, i) => {
        if (!el) return;
        const p = ringPlace(i, turn, vw);
        el.style.transform = p.transform;
        el.style.opacity = String(p.opacity);
        el.style.pointerEvents = p.opacity > 0.6 ? "auto" : "none";
      });
    if (still) return frame(0);

    let raf = 0;
    const t0 = performance.now();
    const loop = () => {
      const top = box.current?.getBoundingClientRect().top ?? 0;
      frame(((performance.now() - t0) / 1000) * 0.14 - top / 900);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(loop);
    });
    if (box.current) io.observe(box.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [vw, still]);

  const w = cardW(vw);
  return (
    <section id="soluciones" ref={box} className="relative overflow-x-clip bg-white pb-24 md:pb-32">
      <div className="mx-auto max-w-6xl px-4 pt-40 text-center md:pt-32">
        <p className="text-[13px] font-medium text-md-muted">Hub de soluciones con IA</p>
        <h2 className="mx-auto mt-3 max-w-3xl font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-md-ink md:text-7xl">
          Un hub. Todo tu contact center.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-md-muted md:text-lg">
          Cada solución funciona sola y, conectadas, comparten el contexto de cada cliente. Tocá una para probarla en vivo.
        </p>
      </div>
      <div className="relative mt-10 [perspective:1400px] md:mt-12" style={{ height: w * 1.15 + 40 }}>
        <div className="absolute inset-0 [transform-style:preserve-3d] [transform:rotateX(-6deg)]">
          {RING.map((c, i) => (
            <a
              key={i}
              ref={(el) => void (ring.current[i] = el)}
              href={c.href}
              aria-label={`${c.label}: ver la demo`}
              tabIndex={i < CARDS.length ? 0 : -1}
              className="group absolute left-1/2 top-1/2 flex flex-col justify-between rounded-[28px] p-5 text-left shadow-[0_28px_60px_-18px_rgba(1,1,54,0.45)] md:p-6"
              style={{ width: w, height: w * 1.15, marginLeft: -w / 2, background: c.bg, color: c.fg, ...ringPlace(i, 0, vw) }}
            >
              <span className="block h-14 w-14 transition group-hover:scale-110 md:h-20 md:w-20">{c.icon}</span>
              <span>
                <span className="block font-display text-xl font-extrabold leading-tight md:text-2xl">{c.label}</span>
                <span className="mt-1 block text-xs leading-snug opacity-75 md:text-sm">{c.line}</span>
                <span className="mt-3 inline-block text-xs font-semibold underline-offset-4 group-hover:underline md:text-sm">Probar demo →</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
