import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a WhatsApp URL with a predefined message
 * @param phoneNumber Phone number in international format without spaces or special characters
 * @param message Optional message to pre-fill
 * @returns WhatsApp URL
 */
export const createWhatsAppUrl = (
  phoneNumber: string,
  message: string = "Hola, me gustaría solicitar una demo de los servicios de Mayday Global."
): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

// Default WhatsApp contact for demo requests (Juan Moraca)
export const DEMO_WHATSAPP_NUMBER = "5491130365381";
export const DEMO_WHATSAPP_URL = createWhatsAppUrl(DEMO_WHATSAPP_NUMBER, "Quiero más información del Hub de Soluciones de Mayday Global");
