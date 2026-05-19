import { FeatureItem } from "@/components/ProductsIntern/ProductsIntern";

export const features: FeatureItem[] = [
  {
    id: 1,
    title: "RAG Chat",
    description:
      "Potenciá tu VoiceBot con inteligencia artificial generativa y recuperación aumentada de información. El sistema RAG conecta cada conversación telefónica con tu base de conocimiento empresarial en tiempo real, entregando respuestas precisas, contextualizadas y siempre actualizadas. Sin reentrenamiento, sin demoras: tu bot responde como un experto en cada llamada, maximizando la resolución en el primer contacto y reduciendo la transferencia a agentes humanos.",
    layout: "image-text",
    image: "/assets/voicebot/Rag System.JPG",
    hasBorder: false,
  },
  {
    id: 2,
    title: "VOCES SINTÉTICAS NATURALES",
    description:
      "Las conversaciones suenan naturales y fluidas gracias a síntesis de voz de última generación. El sistema adapta el tono, ritmo y entonación para ofrecer una experiencia cercana al humano, mejorando la percepción de tu marca y la satisfacción del cliente.",
    layout: "text-image",
    image: "/assets/voicebot/voicebot-hero.jpg",
  },
  {
    id: 3,
    title: "Reconocimiento de Voz e Intención (ASR + NLP)",
    description:
      "El VoiceBot comprende el lenguaje natural del usuario en tiempo real. Mediante tecnologías de reconocimiento automático de voz (ASR) y procesamiento de lenguaje natural (NLP), identifica la intención detrás de cada frase, incluso en contextos coloquiales, acentos regionales o frases incompletas, garantizando interacciones efectivas.",
    layout: "image-text",
    image: "/assets/products/product-2b.png",
  },
  {
    id: 4,
    title: "Analítica en tiempo real",
    bullets: [
      "Accedé a métricas detalladas de cada interacción: duración, intención detectada, tasa de resolución y satisfacción del cliente. Los dashboards en tiempo real permiten optimizar flujos, identificar cuellos de botella y tomar decisiones basadas en datos.",
      "Integrá el VoiceBot con tu CRM, plataforma omnicanal o sistemas internos para enriquecer cada conversación con contexto del cliente y registrar automáticamente los resultados de cada llamada.",
    ],
    description: "",
    layout: "text-image",
    image: "/assets/ia-bot/image-3.png",
  },
  {
    id: 5,
    title: "Reportes Detallados en Tiempo Real",
    description:
      "Accedé a reportes completos de cada interacción telefónica en tiempo real. Cada llamada genera automáticamente un informe con transcripción completa del diálogo, acceso al audio original en línea y métricas de rendimiento por sesión. Tomá decisiones ágiles con información precisa al instante, sin esperar cierres de jornada ni procesos manuales.",
    layout: "image-text",
    image: "/assets/voicebot/Reporte.jfif",
  },
  {
    id: 6,
    title: "Métricas e Inteligencia Conversacional",
    description:
      "Transformá cada conversación en datos accionables. Nuestra plataforma consolida estadísticas avanzadas de todas las interacciones incorporando análisis de emociones y sentimiento en tiempo real para entender el estado del cliente más allá de las palabras. Accedé a información consolidada sobre tendencias, patrones de comportamiento y niveles de satisfacción para optimizar continuamente la experiencia y tomar decisiones estratégicas basadas en datos.",
    layout: "text-image",
    image: "/assets/voicebot/metricas.JPG",
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
