import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

interface StickyMobileCTAProps {
  onCtaClick: () => void;
  area?: string;
  classLevel?: string;
}

const StickyMobileCTA = ({ onCtaClick, area, classLevel }: StickyMobileCTAProps) => {
  const whatsappMsg = encodeURIComponent(
    `Hi, I need a home tutor${area ? ` in ${area}` : ""}${classLevel ? ` for ${classLevel}` : ""}`
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border p-3">
      <div className="flex gap-2 max-w-lg mx-auto">
        <Button
          onClick={() => {
            trackCTAClick("sticky_demo", window.location.pathname);
            onCtaClick();
          }}
          className="flex-1 py-5 text-sm font-semibold"
          style={{ background: "var(--cta-gradient)" }}
        >
          Get Free Demo <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
        <Button
          variant="outline"
          className="py-5 text-sm font-semibold"
          asChild
          onClick={() => trackCTAClick("sticky_whatsapp", window.location.pathname)}
        >
          <a href={`https://wa.me/919873101564?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
};

export default StickyMobileCTA;
