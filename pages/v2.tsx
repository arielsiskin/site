import Head from "next/head";
import { DM_Sans, JetBrains_Mono, Urbanist } from "next/font/google";
import { Hero, Nav } from "@/components/v2/Hero";
import { VoiceDemo } from "@/components/v2/VoiceDemo";
import { VoiceScreens } from "@/components/v2/VoiceScreens";
import { QualityDemo } from "@/components/v2/QualityDemo";
import { OmniDemo } from "@/components/v2/OmniDemo";
import { BotDemo } from "@/components/v2/BotDemo";
import { WfmDemo } from "@/components/v2/WfmDemo";
import { Closing, Faq, Footer, Numbers, Solutions } from "@/components/v2/Sections";

// Mayday design system fonts (quality-iq/apps/web/src/tokens.ts): Urbanist headings, DM Sans text, JetBrains Mono data.
const display = Urbanist({ subsets: ["latin"], variable: "--font-display", weight: ["600", "700", "800"] });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });
const data = JetBrains_Mono({ subsets: ["latin"], variable: "--font-data" });

export default function V2() {
  return (
    <div className={`${display.variable} ${body.variable} ${data.variable} min-h-screen scroll-smooth bg-white font-body text-md-ink antialiased`}>
      <Head>
        <title>Mayday Global | IA para contact centers</title>
        <meta name="description" content="Voicebots, QualityIQ, IA Bot, Omnichannel y Synergy WFM para contact centers de América Latina." />
      </Head>
      <Nav />
      <main>
        <Hero />
        <Solutions />
        <VoiceDemo />
        <VoiceScreens />
        <QualityDemo />
        <OmniDemo />
        <BotDemo />
        <WfmDemo />
        <Numbers />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </div>
  );
}
