import React from "react";
import ProductsIntern from "@/components/ProductsIntern/ProductsIntern";
import { InternHero } from "@/components/InternHero/InternHero";
import { InternBanner } from "@/components/InternBanner/InternBanner";
import {
  omniChannelProducts,
  omniChannelProducts2,
} from "@/lib/data/omni-channel";

const OmniChannel = () => {
  return (
    <div className="w-full">
      <InternHero
        title="Omnichannel Solution"
        description="Mayday Global ofrece una solución All-in-One que integra telefonía, CRM y canales digitales en una sola plataforma, brindando una experiencia conectada para el cliente y un excelente servicio postventa."
        imageUrl="/assets/products/product-1.png"
      />
      <ProductsIntern features={omniChannelProducts} />

      <InternBanner
        title="Automatización Inteligente con IVR y Discadores:"
        image="/assets/omni-channel/banner-1.png"
        features={[
          "IVR inteligente, priorización de atención y autogestión.",
          "Discador predictivo, progresivo y preview, maximizando contactos efectivos.",
        ]}
      />

      <ProductsIntern features={omniChannelProducts2} askDemo={true} />
    </div>
  );
};

export default OmniChannel;
