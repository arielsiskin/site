import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useInView } from "framer-motion";

const alliesData = [
  {
    country: "MÉXICO",
    brands: [
      { name: "Lucerna", logo: "/assets/allies/mexico/lucerna.png" },
      { name: "Insurgentes", logo: "/assets/allies/mexico/insurgentes.png" },
      { name: "Calls", logo: "/assets/allies/mexico/calls.png" },
      { name: "UNIDEP", logo: "/assets/allies/mexico/unidep.png" },
      { name: "ICEL", logo: "/assets/allies/mexico/icel.png" },
      { name: "ECD", logo: "/assets/allies/mexico/ecd.png" },
      { name: "ecatepac", logo: "/assets/allies/mexico/ecatepac.png" },
      { name: "univer", logo: "/assets/allies/mexico/univer.png" },
      { name: "Autofin", logo: "/assets/allies/mexico/autofin.png" },
      { name: "Pulser Education", logo: "/assets/allies/mexico/pulser.webp" },
      { name: "Brain Network", logo: "/assets/allies/mexico/fkt.png" },
      { name: "UB", logo: "/assets/allies/mexico/britanica.png" },
      { name: "Vasconcelos", logo: "/assets/allies/mexico/vasconcelos.png" },
    ],
  },
  {
    country: "ARGENTINA",
    brands: [
      { name: "AAARBA", logo: "/assets/allies/argentina/aaarba.png" },
      { name: "Clínica de Cuyo", logo: "/assets/allies/argentina/cuyo.svg" },
      { name: "Comunicaciones del Sol", logo: "/assets/allies/argentina/comdelsol.webp" },
    ],
  },
  {
    country: "PARAGUAY",
    brands: [
      { name: "CrediSolución", logo: "/assets/allies/paraguay/credisolucion.png" },
      { name: "Sistemas y Gestiones", logo: "/assets/allies/paraguay/sistemasygestiones.png" },
      { name: "Code100", logo: "/assets/allies/paraguay/code100.webp" },
    ],
  },
  {
    country: "COSTA RICA, REPÚBLICA DOMINICANA, VENEZUELA, EL SALVADOR",
    brands: [
      { name: "Dr. Max", logo: "/assets/allies/paraguay/drmax.png" },
      { name: "Medismart", logo: "/assets/allies/paraguay/medismart.png" },
      { name: "Artelec", logo: "/assets/allies/rest/artelec.png" },
      { name: "OnCall", logo: "/assets/allies/rest/oncall.png" },
      { name: "Puntual", logo: "/assets/allies/rest/puntual.png" },
      { name: "1000Tips", logo: "/assets/allies/rest/scc.png" },
    ],
  },
];

const Allies: React.FC = () => {
  return (
    <section id="clientes" className="py-16 px-10 bg-white">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl uppercase font-bold mb-4 text-center text-maydayDarker">
          MAYDAY GLOBAL ES EL ALIADO ESTRATÉGICO DE IMPORTANTES <br />
          EMPRESAS EN DIVERSOS SECTORES.
        </h2>
        <p className="text-center mb-12 text-maydayDarker">
          Algunas de las organizaciones que han confiado en nuestras soluciones
          son:
        </p>

        {alliesData.map((group, groupIndex) => (
          <AlliesGroup key={group.country} group={group} index={groupIndex} />
        ))}
      </div>
    </section>
  );
};

interface AlliesGroupProps {
  group: {
    country: string;
    brands: { name: string; logo: string }[];
  };
  index: number;
}

const AlliesGroup: React.FC<AlliesGroupProps> = ({ group, index }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div className="md:px-40 mb-16" ref={ref}>
      <h3 className="text-xl font-medium text-center mb-8 text-[#8A8A8A]">
        {group.country}
      </h3>

      <motion.div
        className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-8"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{
          duration: 0.8,
          staggerChildren: 0.1,
          delayChildren: 0.1 * index,
        }}
      >
        {group.brands.map((brand, brandIndex) => (
          <motion.div
            key={`${brand.name}-${brandIndex}`}
            className="flex-shrink-0 h-24 w-36 sm:w-40 flex items-center justify-center p-2 sm:p-4 rounded-lg transition-transform duration-300 hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: 0.5,
              delay: 0.1 * brandIndex,
            }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={brand.logo}
                alt={brand.name}
                width={120}
                height={70}
                style={{ objectFit: "contain", maxWidth: "100%" }}
                className="filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Allies;
