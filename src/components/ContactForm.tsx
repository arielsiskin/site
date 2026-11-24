import { useEffect, useRef, useState } from "react";
import { ACTION, SITE_KEY, TEST_SITE_KEY } from "@/lib/turnstile";
import { COUNTRIES } from "@/lib/zoho";

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, o: Record<string, unknown>) => string; reset: (id: string) => void; remove: (id: string) => void };
  }
}

const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const input = "w-full rounded-xl border border-md-line bg-white px-4 py-3 text-md-ink placeholder:text-md-muted/70 focus:border-md-blue focus:outline-none";

/** Contact form with the Turnstile widget right before the submit button. The token is verified in /api/contact. */
export function ContactForm() {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string>();
  const [token, setToken] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const render = () => {
      if (!box.current || !window.turnstile || widget.current) return;
      widget.current = window.turnstile.render(box.current, {
        sitekey: location.hostname.endsWith("mayday.global") ? SITE_KEY : TEST_SITE_KEY,
        action: ACTION,
        language: "es",
        callback: setToken,
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
    };
    let s = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT}"]`);
    if (!s) {
      s = Object.assign(document.createElement("script"), { src: SCRIPT, async: true });
      document.head.append(s);
    }
    if (window.turnstile) render();
    else s.addEventListener("load", render);
    return () => {
      s?.removeEventListener("load", render);
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = undefined;
    };
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...data, token }) }).catch(() => null);
    const out = await res?.json().catch(() => null);
    if (res?.ok) return setState("sent");
    setError(out?.error ?? "No pudimos enviar el mensaje. Probá de nuevo o escribinos por WhatsApp.");
    setState("idle");
    // tokens are single-use: get a fresh one for the retry
    setToken("");
    if (widget.current) window.turnstile?.reset(widget.current);
  }

  if (state === "sent")
    return (
      <div className="rounded-[24px] bg-white p-8 text-center shadow-[0_12px_32px_rgba(1,1,54,0.08)]" role="status">
        <p className="font-display text-2xl font-extrabold text-md-ink">¡Gracias! Recibimos tu mensaje.</p>
        <p className="mt-2 text-md-muted">Te vamos a escribir a la brevedad.</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-[24px] bg-white p-6 text-left shadow-[0_12px_32px_rgba(1,1,54,0.08)] sm:grid-cols-2 md:p-8">
      <label className="grid gap-1 text-sm font-medium text-md-ink">
        Nombre
        <input name="nombre" required maxLength={100} autoComplete="name" className={input} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-md-ink">
        Empresa
        <input name="empresa" required maxLength={120} autoComplete="organization" className={input} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-md-ink">
        Email
        <input name="email" type="email" required maxLength={160} autoComplete="email" className={input} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-md-ink">
        Teléfono
        <input name="telefono" type="tel" required maxLength={40} autoComplete="tel" className={input} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-md-ink sm:col-span-2">
        País
        <select name="pais" required defaultValue="" className={input}>
          <option value="" disabled>Elegí tu país</option>
          {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-medium text-md-ink sm:col-span-2">
        ¿Qué querés resolver?
        <textarea name="mensaje" required maxLength={2000} rows={4} className={input} />
      </label>
      <div ref={box} className="min-h-[65px] sm:col-span-2" />
      {error && <p role="alert" className="text-sm font-medium text-[#C4303F] sm:col-span-2">{error}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
        <p className="text-xs text-md-muted">
          Usamos tus datos solo para responderte. <a href="/policy" className="underline">Privacidad</a>
        </p>
        <button
          disabled={!token || state === "sending"}
          className="inline-flex h-11 items-center rounded-full bg-md-navy px-6 text-sm font-semibold text-white transition hover:bg-md-indigo disabled:opacity-50"
        >
          {state === "sending" ? "Enviando…" : "Enviar"}
        </button>
      </div>
    </form>
  );
}
