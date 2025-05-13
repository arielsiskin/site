import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Banner from "@/components/Banner/Banner.component";
import localFont from "next/font/local";
import Head from "next/head";
import { HeroHighlight } from "@/components/UI/HeroHighlight";
import SimpleSlider from "@/components/Slider/Slider";
import Brands from "@/components/Brands/Brands";
import Products from "@/components/Products/Products";
import Achievements from "@/components/Achievements/Achievements";
import WhyUs from "@/components/WhyUs/WhyUs";
import Contact from "@/components/Contact/Contact";
import Allies from "@/components/Allies/Allies";
import AnimateInView from "@/components/UI/AnimateInView";

const azoSans = localFont({
  src: [
    { path: "../fonts/AZOSANS-BLACK.woff", weight: "900", style: "normal" },
    {
      path: "../fonts/AZOSANS-BLACKITALIC.woff",
      weight: "900",
      style: "italic",
    },
    { path: "../fonts/AZOSANS-BOLD.woff", weight: "700", style: "normal" },
    {
      path: "../fonts/AZOSANS-BOLDITALIC.woff",
      weight: "700",
      style: "italic",
    },
    { path: "../fonts/AZOSANS-ITALIC.woff", weight: "400", style: "italic" },
    { path: "../fonts/AZOSANS-LIGHT.woff", weight: "300", style: "normal" },
    {
      path: "../fonts/AZOSANS-LIGHTITALIC.woff",
      weight: "300",
      style: "italic",
    },
    { path: "../fonts/AZOSANS-MEDIUM.woff", weight: "500", style: "normal" },
    {
      path: "../fonts/AZOSANS-MEDIUMITALIC.woff",
      weight: "500",
      style: "italic",
    },
    { path: "../fonts/AZOSANS-REGULAR.woff", weight: "400", style: "normal" },
    { path: "../fonts/AZOSANS-THIN.woff", weight: "200", style: "normal" },
    {
      path: "../fonts/AZOSANS-THINITALIC.woff",
      weight: "200",
      style: "italic",
    },
  ],
  variable: "--font-azo-sans",
});

export default function Home() {
  return (
    <div className={`w-full ${azoSans.className}`}>
      <Head>
        <title>Mayday Global | Soluciones para Contact Centers</title>
        <meta name="description" content="Mayday Global es sinónimo de agilidad en los procesos, personalización en la atención y excelencia en el servicio post venta. Somos más que una plataforma, somos el motor que impulsa a los contact centers al siguiente nivel." />
      </Head>
      <SimpleSlider />

      <AnimateInView animation="fadeIn" duration={0.8}>
        <Brands />
      </AnimateInView>

      <AnimateInView animation="slideUp" delay={0.1} threshold={0.2}>
        <Products />
      </AnimateInView>

      <AnimateInView animation="fadeIn" delay={0.2} threshold={0.3}>
        <Achievements />
      </AnimateInView>

      <AnimateInView animation="slideUp" delay={0.1} threshold={0.2}>
        <WhyUs />
      </AnimateInView>

      <AnimateInView animation="fadeIn" delay={0.2}>
        <Allies />
      </AnimateInView>

      <AnimateInView animation="slideUp" delay={0.3}>
        <Contact />
      </AnimateInView>
    </div>
  );
}
