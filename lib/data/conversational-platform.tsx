import { FeatureItem } from "@/components/ProductsIntern/ProductsIntern";

export const features: FeatureItem[] = [
  {
    id: 1,
    title: "Integración multicanal",
    description:
      "permite una gestión centralizada de todos tus canales de comunicación en una sola plataforma. WhatsApp, Facebook Messenger, Instagram, SMS, email y muchos más se integran de forma nativa, garantizando una experiencia fluida, continua y sin saltos para tus clientes.",
    layout: "text-image",
    image: "/assets/conversational-platform/image-1.png",
  },
  {
    id: 2,
    title: "Automatización inteligente  ",
    description:
      "La plataforma incorpora potentes herramientas de automatización que permiten diseñar asistentes virtuales y chatbots inteligentes, capaces de resolver consultas, guiar procesos y escalar conversaciones de forma autónoma.",
    layout: "image-text",
    image: "/assets/conversational-platform/image-2.png",
  },
];

export const solutionsFeatures: FeatureItem[] = [
  {
    id: 1,
    title: ["Analítica avanzada", "Seguridad certificada"],
    description: [
      "La solución incorpora herramientas de business intelligence integradas que brindan visibilidad sobre el rendimiento de canales, equipos y procesos. Con datos en tiempo real y métricas clave,  permite tomar decisiones basadas en información precisa.",
      "Garantizamos una operación segura y confiable mediante la adopción de estándares de seguridad de nivel internacional, incluyendo PCI-DSS 3.2.1, lo que asegura la protección de los datos sensibles de tus clientes.",
    ],
    layout: "text-text-image", // Instead of "image-text-text"
    image: "/assets/conversational-platform/image-3.png",
  },
];
