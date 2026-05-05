import { FeatureItem } from "@/components/ProductsIntern/ProductsIntern";
import { DEMO_WHATSAPP_URL } from "@/lib/utils";

export const features: FeatureItem[] = [
  {
    id: 1,
    title: ["LLAMADAS AUTOMATIZADAS 24/7", "VOCES SINTÉTICAS NATURALES"],
    description: [
      "Gestiona miles de llamadas entrantes y salientes de forma simultánea, sin tiempos de espera ni agentes disponibles. Nuestro VoiceBot opera sin interrupciones las 24 horas, resolviendo consultas, validando datos y guiando al usuario en cada paso del proceso con respuestas precisas e inmediatas.",
      "Las conversaciones suenan naturales y fluidas gracias a síntesis de voz de última generación. El sistema adapta el tono, ritmo y entonación para ofrecer una experiencia cercana al humano, mejorando la percepción de tu marca y la satisfacción del cliente.",
    ],
    layout: "image-text-text",
    image: "/assets/voicebot/voicebot-hero.png",
    hasBorder: false,
    link: DEMO_WHATSAPP_URL,
  },
  {
    id: 2,
    title: "Reconocimiento de Voz e Intención (ASR + NLP)",
    description:
      "El VoiceBot comprende el lenguaje natural del usuario en tiempo real. Mediante tecnologías de reconocimiento automático de voz (ASR) y procesamiento de lenguaje natural (NLP), identifica la intención detrás de cada frase, incluso en contextos coloquiales, acentos regionales o frases incompletas, garantizando interacciones efectivas.",
    layout: "text-image",
    image: "/assets/products/product-2b.png",
  },
  {
    id: 3,
    title: "Analítica en tiempo real",
    bullets: [
      "Accedé a métricas detalladas de cada interacción: duración, intención detectada, tasa de resolución y satisfacción del cliente. Los dashboards en tiempo real permiten optimizar flujos, identificar cuellos de botella y tomar decisiones basadas en datos.",
      "Integrá el VoiceBot con tu CRM, plataforma omnicanal o sistemas internos para enriquecer cada conversación con contexto del cliente y registrar automáticamente los resultados de cada llamada.",
    ],
    description: "",
    layout: "text-image",
    image: "/assets/ia-bot/image-3.png",
  },
];

export const solutionsFeatures: FeatureItem[] = [
  {
    id: 1,
    title: "CAMPAÑAS DE LLAMADAS SALIENTES",
    description:
      "Automatizá cobranzas, recordatorios de turnos, encuestas de satisfacción y campañas de ventas con llamadas proactivas gestionadas por IA.",
    layout: "text-text",
    imgUrl: "/assets/ia-bot/whatsapp.svg",
    hasBorder: true,
  },
  {
    id: 2,
    title: "INTEGRACIÓN CON IVR Y CONTACT CENTER",
    description:
      "Reemplazá o complementá tu IVR tradicional con flujos conversacionales inteligentes. Compatible con las principales plataformas de contact center del mercado.",
    layout: "text-text",
    imgUrl: "/assets/ia-bot/mail.svg",
    hasBorder: true,
  },
];
