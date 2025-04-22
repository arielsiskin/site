import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Banner from "@/components/Banner/Banner.component";
import localFont from "next/font/local";
import { HeroHighlight } from "@/components/UI/HeroHighlight";
import SimpleSlider from "@/components/Slider/Slider";
import Brands from "@/components/Brands/Brands";
import Products from "@/components/Products/Products";
import Achievements from "@/components/Achievements/Achievements";
import WhyUs from "@/components/WhyUs/WhyUs";
import Contact from "@/components/Contact/Contact";
import Allies from "@/components/Allies/Allies";

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
      <SimpleSlider />

      <Brands />

      <Products />

      <Achievements />

      <WhyUs />

      <Allies />

      <Contact />
    </div>
  );
}
