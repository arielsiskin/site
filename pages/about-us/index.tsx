import React from "react";
import { InternHero } from "@/components/InternHero/InternHero";
import { aboutUsFeatures } from "@/lib/data/about-us";
import ProductFeatures from "@/components/ProductsIntern/ProductsIntern";

function AboutUs() {
  return (
    <div>
      <InternHero
        title="Por qué elegirnos"
        imageUrl="/assets/about-us/hero.jpg"
        descriptionList={[
          "Somos un equipo apasionado por crear",
          "soluciones tecnológicas innovadoras",
          "que transforman la experiencia del cliente",
        ]}
        width={600}
      />

      {/* Features Section */}
      <ProductFeatures features={aboutUsFeatures} />
    </div>
  );
}

export default AboutUs;
