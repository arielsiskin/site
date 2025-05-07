import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface CardProps {
  title: string;
  delay: number;
}

const Card = ({ title, delay }: CardProps) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white h-48 flex items-center justify-center rounded-lg p-8 shadow-lg text-center hover:shadow-xl transition-shadow"
    >
      <h3 className="text-[#2A449E] text-center text-lg font-medium mb-2">
        {title}
      </h3>
    </motion.div>
  );
};

const WhyUs = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const cards = [
    {
      title: "SOLUCIONES INTEGRALES Y A MEDIDA",
    },
    {
      title: "EQUIPO EXPERTO Y CERCANO",
    },
    {
      title: "CALIDAD DE SERVICIO PUNTA A PUNTA",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className=" mb-12"
          >
            <h2 className="text-4xl font-bold text-[#010136] mb-6">
              POR QUÉ ELEGIRNOS
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#2A449E] text-white px-6 py-2 rounded-md text-sm hover:bg-[#1E3278] transition-colors"
            >
              CONOCER MÁS
            </motion.button>
          </motion.div>
          {cards.map((card, index) => (
            <Card
              key={card.title}
              title={card.title}
              delay={0.2 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
