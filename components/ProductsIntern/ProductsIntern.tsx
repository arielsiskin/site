"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { HeroHighlight } from "../UI/HeroHighlight";
import Button from "../Button/Button";

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
    threshold: 0.1,
    triggerOnce: true,
  });

  const renderTextContent = (
    item: FeatureItem,
    index: number,
    isSecondary = false
  ) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`flex flex-col justify-center p-8  ${
        item.hasBorder ? "border-2 p-[32px] border-gray-200 rounded-[30px]" : ""
      }`}
    >
      {(item.link || item.imgUrl) && (
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
          <h3 className="text-xl uppercase md:text-3xl text-mayday mb-4">
            {item.title[isSecondary ? 1 : 0]}
          </h3>
          <p className="text-maydayDarker text-sm md:text-lg mb-4">
            {item.description[isSecondary ? 1 : 0]}
          </p>
        </>
      ) : (
        <>
          <h3 className="text-xl uppercase md:text-3xl text-mayday mb-4">{item.title}</h3>
          <p className="text-maydayDarker text-sm md:text-lg mb-4">
            {item.description}
          </p>
        </>
      )}
      {item.bullets && (
        <ul className="space-y-2">
          {item.bullets.map((bullet, bulletIndex) => (
            <motion.li
              key={bulletIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: (index + bulletIndex) * 0.1 }}
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

  const renderImageContent = (item: FeatureItem, index: number) =>
    item.image && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={
          inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
        }
        transition={{ duration: 0.6, delay: index * 0.1 }}
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={
                  inView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.95 }
                }
                transition={{ duration: 0.6, delay: i * 0.1 }}
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
              {renderImageContent(currentFeature, i)}
              <div className="grid grid-cols-1 gap-8">
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
              <div className="grid grid-cols-1 gap-8">
                {renderTextContent(currentFeature, i)}
                {renderTextContent(currentFeature, i, true)}
              </div>
              {renderImageContent(currentFeature, i)}
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
    <div ref={ref} className="w-full px-4 py-16 md:py-24">
      <HeroHighlight subtleDots>
        <div className="max-w-[1196px] mx-auto">{renderFeatures()}</div>

        {askDemo && (
          <div className="w-full flex justify-center mb-[8rem]">
            <Button>Solicitar demo</Button>
          </div>
        )}
      </HeroHighlight>
    </div>
  );
};

export default ProductFeatures;
