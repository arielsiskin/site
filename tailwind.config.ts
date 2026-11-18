import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cfont: ["var(--font-cfont)", ...fontFamily.sans],
        // Mayday design system (quality-iq/apps/web/src/tokens.ts), set by next/font in pages/v2.tsx
        display: ["var(--font-display)", "var(--font-body)", ...fontFamily.sans],
        body: ["var(--font-body)", ...fontFamily.sans],
        data: ["var(--font-data)", ...fontFamily.mono],
      },
      textColor: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        mayday: "var(--mayday)",
        maydayDarker: "var(--mayday-darker)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Mayday design system tokens. Cyan only on dark or as a fill; cyan-dark for text on white.
        md: {
          navy: "#010136",
          indigo: "#1E1656",
          blue: "#2A449E",
          cyan: "#04CCDB",
          "cyan-dark": "#0896A4",
          bg: "#F4F6FB",
          sky: "#E8EEFB",
          surface2: "#F8F9FD",
          chip: "#EEF1F8",
          line: "#DDE2EE",
          ink: "#0B0D3A",
          muted: "#525A7A",
          "dark-card": "#0B0D3A",
          "dark-line": "#22246A",
          "dark-text": "#F2F5FF",
          "dark-muted": "#A9B4D8",
          "ok-bg": "#E3F4EA",
          "ok-fg": "#15603B",
          "warn-bg": "#FFF1DC",
          "warn-fg": "#7A4100",
          "err-bg": "#FDE8E7",
          "err-fg": "#8A1C13",
          "info-bg": "#E8ECFA",
        },
      },
      backgroundImage: {
        // "custom-gradient": "radial-gradient(rgba(1,1,53,1), rgba(0,0,27,1))",
        "footer-gradient":
          "linear-gradient(to bottom, #2A449E 47.13%, #000000 80.47%)",
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        marquee2: "marquee2 25s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
