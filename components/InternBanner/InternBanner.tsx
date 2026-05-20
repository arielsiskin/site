"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface InternBannerProps {
  title: string;
  features?: string[];
  image?: string;
  subtitle?: string;
  logoImage?: string;
  imageRight?: boolean;
  centeredImage?: boolean;
}

export const InternBanner: React.FC<InternBannerProps> = ({
  title,
  features = [],
  image,
  subtitle,
  logoImage,
  imageRight = false,
  centeredImage = false,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
    rootMargin: "-50px",
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.92, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 18,
        duration: 0.9,
      },
    },
  };

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
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: i * 0.1,
        duration: 0.6,
      },
    }),
  };

  return (
    <motion.div
      ref={ref}
      className="w-full bg-[#0A0F29] overflow-hidden"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="max-w-[100%] mx-auto">

        {/* Centered mode: title above, image below */}
        {centeredImage ? (
          <div className="flex flex-col items-center text-center px-4 py-16 md:py-20">
            <motion.h2
              variants={titleVariants}
              className="text-2xl md:text-4xl font-bold mb-10 text-[#04CCDB] uppercase"
            >
              {title}
            </motion.h2>
            {image && (
              <motion.div
                variants={imageVariants}
                className="w-full max-w-3xl"
              >
                <img
                  src={image}
                  alt={title}
                  className="w-full object-contain"
                />
              </motion.div>
            )}
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 ${
              image && !imageRight
                ? "lg:grid-cols-2"
                : image && imageRight
                ? "lg:grid-cols-[1fr,1.5fr]"
                : "lg:grid-cols-1"
            }`}
          >
            {/* Image Left */}
            {image && !imageRight && (
              <motion.div
                variants={imageVariants}
                className="hidden lg:block relative h-full min-h-[500px]"
              >
                <img
                  src={image}
                  alt="Banner illustration"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </motion.div>
            )}

            {/* Text Content */}
            <div
              className={`text-white px-4 py-16 md:py-24 md:px-24 ${
                !image && "max-w-4xl mx-auto text-center"
              }`}
            >
              {logoImage && (
                <motion.div variants={titleVariants} className="mb-6">
                  <img src={logoImage} alt="Logo" className="h-16 w-auto" />
                </motion.div>
              )}
              <motion.h2
                variants={titleVariants}
                className="text-2xl md:text-4xl font-bold mb-4 text-[#04CCDB] uppercase"
              >
                {title}
              </motion.h2>
              {subtitle && (
                <motion.p
                  variants={titleVariants}
                  className="text-lg md:text-xl mb-8 text-white opacity-90"
                >
                  {subtitle}
                </motion.p>
              )}
              {features.length > 0 && (
                <ul
                  className={`space-y-4 ${!image && "inline-block text-center"}`}
                >
                  {features.map((feature, index) => (
                    <motion.li
                      key={index}
                      custom={index}
                      variants={featureVariants}
                      className="flex items-start space-x-2"
                    >
                      <span className="text-[#00E5FF] mt-1">•</span>
                      <span className="text-sm md:text-base w-[300px]">
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Image Right */}
            {image && imageRight && (
              <motion.div
                variants={imageVariants}
                className="hidden lg:flex items-center justify-center px-8 py-12"
              >
                <img
                  src={image}
                  alt="Banner illustration"
                  className="w-full max-h-[360px] object-contain"
                />
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default InternBanner;
