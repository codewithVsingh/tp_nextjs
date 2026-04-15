const WHATSAPP_PHONE = "919873101564";

/**
 * Build a WhatsApp URL with encoded message.
 * Uses api.whatsapp.com/send which works reliably across devices.
 */
export const getWhatsAppUrl = (message: string): string => {
  const encoded = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encoded}`;
};

/**
 * Open WhatsApp in a new tab. Use this for programmatic (onClick) redirects.
 * Never use fetch/iframe — always window.open.
 */
export const openWhatsApp = (message: string): void => {
  const url = getWhatsAppUrl(message);
  window.open(url, "_blank", "noopener,noreferrer");
};
