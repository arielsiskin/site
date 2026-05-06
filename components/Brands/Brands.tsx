"use client";
import React from "react";
import { HeroHighlight } from "../UI/HeroHighlight";

const Brands = () => {
  const brands = [
    { name: "Botmaker", logo: "/assets/brands/botmaker.svg" },
    { name: "Neotel", logo: "/assets/brands/neotel.svg" },
    { name: "Collaborix", logo: "/assets/brands/collaborix.svg" },
    { name: "Vocalcom", logo: "/assets/brands/vocalcom.png" },
    { name: "WFMOp", logo: "/assets/WFMOp.svg" },
    { name: "Botmaker", logo: "/assets/brands/botmaker.svg" },
    { name: "Neotel", logo: "/assets/brands/neotel.svg" },
    { name: "Collaborix", logo: "/assets/brands/collaborix.svg" },
    { name: "Vocalcom", logo: "/assets/brands/vocalcom.png" },
    { name: "WFMOp", logo: "/assets/WFMOp.svg" },
    // Duplicate for seamless loop
    { name: "Botmaker", logo: "/assets/brands/botmaker.svg" },
    { name: "Neotel", logo: "/assets/brands/neotel.svg" },
    { name: "Collaborix", logo: "/assets/brands/collaborix.svg" },
    { name: "Vocalcom", logo: "/assets/brands/vocalcom.png" },
    { name: "WFMOp", logo: "/assets/WFMOp.svg" },
    { name: "Botmaker", logo: "/assets/brands/botmaker.svg" },
    { name: "Neotel", logo: "/assets/brands/neotel.svg" },
    { name: "Collaborix", logo: "/assets/brands/collaborix.svg" },
    { name: "Vocalcom", logo: "/assets/brands/vocalcom.png" },
    { name: "WFMOp", logo: "/assets/WFMOp.svg" },
  ];

  return (
    <HeroHighlight>
      <div className="w-[100vw] py-10 bg-white overflow-hidden">
        <div className="lg:w-[1196px] uppercase mx-auto mb-10">
          <h3 className="px-10 text-md 2xl:text-2xl font-bold text-center text-primary">
            Marcas líderes que trabajan con nosotros
          </h3>
        </div>

        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee whitespace-nowrap flex items-center">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="mx-14 w-[120px] flex items-center justify-center"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-[37px] object-fit w-full grayscale hover:grayscale-0 transition-all duration-200"
                />
              </div>
            ))}
          </div>

          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="mx-14  w-[120px] flex items-center justify-center"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-[37px] object-fit w-full grayscale hover:grayscale-0 transition-all duration-200"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </HeroHighlight>
  );
};

export default Brands;
