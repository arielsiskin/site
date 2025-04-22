import React from "react";
import { HeroHighlight } from "../UI/HeroHighlight";
import Card from "../Brands/Card/Card";

interface InternHeroProps {
  title: string;
  description: string;
  imageUrl: string;
  ctaUrl?: string;
}

export const InternHero: React.FC<InternHeroProps> = ({
  title,
  description,
  imageUrl,
  ctaUrl = "/",
}) => {
  return (
    <HeroHighlight
      subtleDots
      containerClassName="bg-[linear-gradient(0.72deg,rgba(42,68,158,0)_3.72%,#2A449E_42.95%,#000000_77.1%)]"
    >
      <div className="md:mt-10 2xl:mt-40 w-[100vw] md:w-[700px] lg:w-[900px] 2xl:w-[1196px]">
        <Card
          textPosition="left"
          mode="light"
          imageUrl={imageUrl}
          legend=""
          title={title}
          description={description}
          ctaUrl={ctaUrl}
          width={320}
          ctaText="Solicitar demo"
        />
      </div>
    </HeroHighlight>
  );
};
