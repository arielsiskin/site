import React from "react";
import { useInView } from "react-intersection-observer";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";

const AnimatedNumber = ({ value }: { value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  React.useEffect(() => {
    if (inView) {
      animate(count, value, {
        duration: 2,
      });
    }
  }, [count, value, inView]);

  return (
    <motion.h3 ref={ref} className="text-4xl md:text-6xl  text-[#04CCDB] leading-none mb-1">
      +<motion.span>{rounded}</motion.span>
    </motion.h3>
  );
};

const Achievements = () => {
  return (
    <div id="nosotros" className="bg-[#2A449E] text-white py-10 md:mt-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16">
          <p className="text-lg mb-8 md:mb-12 max-w-2xl text-white">
            Con cada conexión, con cada herramienta, con cada interacción,
            estamos construyendo una experiencia superadora para nuestros
            clientes.
          </p>
          <div className="text-center my-auto">
            <AnimatedNumber value={50} />
            <p className="text-sm lg:text-lg text-white">
              Clientes en la región
            </p>
          </div>
          <div className="text-center my-auto">
            <AnimatedNumber value={10} />
            <p className="text-sm lg:text-lg text-white">Países</p>
          </div>
          <div className="text-center my-auto">
            <AnimatedNumber value={4100} />
            <p className="text-sm lg:text-lg text-white">Usuarios</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
