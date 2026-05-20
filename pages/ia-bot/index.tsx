import { InternHero } from "@/components/InternHero/InternHero";
import React from "react";
import ProductsIntern from "@/components/ProductsIntern/ProductsIntern";
import { features } from "@/lib/data/ia-bot";
import InternBanner from "@/components/InternBanner/InternBanner";
import AgentsCards from "@/components/AgentsCards/AgentsCards";

const IaBot = () => {
  return (
    <div className="w-full">
      <InternHero
        title="IA Bot"
        description="Gestiona conversaciones y procesos de manera autónoma con agentes de IA en WhatsApp, Instagram, Webchat, TikTok, Callbots y Mailbots."
        imageUrl="/assets/ia-bot/robot.png"
      />

      <ProductsIntern features={features} />

      <InternBanner
        title="Recomendado por los usuarios en G2"
        image="/assets/ia-bot/recomendado.png"
        centeredImage
      />

      <AgentsCards />
    </div>
  );
};

export default IaBot;
