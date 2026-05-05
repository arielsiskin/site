import Link from "next/link";
import React from "react";
import Button from "../../Button/Button";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { DEMO_WHATSAPP_URL } from "@/lib/utils";

interface Props {
  textPosition: string;
  mode: string;
  imageUrl: string;
  legend: string;
  title: string;
  ctaUrl: string;
  description: string;
  descriptionList?: string[];
  ctaText?: string;
  width?: number;
}

const Card = ({
  textPosition,
  mode,
  imageUrl,
  legend,
  title,
  description,
  descriptionList,
  ctaUrl,
  ctaText,
  width,
}: Props) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
    rootMargin: "-50px",
  });

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
        delay: 0.2,
      },
    },
  };

  const legendVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.1,
      },
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
        delay: 0.3,
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
        delay: 0.3 + i * 0.1,
      },
    }),
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
        delay: 0.5,
      },
    },
  };

  return (
    <div
      ref={ref}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className={`relative container w-[100%] md:w-[80%] lg:w-[900px] 2xl:w-[1196px] h-[406px] md:h-[300px] lg:h-[420px] 2xl:h-[640px] mx-auto md:mt-10 md:rounded-sm overflow-hidden`}
    >
      {/* Overlay: dark on mobile, transparent on md+ */}
      <div className="absolute inset-0 bg-black/60 md:bg-transparent z-10 transition-colors duration-300" />
      {/* Responsive Content */}
      {/* Mobile: bottom overlay, centered */}
      <div className="absolute z-20 flex flex-col justify-center w-[70%] md:w-full h-full p-6 md:hidden bottom-0 left-0">
        <motion.span
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={legendVariants}
          className="text-xs font-medium uppercase text-white opacity-80 mb-4 md:mb-2 tracking-wide"
        >
          {legend}
        </motion.span>
        <motion.h2
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={titleVariants}
          className="text-2xl font-extrabold text-white mb-4 leading-tight md:mb-2"
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={descriptionVariants}
            className="text-sm text-white mb-4 md:mb-2"
          >
            {description}
          </motion.p>
        )}

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={buttonVariants}
        >
          <Link 
            href={ctaText === "Solicitar demo" ? DEMO_WHATSAPP_URL : ctaUrl} 
            className="w-full flex"
            target={ctaText === "Solicitar demo" ? "_blank" : undefined}
            rel={ctaText === "Solicitar demo" ? "noopener noreferrer" : undefined}
          >
            <Button>{ctaText || "Ver más"}</Button>
          </Link>
        </motion.div>
      </div>
      {/* md+ version: side-aligned, original logic */}
      <div
        className={`hidden md:flex flex-col gap-3 absolute z-20
          ${
            textPosition === "left"
              ? "top-1/2 -translate-y-1/2 left-[60px] lg:left-[125px]"
              : "top-1/2 -translate-y-1/2 right-[60px] lg:right-[125px]"
          }
          ${width ? `w-[${width}px]` : "w-[40%]"}`}
      >
        <motion.h3
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={legendVariants}
          className="text-xs lg:text-lg font-normal uppercase text-white"
        >
          {legend}
        </motion.h3>
        <motion.h2
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={titleVariants}
          className="text-lg lg:text-[3rem] leading-[1] font-black uppercase text-white"
        >
          {title}
        </motion.h2>
        {descriptionList && descriptionList.length > 0 && (
          <div>
            {descriptionList.map((item, index) => (
              <motion.p
                key={item}
                custom={index}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={listItemVariants}
                className="text-sm md:text-lg leading-[1] text-white"
              >
                <span>{item}</span>
              </motion.p>
            ))}
          </div>
        )}
        <motion.p
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={descriptionVariants}
          className="text-xs lg:text-lg text-white"
          style={width ? { width: `${width}px` } : {}}
        >
          {description}
        </motion.p>
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={buttonVariants}
        >
          <Link 
            href={ctaText === "Solicitar demo" ? DEMO_WHATSAPP_URL : ctaUrl} 
            className="text-primary"
            target={ctaText === "Solicitar demo" ? "_blank" : undefined}
            rel={ctaText === "Solicitar demo" ? "noopener noreferrer" : undefined}
          >
            <Button>{ctaText || "Ver más"}</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Card;
