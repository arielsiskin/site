import { FeatureItem } from "@/components/ProductsIntern/ProductsIntern";

export const features: FeatureItem[] = [
  {
    id: 1,
    title: ["ATENCIÓN 24/7", "VIDEOLLAMADAS Y ASISTENCIA EN TIEMPO REAL"],
    description: [
      "sin necesidad de agentes humanos.",
      "agrega llamadas y videos a tus chats.",
    ],
    layout: "image-text-text",
    image: "/assets/ia-bot/image-1.png",
    hasBorder: false,
    link: "/demo",
  },
  {
    id: 2,
    title: "Analytics Dashboard",
    description: "",
    layout: "full-image",
    image: "/assets/ia-bot/image-2.png",
  },
  {
    id: 3,
    title: "Análisis y Optimización Contínua",
    description:
      "métricas en tiempo real y generación de leads con flujos inteligentes.",
    layout: "text-image",
    image: "/assets/ia-bot/image-3.png",
  },
  {
    id: 4,
    title: "Procesamiento de Lenguaje Natural (NLP) y Machine Learning",
    description: "para respuestas más precisas.",
    layout: "image-text",
    image: "/assets/ia-bot/image-4.png",
  },
];

export const solutionsFeatures: FeatureItem[] = [
  {
    id: 1,
    title: "WHATSAPP SOLUTION PROVIDER OFICIAL",
    description:
      "con API certificada para una implementación segura y escalable.",
    layout: "text-text",
    image: "/assets/icons/whatsapp.svg", // You can still use the image prop for the icon
    imgUrl: "/assets/ia-bot/whatsapp.svg",
    hasBorder: true,
  },
  {
    id: 2,
    title: "MAILBOTS INTELIGENTES",
    description:
      "que automatizan respuestas, gestionan flujos de correos y optimizan la atención vía email.",
    layout: "text-text",
    image: "/assets/icons/mailbot.svg",
    imgUrl: "/assets/ia-bot/mail.svg",
    hasBorder: true,
  },
];
