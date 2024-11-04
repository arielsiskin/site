import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Banner from "@/components/Banner/Banner.component";
import { Vortex } from "@/components/UI/Vortex";
import localFont from "next/font/local";

const azoSans = localFont({
  src: [
    { path: "./fonts/AZOSANS-BLACK.woff", weight: "900", style: "normal" },
    {
      path: "./fonts/AZOSANS-BLACKITALIC.woff",
      weight: "900",
      style: "italic",
    },
    { path: "./fonts/AZOSANS-BOLD.woff", weight: "700", style: "normal" },
    { path: "./fonts/AZOSANS-BOLDITALIC.woff", weight: "700", style: "italic" },
    { path: "./fonts/AZOSANS-ITALIC.woff", weight: "400", style: "italic" },
    { path: "./fonts/AZOSANS-LIGHT.woff", weight: "300", style: "normal" },
    {
      path: "./fonts/AZOSANS-LIGHTITALIC.woff",
      weight: "300",
      style: "italic",
    },
    { path: "./fonts/AZOSANS-MEDIUM.woff", weight: "500", style: "normal" },
    {
      path: "./fonts/AZOSANS-MEDIUMITALIC.woff",
      weight: "500",
      style: "italic",
    },
    { path: "./fonts/AZOSANS-REGULAR.woff", weight: "400", style: "normal" },
    { path: "./fonts/AZOSANS-THIN.woff", weight: "200", style: "normal" },
    { path: "./fonts/AZOSANS-THINITALIC.woff", weight: "200", style: "italic" },
  ],
  variable: "--font-azo-sans",
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set a timer to remove the loading screen after a delay
    const timer = setTimeout(() => setIsLoading(false), 2000); // 2-second delay
    return () => clearTimeout(timer); // Clean up timer on component unmount
  }, []);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.p
              className={`${azoSans.className} text-white text-3xl md:text-4xl text-bold`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              Proximamente...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with Fade-in Animation */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center w-full h-full"
          >
            <img
              src="assets/logo-web.svg"
              alt="logo mayday"
              className="w-32 h-auto md:w-40 lg:w-80"
            />
            {/* <h1
              className={`${azoSans.className} title text-3xl font-bold mt-4 mb-2 md:text-5xl`}
            >
              Mayday Global
            </h1> */}
            {/* <p
              className={`${azoSans.className} text-center text-white text-base md:text-lg`}
            >
              HUB DE SOLUCIONES IT PARA EMPRESAS
            </p> */}
            <Banner />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
