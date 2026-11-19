import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Aurora, Eyebrow, Glow, MayaAvatar, PillLink, Wave } from "./ui";

const NAV = [
  { name: "Voicebot", href: "/#voicebot" },
  { name: "QualityIQ", href: "/#quality" },
  { name: "Soluciones", href: "/#soluciones" },
  { name: "Nosotros", href: "/about-us" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3">
      <nav
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full px-4 transition-all duration-300 md:px-6 ${
          scrolled ? "bg-white/75 shadow-[0_6px_24px_rgba(1,1,54,0.08)] backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <a href="/" className="flex items-center gap-2" aria-label="Mayday Global, inicio">
          <img src="/assets/logo.svg" alt="" className="h-7 w-auto" />
          <span className="font-display text-[15px] font-extrabold tracking-wide text-md-navy">MAYDAY GLOBAL</span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <li key={n.name}>
              <a href={n.href} className="rounded-full px-3 py-2 text-sm font-medium text-md-ink/80 transition hover:bg-md-chip hover:text-md-ink">
                {n.name}
              </a>
            </li>
          ))}
        </ul>
        <a href="/#contacto" className="rounded-full bg-md-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-md-indigo">
          Pedir demo
        </a>
      </nav>
    </header>
  );
}

const LOGOS = [
  { name: "Botmaker", src: "/assets/brands/botmaker.svg" },
  { name: "Neotel", src: "/assets/brands/neotel.svg" },
  { name: "Collaborix", src: "/assets/brands/collaborix.svg" },
  { name: "Vocalcom", src: "/assets/brands/vocalcom.svg" },
];

const LIVE = [
  { who: "Cliente", text: "Hola, quiero bloquear mi tarjeta, la perdí." },
  { who: "Maya", text: "Lo hago ya mismo. ¿Me confirmás los últimos 4 dígitos de tu DNI?" },
  { who: "Cliente", text: "Sí, 4471." },
  { who: "Maya", text: "Listo, tarjeta bloqueada. Tu número de gestión es 803 215." },
];

/** The floating "call in progress" card: lines appear one by one, like the reference's live product UI. */
function LiveCall() {
  const [n, setN] = useState(1);
  useEffect(() => {
    const id = setInterval(() => setN((v) => (v >= LIVE.length ? 1 : v + 1)), 2200);
    return () => clearInterval(id);
  }, []);
  const speaking = LIVE[n - 1].who === "Maya";
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-md rounded-3xl border border-white/60 bg-white/80 p-4 text-left shadow-[0_24px_60px_rgba(1,1,54,0.18)] backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MayaAvatar className="h-10 w-10 ring-2 ring-white" />
          <div>
            <p className="text-sm font-semibold text-md-ink">Maya · Voicebot</p>
            <p className="font-data text-[11px] text-md-muted">Llamada en curso · 00:{String(12 + n * 7).padStart(2, "0")}</p>
          </div>
        </div>
        <Wave active={speaking} bars={10} className="h-6 text-md-cyan-dark" />
      </div>
      <div className="mt-3 h-[150px] space-y-2 overflow-hidden">
        {LIVE.slice(0, n).map((l, i) => (
          <motion.div
            key={`${i}-${l.text}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-snug ${
              l.who === "Maya" ? "ml-auto bg-md-navy text-white" : "bg-md-chip text-md-ink"
            }`}
          >
            {l.text}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-md-sky pt-36 md:pt-44">
      <Aurora className="top-[38%]" />
      {/* globe lines, as in the reference */}
      <svg aria-hidden viewBox="0 0 1200 600" className="pointer-events-none absolute left-1/2 top-[34%] w-[1400px] -translate-x-1/2 opacity-40">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <ellipse key={`m${i}`} cx="600" cy="600" rx={80 + i * 90} ry="520" fill="none" stroke="white" strokeWidth="1" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse key={`p${i}`} cx="600" cy={600 + i * 10} rx="620" ry={420 - i * 80} fill="none" stroke="white" strokeWidth="1" />
        ))}
      </svg>

      <div className="relative mx-auto max-w-5xl px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Eyebrow>Hub de soluciones con IA para contact centers</Eyebrow>
          <h1 className="mx-auto mt-4 max-w-4xl font-display text-[44px] font-extrabold leading-[1.02] tracking-tight text-md-ink md:text-[84px]">
            Cada llamada, <Glow>atendida</Glow> y entendida.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-md-muted md:text-lg">
            Un solo hub con todo lo que tu contact center necesita: voicebots que atienden como personas, QualityIQ que
            audita el 100% de las conversaciones, omnicanalidad y MIS para ver todos tus datos, conectados entre sí.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <PillLink href="/#voicebot">Hablar con Maya</PillLink>
            <PillLink href="/#quality" variant="light">
              Analizar una llamada
            </PillLink>
          </div>
        </motion.div>

        <div className="mt-16 pb-10 md:mt-20">
          <LiveCall />
        </div>
      </div>

      <div className="relative border-t border-white/20 py-8">
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-white/80">Partners y tecnología</p>
        <div className="relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 animate-marquee items-center gap-16 pr-16" aria-hidden={k === 1}>
              {[...LOGOS, ...LOGOS].map((l, i) => (
                <img key={i} src={l.src} alt={k === 0 && i < LOGOS.length ? l.name : ""} className="h-8 w-auto opacity-90 brightness-0 invert" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
