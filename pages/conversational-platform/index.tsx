import { InternHero } from "@/components/InternHero/InternHero";
import ProductsIntern from "@/components/ProductsIntern/ProductsIntern";
import {
  features,
  solutionsFeatures,
} from "@/lib/data/conversational-platform";
import InternBanner from "@/components/InternBanner/InternBanner";

const index = () => {
  return (
    <div className="w-full">
      <InternHero
        title="Conversational Platform"
        description="Ofrecemos una eficiente plataforma integral de atención al cliente que optimiza la comunicación multicanal ideada para transacciones de comerciales."
        imageUrl="/assets/products/product-4.png"
      />

      <ProductsIntern features={features} />

      <InternBanner
        title="Plataforma educativa Learning Experience"
        features={["para facilitar el aprendizaje."]}
        image="/assets/conversational-platform/banner-1.png"
      />

      <ProductsIntern features={solutionsFeatures} askDemo={true} />
    </div>
  );
};

export default index;
