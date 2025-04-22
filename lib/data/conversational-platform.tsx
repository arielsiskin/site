import { FeatureItem } from "@/components/ProductsIntern/ProductsIntern";

export const features: FeatureItem[] = [
  {
    id: 1,
    title: "Integración multicanal",
    description:
      "WhatsApp, Facebook Messenger, Instagram, SMS, email, entre otros.",
    layout: "text-image",
    image: "/assets/conversational-platform/image-1.png",
  },
  {
    id: 2,
    title: "Automatización inteligente  ",
    description: "con asistentes virtuales y chatbots.",
    layout: "image-text",
    image: "/assets/conversational-platform/image-2.png",
  },
];

export const solutionsFeatures: FeatureItem[] = [
  {
    id: 1,
    title: ["Analítica avanzada", "Seguridad certificada"],
    description: [
      "con dashboards personalizables.",
      "con estándares como PCI-DSS 3.2.1.",
    ],
    layout: "text-text-image", // Instead of "image-text-text"
    image: "/assets/conversational-platform/image-3.png",
  },
];
