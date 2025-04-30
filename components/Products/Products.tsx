import React from "react";
import { productList } from "@/lib/data/products";
import Card from "../Brands/Card/Card";
import { HeroHighlight } from "../UI/HeroHighlight";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { TextGenerateEffect } from "../UI/TextGenerateEffect";

const Products = () => {
  // Animation variants for individual items
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };
  const words = [
    "No solo ofrecemos tecnología, sino que diseñamos",
    "soluciones estratégicas para resolver tus desafíos",
    "específicos y acelerar tu crecimiento.",
  ];
  return (
    <HeroHighlight subtleDots>
      <div
        id="soluciones"
        className="w-full mx-auto sm:mt-10 md:mt-0 2xl:mt-20 lg:w-[900px] 2xl:w-[1196px] relative"
      >
        <div className="p-10 flex items-center justify-center text-primary">
          <h3 className="text-md lg:text-2xl font-normal uppercase text-center">
            {words.map((text, index) => (
              <TextGenerateEffect
                key={index}
                duration={1.5}
                words={text}
                boldWords={index === 1 ? ["soluciones", "estratégicas"] : []}
              />
            ))}
          </h3>
        </div>

        <div className="w-full first:pt-0">
          {productList.map((product, index) => {
            // Use react-intersection-observer for individual control
            const [ref, inView] = useInView({
              triggerOnce: true,
              threshold: 0.15,
              rootMargin: "-10px 0px",
            });

            return (
              <motion.div
                key={product.id}
                ref={ref}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={itemVariants}
                className="mb-8 md:mb-12"
              >
                <Card
                  textPosition={product.textPosition}
                  mode={product.mode}
                  imageUrl={product.imageUrl}
                  ctaUrl={product.ctaUrl}
                  legend={product.legend}
                  title={product.title}
                  description={product.description}
                  ctaText={"MÁS DETALLES"}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </HeroHighlight>
  );
};

export default Products;
