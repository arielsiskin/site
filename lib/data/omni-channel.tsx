import { FeatureItem } from "@/components/ProductsIntern/ProductsIntern";

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
    title: "CONECTORES CRM NATIVOS",
    description:
      "Compatibilidad nativa con Microsoft Dynamics 365, Salesforce, Zendesk y más. Tus agentes operan directamente desde su CRM con visión 360° del cliente, reduciendo tiempos de gestión y eliminando cambios de pantalla.",
    layout: "image-text",
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
      "Desde el primer día. Nuestro equipo de expertos brinda asistencia personalizada y formación continua para garantizar el máximo rendimento de nuestras tecnologías.",
    image: "/assets/omni-channel/soporte.png",
    layout: "text-image",
    hasBorder: true,
  },
  {
    id: 2,
    title: "INSTALACIÓN RÁPIDA",
    description:
      "Arquitectura elástica sin servidores físicos locales. Disponible sobre Google Cloud Platform o Amazon Web Services según tu preferencia.",
    layout: "text-text",
    imgUrls: [
      "/assets/omni-channel/gcp.svg",
      "/assets/omni-channel/aws.png",
    ],
    imgLabels: ["Google Cloud Platform", "Amazon Web Services"],
  },
];

