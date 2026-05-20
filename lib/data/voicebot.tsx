import { FeatureItem } from "@/components/ProductsIntern/ProductsIntern";
import { DEMO_WHATSAPP_URL } from "@/lib/utils";

export const features: FeatureItem[] = [
  {
    id: 1,
    title: "RAG CHAT",
    description:
      "Potenciá tu VoiceBot con inteligencia artificial generativa y recuperación aumentada de información. El sistema RAG conecta cada conversación telefónica con tu base de conocimiento empresarial en tiempo real, entregando respuestas precisas, contextualizadas y siempre actualizadas. Sin reentrenamiento, sin demoras: tu bot responde como un experto en cada llamada, maximizando la resolución en el primer contacto y reduciendo la transferencia a agentes humanos.",
    layout: "image-text",
    image: "/assets/voicebot/Rag System.JPG",
    hasBorder: false,
    link: DEMO_WHATSAPP_URL,
  },
  {
    id: 2,
    title: "VOCES SINTÉTICAS NATURALES",
    description:
      "Las conversaciones suenan naturales y fluidas gracias a síntesis de voz de última generación. El sistema adapta el tono, ritmo y entonación para ofrecer una experiencia cercana al humano, mejorando la percepción de tu marca y la satisfacción del cliente.",
    layout: "text-image",
    image: "/assets/voicebot/voicebot-hero.jpg",
    link: DEMO_WHATSAPP_URL,
  },
  {
    id: 5,
    title: "REPORTES DETALLADOS EN TIEMPO REAL",
    description:
      "Accedé a reportes completos de cada interacción telefónica en tiempo real. Cada llamada genera automáticamente un informe con transcripción completa del diálogo, acceso al audio original en línea y métricas de rendimiento por sesión. Tomá decisiones ágiles con información precisa al instante, sin esperar cierres de jornada ni procesos manuales.",
    layout: "image-text",
    image: "/assets/voicebot/Reporte.jfif",
    link: DEMO_WHATSAPP_URL,
  },
  {
    id: 6,
    title: "MÉTRICAS E INTELIGENCIA CONVERSACIONAL",
    description:
      "Transformá cada conversación en datos accionables. Nuestra plataforma consolida estadísticas avanzadas de todas las interacciones incorporando análisis de emociones y sentimiento en tiempo real para entender el estado del cliente más allá de las palabras. Accedé a información consolidada sobre tendencias, patrones de comportamiento y niveles de satisfacción para optimizar continuamente la experiencia y tomar decisiones estratégicas basadas en datos.",
    layout: "text-image",
    image: "/assets/voicebot/metricas.JPG",
    link: DEMO_WHATSAPP_URL,
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
