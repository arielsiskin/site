"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { HeroHighlight } from "../UI/HeroHighlight";
import Button from "../Button/Button";
import { DEMO_WHATSAPP_URL } from "@/lib/utils";

export interface FeatureItem {
  id: number;
  title: string | string[];
  description: string | string[];
  link?: string;
  bullets?: string[];
  hasBorder?: boolean;
  layout:
    | "text-image"
    | "image-text"
    | "text-text"
    | "image-text-text"
    | "text-text-image"
    | "full-image";
  image?: string;
  imgUrl?: string;
  imgUrls?: string[];
  imgLabels?: string[];
}

interface ProductFeaturesProps {
  features: FeatureItem[];
  askDemo?: boolean;
}

export const ProductFeatures: React.FC<ProductFeaturesProps> = ({
  features,
  askDemo = false,
}) => {
  const { ref, inView } = useInView({
    threshold: [0, 0.1, 0.2, 0.3],
    triggerOnce: true,
    rootMargin: "50px",
  });

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const textContentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1,
        duration: 0.6,
      },
    }),
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (index: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1,
        duration: 0.7,
      },
    }),
  };

  const bulletVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (delay: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: delay * 0.1,
        duration: 0.5,
      },
    }),
  };

  const renderTextContent = (
    item: FeatureItem,
    index: number,
    isSecondary = false
  ) => {
    const isCentered = !!(item.imgUrls && item.imgUrls.length >= 2);
    return (
    <motion.div
      custom={index}
      variants={textContentVariants}
      className={`flex flex-col justify-center p-8 ${isCentered ? "items-center text-center" : ""} ${
        item.hasBorder ? "border-2 p-[32px] border-gray-200 rounded-[30px]" : ""
      }`}
    >
      {(item.link || item.imgUrl) && !(item.imgUrls?.length) && (
        <motion.div whileHover={{ x: 5 }} className={`my-4`}>
          <Link
            href={item.link || "#"}
            className="text-primary font-medium flex items-center"
          >
            <img
              src={item.imgUrl ? item.imgUrl : "/assets/omni-channel/link.png"}
              alt=""
            />
          </Link>
        </motion.div>
      )}
      {Array.isArray(item.title) && Array.isArray(item.description) ? (
        <>
          <motion.h3 className="text-xl uppercase md:text-3xl text-mayday mb-4">
            {item.title[isSecondary ? 1 : 0]}
          </motion.h3>
          <motion.p className="text-maydayDarker text-sm md:text-lg mb-4">
            {item.description[isSecondary ? 1 : 0]}
          </motion.p>
        </>
      ) : (
        <>
          <motion.h3 className="text-xl uppercase md:text-3xl text-mayday mb-4">
            {item.title}
          </motion.h3>
          <motion.p className="text-maydayDarker text-sm md:text-lg mb-4">
            {item.description}
          </motion.p>
        </>
      )}
      {item.bullets && (
        <ul className="space-y-2">
          {item.bullets.map((bullet, bulletIndex) => (
            <motion.li
              key={bulletIndex}
              custom={index + bulletIndex * 0.1}
              variants={bulletVariants}
              className="flex items-start space-x-2"
            >
              <span className="text-maydayDarker mt-1">•</span>
              <span className="text-maydayDarker text-sm md:text-base">
                {bullet}
              </span>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
  };

  const renderImageContent = (item: FeatureItem, index: number) =>
    item.image && (
      <motion.div
        custom={index}
        variants={imageVariants}
        className="relative h-full min-h-[300px]"
      >
        <img
          src={item.image}
          alt={Array.isArray(item.title) ? item.title[0] : item.title}
          className="w-full h-full object-contain"
        />
      </motion.div>
    );

  const renderFeatures = () => {
    const result = [];
    let i = 0;

    while (i < features.length) {
      const currentFeature = features[i];
      const nextFeature = features[i + 1];

      if (currentFeature.layout === "full-image") {
        result.push(
          <motion.div key={currentFeature.id} className="mb-16 md:mb-24">
            <div className="w-full flex justify-center">
              <motion.div
                custom={i}
                variants={imageVariants}
                className="relative w-full max-w-[594px]"
              >
                <img
                  src={currentFeature.image}
                  alt={
                    Array.isArray(currentFeature.title)
                      ? currentFeature.title[0]
                      : currentFeature.title
                  }
                  className="w-full h-auto object-contain"
                />
              </motion.div>
            </div>
          </motion.div>
        );
        i += 1;
      } else if (
        currentFeature.layout === "text-text" &&
        currentFeature.imgUrls &&
        currentFeature.imgUrls.length >= 2 &&
        nextFeature?.layout !== "text-text"
      ) {
        result.push(
          <motion.div key={currentFeature.id} className="mb-16 md:mb-24">
            <div className="grid grid-cols-1 md:grid-cols-[1fr,1.4fr,1fr] gap-8 items-center">
              <motion.div
                custom={i}
                variants={imageVariants}
                className="flex flex-col items-center gap-3 bg-gray-100 rounded-3xl p-8"
              >
                <img src={currentFeature.imgUrls[0]} alt="" className="h-16 object-contain" />
                {currentFeature.imgLabels?.[0] && (
                  <span className="text-sm text-gray-500 font-medium text-center">{currentFeature.imgLabels[0]}</span>
                )}
              </motion.div>
              {renderTextContent(currentFeature, i)}
              <motion.div
                custom={i + 0.5}
                variants={imageVariants}
                className="flex flex-col items-center gap-3 bg-gray-100 rounded-3xl p-8"
              >
                <img src={currentFeature.imgUrls[1]} alt="" className="h-16 object-contain" />
                {currentFeature.imgLabels?.[1] && (
                  <span className="text-sm text-gray-500 font-medium text-center">{currentFeature.imgLabels[1]}</span>
                )}
              </motion.div>
            </div>
          </motion.div>
        );
        i += 1;
      } else if (
        currentFeature.layout === "text-text" &&
        nextFeature?.layout === "text-text"
      ) {
        result.push(
          <motion.div key={currentFeature.id} className="mb-16 md:mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {renderTextContent(currentFeature, i)}
              {renderTextContent(nextFeature, i + 1)}
            </div>
          </motion.div>
        );
        i += 2;
      } else if (currentFeature.layout === "image-text-text") {
        result.push(
          <motion.div key={currentFeature.id} className="mb-16 md:mb-24">
            <div
              className={`grid grid-cols-1 md:grid-cols-[1fr,2fr] gap-8 items-center ${
                currentFeature.hasBorder
                  ? "border-2 p-[32px] border-gray-200 rounded-[30px]"
                  : ""
              }`}
            >
              <div className="order-2 md:order-1 mb-6 md:mb-0">
                {renderImageContent(currentFeature, i)}
              </div>
              <div className="grid grid-cols-1 gap-6 md:gap-8 order-1 md:order-2">
                {renderTextContent(currentFeature, i)}
                {renderTextContent(currentFeature, i, true)}
              </div>
            </div>
          </motion.div>
        );
        i += 1;
      } else if (currentFeature.layout === "text-text-image") {
        result.push(
          <motion.div key={currentFeature.id} className="mb-16 md:mb-24">
            <div
              className={`grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8 items-center ${
                currentFeature.hasBorder
                  ? "border-2 p-[32px] border-gray-200 rounded-[30px]"
                  : ""
              }`}
            >
              <div className="grid grid-cols-1 gap-6 md:gap-8 order-1">
                {renderTextContent(currentFeature, i)}
                {renderTextContent(currentFeature, i, true)}
              </div>
              <div className="order-2 mt-6 md:mt-0">
                {renderImageContent(currentFeature, i)}
              </div>
            </div>
          </motion.div>
        );
        i += 1;
      } else {
        const content = (
          <motion.div key={currentFeature.id} className="mb-16 md:mb-24">
            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                currentFeature.hasBorder
                  ? "border-2 p-[32px] border-gray-200 rounded-[30px]"
                  : ""
              }`}
            >
              {currentFeature.layout === "text-image" ? (
                <>
                  {renderTextContent(currentFeature, i)}
                  {renderImageContent(currentFeature, i)}
                </>
              ) : (
                <>
                  {renderImageContent(currentFeature, i)}
                  {renderTextContent(currentFeature, i)}
                </>
              )}
            </div>
          </motion.div>
        );
        result.push(content);
        i += 1;
      }
    }

    return result;
  };

  return (
    <motion.div
      ref={ref}
      className="w-full px-4 py-16 md:py-24"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <HeroHighlight subtleDots>
        <div className="max-w-[1196px] mx-auto">{renderFeatures()}</div>

        {askDemo && (
          <motion.div
            variants={textContentVariants}
            custom={features.length}
            className="w-full flex justify-center mb-[8rem]"
          >
            <Link
              href={DEMO_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>Solicitar demo</Button>
            </Link>
          </motion.div>
        )}
      </HeroHighlight>
    </motion.div>
  );
};

export default ProductFeatures;
