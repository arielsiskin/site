import { InternHero } from "@/components/InternHero/InternHero";
import ProductsIntern from "@/components/ProductsIntern/ProductsIntern";
import { features, solutionsFeatures } from "@/lib/data/synergy-wfm";
import InternBanner from "@/components/InternBanner/InternBanner";

const SynergyWfm = () => {
  return (
    <div>
      <InternHero
        title="Synergy WFM"
        description="Ofrecemos una plataforma que optimiza la asignación de recursos y la productividad de tu equipo."
        imageUrl="/assets/products/product-2.png"
      />

      <ProductsIntern features={features} />

      <InternBanner
        title="Planificación Estratégica para Contact Centers"
        features={["Con pronósticos asertivos y medición de objetivos."]}
        image="/assets/synergy-wfm/banner-1.png"
      />

      <ProductsIntern features={solutionsFeatures} askDemo={true} />
    </div>
  );
};

export default SynergyWfm;
