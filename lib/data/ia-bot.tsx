import { FeatureItem } from "@/components/ProductsIntern/ProductsIntern";

export const features: FeatureItem[] = [
  {
    id: 1,
    title: ["ATENCIÓN 24/7", "VIDEOLLAMADAS Y ASISTENCIA EN TIEMPO REAL"],
    description: [
      "Ofrece una atención continua y sin interrupciones, brindando respuestas inmediatas, sin necesidad de agentes humanos. Nuestra tecnología conversacional permite resolver consultas, gestionar operaciones y acompañar al usuario en todo momento, mejorando la experiencia del cliente y reduciendo costos operativos.",
      "Potencia tus interacciones con clientes sumando videollamadas directamente desde el chat. Escala conversaciones a canales visuales facilitando el soporte técnico o la demostración de productos. Una solución ideal para ofrecer una experiencia omnicanal fluida y de alto valor agregado.",
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
    bullets: [
      "Accede a métricas en tiempo real para analizar tus interacciones. Además, mediante flujos conversacionales inteligentes podrás automatizar tareas, generar y calificar leads de manera proactiva.",
      "Una herramienta clave para equipos que buscan una evolución constante basada en datos.",
    ],
    description: "",
    layout: "text-image",
    image: "/assets/ia-bot/image-3.png",
  },
  {
    id: 4,
    title: "Procesamiento de Lenguaje Natural (NLP) y Machine Learning",
    description: "La plataforma incorpora tecnologías avanzadas de Procesamiento de Lenguaje Natural (NLP) y Machine Learning para comprender con mayor profundidad la intención detrás de cada mensaje del usuario, incluso en contextos complejos o con lenguaje coloquial.",
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
