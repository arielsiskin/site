"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface Feature {
  text: string;
}

interface SynergyFeaturesProps {
  title?: string;
  subtitle?: string;
  features: Feature[];
}

const SynergyFeatures: React.FC<SynergyFeaturesProps> = ({
  title = "¿Por qué sumar Synergy a tu Contact Center?",
  subtitle,
  features = [
    { text: "Genera métricas unificadas" },
    { text: "Implementación rápida y personalizada" },
    { text: "Servicio de Soporte online 7×24" },
    { text: "Cuenta con KPIs y dashboards customizables" },
    { text: "Permite planificar y predecir resultados de gestión" },
  ],
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Define the animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Define the animation variants for each feature item
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div ref={ref} className="w-full py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main content */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            ¿Por qué sumar <span className="text-blue-600">Synergy</span> a tu Contact Center?
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Features with checkmarks - custom layout */}
        <div className="flex flex-col items-center">
          {/* First row - 2 items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mb-10">
            {features.slice(0, 2).map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center bg-white rounded-lg shadow-md px-4 py-3 h-[50px]"
                variants={itemVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-700 font-medium text-lg">{feature.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Second row - 2 items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mb-10">
            {features.slice(2, 4).map((feature, index) => (
              <motion.div
                key={index + 2}
                className="flex items-center bg-white rounded-lg shadow-md px-4 py-3 h-[50px]"
                variants={itemVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                transition={{ delay: (index + 2) * 0.1 }}
              >
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-700 font-medium text-lg">{feature.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Third row - 1 centered item */}
          {features.length > 4 && (
            <div className="w-full max-w-md flex justify-center">
              <motion.div
                key={4}
                className="flex items-center bg-white rounded-lg shadow-md px-4 py-3 h-[50px]"
                variants={itemVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                transition={{ delay: 0.5 }}
              >
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-700 font-medium">{features[4].text}</p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SynergyFeatures;
