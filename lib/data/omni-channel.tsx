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
    title: ["CONECTORES CRM NATIVOS", "CUSTOMER JOURNEY PERSONALIZADO"],
    description: [
      "Compatibilidad nativa con Microsoft Dynamics 365, Salesforce, Zendesk y más. Tus agentes operan directamente desde su CRM con visión 360° del cliente, reduciendo tiempos de gestión y eliminando cambios de pantalla.",
      "Accedé a los datos del cliente desde el IVR para proponer un journey pertinente, omnicanal y predictivo. Comunicá con tus clientes por el canal que ellos prefieren, con el historial completo siempre disponible para el agente.",
    ],
    layout: "image-text-text",
    image: "/assets/omni-channel/CRM.JPG",
    link: "#",
  },
  {
    id: 3,
    title: "ANALICE SUS KPI EN CADA CANAL",
    description:
      "Proporcione a sus supervisores y gerentes acceso instantáneo a múltiples KPI y estadísticas para analizar las interacciones en todos los canales. Facilíteles las herramientas que necesitan para mejorar la eficacia del servicio al cliente a través de una sencilla interfaz web.",
    layout: "text-image",
    image: "/assets/omni-channel/OCC_Kpi.png",
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

