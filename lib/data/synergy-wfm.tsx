import { FeatureItem } from "@/components/ProductsIntern/ProductsIntern";
import { DEMO_WHATSAPP_URL } from "@/lib/utils";

export const features: FeatureItem[] = [
  {
    id: 1,
    image: "/assets/synergy-wfm/image-1.png",
    title: "",
    description: "",
    layout: "full-image",
  },
  {
    id: 2,
    title: "Optimización de turnos",
    description:
      "Permite una gestión inteligente y centralizada de los turnos y descansos del personal, garantizando una planificación más eficiente y equilibrada. A través de la plataforma los colaboradores pueden solicitar descansos, mientras que los supervisores pueden aprobar o modificar en tiempo real, manteniendo la operación ágil y sin interrupciones.",
    layout: "text-text",
    link: DEMO_WHATSAPP_URL,
  },
  {
    id: 3,
    title: "Autogestión de licencias",
    description: "",
    bullets: [
      "Los colaboradores gestionan de forma autónoma sus licencias y ausencias. El sistema permite solicitudes ágiles, seguimiento del estado y notificaciones automatizadas.",
      "A su vez, los líderes cuentan con reportes en tiempo real, que brindan una visión del historial, frecuencia y patrones de ausentismo, facilitando una toma de decisiones y la planificación operativa.",
    ],
    layout: "text-text",
    link: DEMO_WHATSAPP_URL,
  },
];

export const solutionsFeatures: FeatureItem[] = [
  {
    id: 1,
    image: "/assets/synergy-wfm/image-2.png",
    title: "Comunicación y Soporte Continuo",
    description: "con dashboards personalizables.",
    layout: "text-text",
    link: DEMO_WHATSAPP_URL,
  },
  {
    id: 2,
    title: "Control de Adherencia y Cumplimiento en Tiempo Real",
    description: "para garantizar la productividad.",
    layout: "text-text",
    link: DEMO_WHATSAPP_URL,
  },
];
