"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface InternBannerProps {
  title: string;
  features?: string[];
  image?: string;
  subtitle?: string;
}

export const InternBanner: React.FC<InternBannerProps> = ({
  title,
  features = [],
  image,
  subtitle,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className="w-full bg-[#0A0F29] overflow-hidden">
      <div className="max-w-[100%] mx-auto">
        <div
          className={`grid grid-cols-1 ${
            image ? "lg:grid-cols-2" : "lg:grid-cols-1"
          }`}
        >
          {/* Image - Hidden on mobile */}
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={
                inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
              }
              transition={{ duration: 0.6 }}
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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
            className={`text-white px-4 py-16 md:py-24 md:px-24 ${
              !image && "max-w-4xl mx-auto text-center"
            }`}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-[#04CCDB] uppercase">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg md:text-xl mb-8 text-white opacity-90 ">
                {subtitle}
              </p>
            )}
            {features.length > 0 && (
              <ul
                className={`space-y-4 ${!image && "inline-block text-center"}`}
              >
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={
                      inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                    }
                    transition={{ duration: 0.6, delay: index * 0.1 }}
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InternBanner;
