import { MessageCircle } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

interface WhatsAppButtonProps {
  area?: string;
  classLevel?: string;
}

const WhatsAppButton = ({ area, classLevel }: WhatsAppButtonProps) => {
  const msg = encodeURIComponent(
    `Hi, I need a home tutor${area ? ` in ${area}` : ""}${classLevel ? ` for ${classLevel}` : ""}`
  );

  return (
    <a
      href={`https://wa.me/919873101564?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
      aria-label="Chat on WhatsApp"
      onClick={() => trackCTAClick("whatsapp_float", window.location.pathname)}
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
};

export default WhatsAppButton;
