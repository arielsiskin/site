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
