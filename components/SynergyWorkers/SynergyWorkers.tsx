"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { HeroHighlight } from "../UI/HeroHighlight";

const SynergyWorkers = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const workers = [
    {
      title: "AGENTE",
      description:
        "Cada usuario cuenta con su propio dashboard para la autogestión de solicitudes y reportes.",
      image: "/assets/synergy-wfm/worker-1.png",
    },
    {
      title: "ANALISTA",
      description:
        "Accede a un dashboard donde podrá generar pronósticos, simulacros e implementar planes de vuelo.",
      image: "/assets/synergy-wfm/worker-2.png",
    },
    {
      title: "STAFF (HR)",
      description:
        "La herramienta provee un módulo para facilitar los trámites específicos de cada recurso.",
      image: "/assets/synergy-wfm/worker-3.png",
    },
  ];

  return (
    <HeroHighlight subtleDots>
      <div ref={ref} className="py-16 px-4 md:px-10 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold mb-16 text-center text-maydayDarker"
        >
          Una herramienta, 3 perfiles de gestión
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          {workers.map((worker, index) => (
            <motion.div
              key={worker.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              <div className="relative h-40 overflow-hidden mb-4">
                <img
                  src={worker.image}
                  alt={worker.title}
                  className="w-full h-full object-contain rounded-lg"
                />

                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-full h-full">
                  {index === 0 && (
                    <>
                      <div className="absolute top-4 left-4">
                        <div className="h-8 w-8 rounded-full bg-[#04CCDB] opacity-70"></div>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <div className="h-12 w-12 rounded-full bg-[#0A0F29] opacity-70"></div>
                      </div>
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <div className="absolute top-4 right-4">
                        <div className="h-8 w-8 rounded-full bg-[#04CCDB] opacity-70"></div>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="h-8 w-8 rounded-full bg-[#0A0F29] opacity-70"></div>
                      </div>
                      <div className="absolute top-1/2 right-1/2">
                        <div className="h-6 w-6 rounded-full bg-[#04CCDB] opacity-50"></div>
                      </div>
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <div className="absolute top-4 left-4">
                        <div className="h-6 w-6 rounded-full bg-[#04CCDB] opacity-70"></div>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <div className="h-10 w-10 rounded-full bg-[#0A0F29] opacity-70"></div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-normal mb-3 text-mayday">
                  {worker.title}
                </h3>
                <p className="text-sm text-gray-600 max-w-xs mx-auto">
                  {worker.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </HeroHighlight>
  );
};

export default SynergyWorkers;
