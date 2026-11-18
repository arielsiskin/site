import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Eyebrow = ({ children, dark }: { children: ReactNode; dark?: boolean }) => (
  <p className={cn("text-[13px] font-medium tracking-wide", dark ? "text-md-dark-muted" : "text-md-muted")}>{children}</p>
);

/** The one gradient word in a headline: blue to cyan on light, cyan to lilac on dark. */
export const Glow = ({ children, dark }: { children: ReactNode; dark?: boolean }) => (
  <span
    className={cn(
      "bg-clip-text text-transparent",
      dark ? "bg-gradient-to-r from-md-cyan to-[#A9B4FF]" : "bg-gradient-to-r from-md-blue via-[#3F5BC8] to-md-cyan-dark",
    )}
  >
    {children}
  </span>
);

export const PillLink = ({ href, children, variant = "dark" }: { href: string; children: ReactNode; variant?: "dark" | "light" | "ghost" }) => (
  <a
    href={href}
    className={cn(
      "inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-md-blue",
      variant === "dark" && "bg-md-navy text-white hover:bg-md-indigo",
      variant === "light" && "bg-white text-md-navy shadow-[0_1px_3px_rgba(1,1,54,0.12)] hover:bg-md-surface2",
      variant === "ghost" && "text-md-ink hover:bg-white/60",
    )}
  >
    {children}
    <span aria-hidden>→</span>
  </a>
);

/** Soft brand-colour field behind product mockups (the reference's aurora, in Mayday blue, cyan and indigo). */
export const Aurora = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn("pointer-events-none absolute inset-0", className)}
    style={{
      background:
        "radial-gradient(60% 55% at 20% 100%, rgba(4,204,219,0.55), transparent 70%)," +
        "radial-gradient(55% 60% at 80% 100%, rgba(122,92,255,0.45), transparent 70%)," +
        "radial-gradient(70% 60% at 50% 110%, rgba(42,68,158,0.85), transparent 75%)," +
        "linear-gradient(180deg, rgba(232,238,251,0) 0%, rgba(169,190,245,0.55) 60%, rgba(63,91,200,0.6) 100%)",
    }}
  />
);

export const Reveal = ({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export const SectionTitle = ({ eyebrow, title, body, center, dark }: { eyebrow: string; title: ReactNode; body?: ReactNode; center?: boolean; dark?: boolean }) => (
  <Reveal className={cn("max-w-2xl", center && "mx-auto text-center")}>
    <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
    <h2 className={cn("mt-3 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-[56px]", dark ? "text-white" : "text-md-ink")}>
      {title}
    </h2>
    {body && <p className={cn("mt-5 text-base leading-relaxed md:text-lg", dark ? "text-md-dark-muted" : "text-md-muted")}>{body}</p>}
  </Reveal>
);

/** Animated bars of a speaking voice; still when `active` is false. */
export const Wave = ({ active, bars = 20, className }: { active: boolean; bars?: number; className?: string }) => (
  <div className={cn("flex h-8 items-center gap-[3px]", className)} aria-hidden>
    {Array.from({ length: bars }, (_, i) => (
      <motion.span
        key={i}
        className="w-[3px] rounded-full bg-current"
        animate={active ? { height: [6, 10 + ((i * 7) % 22), 6] } : { height: 4 }}
        transition={active ? { duration: 0.7 + (i % 5) * 0.12, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
      />
    ))}
  </div>
);
