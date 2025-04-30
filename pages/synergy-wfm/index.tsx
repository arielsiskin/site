import { InternHero } from "@/components/InternHero/InternHero";
import ProductsIntern from "@/components/ProductsIntern/ProductsIntern";
import { features, solutionsFeatures } from "@/lib/data/synergy-wfm";
import InternBanner from "@/components/InternBanner/InternBanner";
import SynergyFeatures from "@/components/SynergyFeatures/SynergyFeatures";
import SynergyWorkers from "@/components/SynergyWorkers/SynergyWorkers";

const SynergyWfm = () => {
  return (
    <div>
      <InternHero
        title="Synergy WFM"
        descriptionList={[
          "Ofrecemos una plataforma integral y colaborativa de",
          "gestión de contact center",
          "Optimice sus tiempos y costros aumentando el control sobre la",
          "performance de los equipos de trabajo",
        ]}
        imageUrl="/assets/products/product-2b.png"
        width={600}
      />
      <SynergyWorkers />

      <ProductsIntern features={features} />

      <InternBanner
        title="Synergy está desarrollado sobre AWS"
        features={[
          "Servicio 100% seguro",
          "SLA alto y estable ",
          "Desempeño ágil y dinámico.",
        ]}
        image="/assets/synergy-wfm/banner-1.png"
        logoImage="/assets/synergy-wfm/aws.png"
      />

      <SynergyFeatures
        features={[
          { text: "Genera métricas unificadas" },
          { text: "Implementación rápida y personalizada" },
          { text: "Servicio de Soporte online 7×24" },
          { text: "Cuenta con KPIs y dashboards customizables" },
          { text: "Permite planificar y predecir resultados de gestión" },
        ]}
      />
    </div>
  );
};

export default SynergyWfm;
