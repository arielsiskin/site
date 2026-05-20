import { FeatureItem } from "@/components/ProductsIntern/ProductsIntern";
import { DEMO_WHATSAPP_URL } from "@/lib/utils";

export const features: FeatureItem[] = [
  {
    id: 1,
    title: "INTELIGENCIA EN CADA CONVERSACIÓN",
    description:
      "Diseña, orquesta y supervisa agentes autónomos que resuelven ventas, atención y operaciones a escala. Nuestros agentes IA entienden, deciden y resuelven.",
    layout: "text-image",
    image: "/assets/ia-bot/orquestador.png",
    link: DEMO_WHATSAPP_URL,
  },
  {
    id: 2,
    title: "CONECTA TODOS TUS CANALES DIGITALES",
    description:
      "Conversa con tus clientes a través de WhatsApp, Instagram, TikTok, E-mail y Teléfono y conéctalo nativamente con tu CRM, ERP, Sistemas de Pago o API Propia.",
    layout: "image-text",
    image: "/assets/ia-bot/redes_sociales.png",
  },
  {
    id: 4,
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
    id: 5,
    title: "Procesamiento de Lenguaje Natural (NLP) y Machine Learning",
    description:
      "La plataforma incorpora tecnologías avanzadas de Procesamiento de Lenguaje Natural (NLP) y Machine Learning para comprender con mayor profundidad la intención detrás de cada mensaje del usuario, incluso en contextos complejos o con lenguaje coloquial.",
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
    image: "/assets/icons/whatsapp.svg",
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
