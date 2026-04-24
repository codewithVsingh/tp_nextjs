import { MessageCircle } from "lucide-react";
import { trackCTAClick } from "@/modules/shared/logic/eventTrackingEngine";
import { openWhatsApp } from "@/modules/shared/logic/whatsapp";

interface WhatsAppButtonProps {
  area?: string;
  classLevel?: string;
}

const WhatsAppButton = ({ area, classLevel }: WhatsAppButtonProps) => {
  const msg = `Hi, I need a home tutor${area ? ` in ${area}` : ""}${classLevel ? ` for ${classLevel}` : ""}`;

  return (
    <button
      onClick={() => {
        trackCTAClick("whatsapp_float", window.location.pathname);
        openWhatsApp(msg);
      }}
      className="fixed bottom-20 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </button>
  );
};

export default WhatsAppButton;


