import { InternHero } from "@/components/InternHero/InternHero";
import React from "react";
import ProductsIntern from "@/components/ProductsIntern/ProductsIntern";
import { features, solutionsFeatures } from "@/lib/data/ia-bot";
import InternBanner from "@/components/InternBanner/InternBanner";

const IaBot = () => {
  return (
    <div className="w-full">
      <InternHero
        title="IA Bot"
        description="Tenemos la solución más confiable para automatizar tu atención al cliente con bots inteligentes, mejorando la experiencia del usuario y reduciendo costos operativos."
        imageUrl="/assets/products/product-3.png"
      />

      <ProductsIntern features={features} />

      <InternBanner
        title="Más de 20 canales conectados"
        features={[
          "WhatsApp, Webchat, e-mail, redes, Telegram, Slack, Microsoft Teams y más.",
        ]}
      />

      <ProductsIntern features={solutionsFeatures} askDemo={true} />
    </div>
  );
};

export default IaBot;
