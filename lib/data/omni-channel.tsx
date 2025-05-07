import { FeatureItem } from "@/components/ProductsIntern/ProductsIntern";
import { DEMO_WHATSAPP_URL } from "@/lib/utils";

export const omniChannelProducts: FeatureItem[] = [
  {
    id: 1,
    title: "CENTRAL TELEFÓNICA WEB",
    description: "para gestionar campañas entrantes, salientes y blending.",
    image: "/assets/omni-channel/product-1.png",
    layout: "text-image", // text on left, image on right
    link: "#",
  },
  {
    id: 2,
    title: "CRM INTEGRADO",
    description:
      "a la central telefónica, 100% customizable según las necesidades operativas de tu empresa.",
    layout: "text-text", // both text sections
    link: "#",
  },
  {
    id: 3,
    title: "WEBRTC",
    description:
      "llamadas directas desde el CRM sin necesidad de aplicaciones externas.",
    layout: "text-text", // both text sections
    link: "#",
  },
  {
    id: 4,
    title: "INTEGRACIÓN NATIVA",
    description:
      "con canales digitales: WhatsApp, Facebook, Instagram, Webchat, Email y más, garantizando una experiencia omnicanal.",
    image: "/assets/omni-channel/product-2.png",
    layout: "image-text", // image on left, text on right
    link: "#",
  },
];

export const omniChannelProducts2: FeatureItem[] = [
  {
    id: 1,
    title: "SOPORTE Y CAPACITACIÓN",
    description:
      "desde el primer día. Nuestro equipo de expertos brinda asistencia personalizada y formación continua para garantizar el máximo rendimento de nuestras tecnologías.",
    image: "/assets/omni-channel/soporte.png",
    layout: "text-image",
    hasBorder: true,
  },
  {
    id: 2,
    title: "INSTALACIÓN RÁPIDA",
    description:
      "Plataforma 100% en la nube GCP (Google Cloud), sin necesidad de infraestructura física.",
    layout: "text-text",
  },
  {
    id: 3,
    title: "ANÁLISIS DE DATOS EN TIEMPO REAL",
    description: "",
    bullets: [
      "+100 reportes built-in para analizar rendimiento.",
      "Integración con Power BI y Tableau para visualización avanzada.",
      "Dashboard unificado con métricas de llamadas y desempeño del equipo.",
    ],
    layout: "text-text",
    link: DEMO_WHATSAPP_URL,
  },
];

