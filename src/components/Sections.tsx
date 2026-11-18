import { useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DEMO_WHATSAPP_URL } from "@/lib/utils";
import { Aurora, Glow, PillLink, Reveal, SectionTitle } from "./ui";

const SOLUTIONS = [
  { title: "Omnichannel", body: "Telefonía, CRM y canales digitales en una sola plataforma.", href: "/#omnichannel", span: "md:col-span-2", tone: "dark" },
  { title: "IA Bot", body: "Bots inteligentes para WhatsApp, web y redes.", href: "/#iabot", span: "", tone: "light" },
  { title: "Voicebot", body: "Agentes de voz que resuelven y derivan.", href: "/#voicebot", span: "", tone: "light" },
  { title: "QualityIQ", body: "Auditoría con IA del 100% de las llamadas, con coaching para cada agente.", href: "/#quality", span: "md:col-span-2", tone: "glow" },
  { title: "Synergy WFM", body: "Pronóstico, turnos y productividad de tu equipo.", href: "/#wfm", span: "md:col-span-3", tone: "light" },
] as const;

export function Solutions() {
  return (
    <section id="soluciones" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle eyebrow="Soluciones" title={<>Todo tu contact center, <Glow>conectado</Glow>.</>} />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {SOLUTIONS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06} className={s.span}>
              <a
                href={s.href}
                className={`group relative flex h-full min-h-[200px] flex-col justify-end overflow-hidden rounded-[24px] p-6 transition hover:-translate-y-1 ${
                  s.tone === "dark" ? "bg-md-navy text-white" : s.tone === "glow" ? "bg-md-sky text-md-ink" : "bg-md-bg text-md-ink"
                }`}
              >
                {s.tone === "glow" && <Aurora className="opacity-70" />}
                {s.tone === "dark" && <div aria-hidden className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-md-cyan/30 blur-3xl" />}
                <div className="relative">
                  <h3 className="font-display text-2xl font-extrabold">{s.title}</h3>
                  <p className={`mt-2 max-w-md text-sm ${s.tone === "dark" ? "text-md-dark-muted" : "text-md-muted"}`}>{s.body}</p>
                  <span className="mt-4 inline-block text-sm font-semibold transition group-hover:translate-x-1">Probalo →</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Count({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.4, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v.toLocaleString("es-AR")}{suffix}</span>;
}

export function Numbers() {
  return (
    <section className="bg-white pb-24">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-3">
        {[[50, "+", "clientes en la región"], [10, "", "países"], [4100, "+", "usuarios en nuestra plataforma"]].map(([n, s, l]) => (
          <div key={l as string} className="rounded-[24px] border border-md-line p-8">
            <p className="font-display text-5xl font-extrabold text-md-ink md:text-6xl"><Count to={n as number} suffix={s as string} /></p>
            <p className="mt-2 text-md-muted">{l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const FAQS = [
  ["¿El voicebot reemplaza a mis agentes?", "No: resuelve las gestiones repetitivas y deriva a un agente con todo el contexto cuando el caso lo necesita. Tus agentes se quedan con las conversaciones que agregan valor."],
  ["¿Con qué sistemas se integra?", "Con tu telefonía actual, CRM y APIs internas: consultas de saldo, estado de pedidos, bloqueos, turnos. Lo armamos en el diseñador de flujos, sin código."],
  ["¿Qué evalúa QualityIQ?", "Tu propio protocolo, ítem por ítem, con la cita exacta y el minuto de la llamada. Además mide emociones, detecta alertas (maltrato, amenaza de baja, datos sensibles) y propone práctica para cada agente."],
  ["¿Qué pasa con los datos de las llamadas?", "Se procesan en la nube de Google, cifrados, en buckets separados por cliente. En esta demo el audio no se guarda."],
  ["¿En cuánto tiempo lo tengo funcionando?", "Un piloto de voicebot o de QualityIQ suele estar operativo en dos a cuatro semanas, según las integraciones."],
];

export function Faq() {
  return (
    <section className="bg-md-bg py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-4">
        <SectionTitle center eyebrow="Preguntas frecuentes" title="Lo que suelen preguntarnos." />
        <div className="mt-10 divide-y divide-md-line rounded-[24px] bg-white px-6">
          {FAQS.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-md-ink">
                {q}
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-md-chip text-md-blue transition group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-md-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Closing() {
  return (
    <section id="contacto" className="relative overflow-hidden bg-md-sky py-28 text-center md:py-36">
      <Aurora className="top-1/3" />
      <Reveal className="relative mx-auto max-w-3xl px-4">
        <h2 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-md-ink md:text-6xl">
          ¿Listo para que cada llamada <Glow>sume</Glow>?
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-md-muted md:text-lg">Te mostramos el voicebot y QualityIQ con tus propias llamadas en 30 minutos.</p>
        <div className="mt-8 flex justify-center">
          <PillLink href={DEMO_WHATSAPP_URL}>Agendar una demo</PillLink>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-md-navy py-14 text-md-dark-muted">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <img src="/logo.svg" alt="Mayday Global" className="h-8 w-auto" />
          <p className="mt-4 max-w-xs text-sm">Tecnología e inteligencia artificial para contact centers de América Latina.</p>
        </div>
        {[
          ["Soluciones", [["Omnichannel", "/#omnichannel"], ["IA Bot", "/#iabot"], ["Voicebot", "/#voicebot"], ["QualityIQ", "/#quality"], ["Synergy WFM", "/#wfm"]]],
          ["Empresa", [["Nosotros", "/about-us"], ["LinkedIn", "https://www.linkedin.com/company/mayday-global/"]]],
          ["Legal", [["Privacidad", "/policy"]]],
        ].map(([h, links]) => (
          <div key={h as string}>
            <p className="text-sm font-semibold text-white">{h as string}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {(links as string[][]).map(([l, href]) => (
                <li key={l}><a href={href} className="hover:text-white">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-12 max-w-6xl px-4 text-xs">© {new Date().getFullYear()} Mayday Global</p>
    </footer>
  );
}
