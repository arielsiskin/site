import { InternHero } from "@/components/InternHero/InternHero";
import React from "react";
import ProductsIntern from "@/components/ProductsIntern/ProductsIntern";
import { features, solutionsFeatures } from "@/lib/data/voicebot";
import InternBanner from "@/components/InternBanner/InternBanner";

const Voicebot = () => {
  return (
    <div className="w-full">
      <InternHero
        title="VoiceBot"
        description="Automatizá tus llamadas entrantes y salientes con inteligencia artificial. Convierte cada interacción telefónica en una experiencia fluida, eficiente y disponible las 24 horas."
        imageUrl="/assets/voicebot/voicebot-hero.jpg"
      />

      <ProductsIntern features={features} />

      <InternBanner
        title="Tecnología de Voz con IA Avanzada"
        features={[
          "Reconocimiento de voz, síntesis natural, NLP avanzado e integración nativa con tus sistemas.",
        ]}
      />

      <ProductsIntern features={solutionsFeatures} askDemo={true} />
    </div>
  );
};

export default Voicebot;
