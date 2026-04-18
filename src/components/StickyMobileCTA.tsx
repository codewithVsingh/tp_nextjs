import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";
import { openWhatsApp } from "@/lib/whatsapp";
import { motion } from "framer-motion";

interface StickyMobileCTAProps {
  onCtaClick: () => void;
  area?: string;
  classLevel?: string;
  ctaLabel?: string;
}

const StickyMobileCTA = ({ onCtaClick, area, classLevel, ctaLabel = "Start Free Demo" }: StickyMobileCTAProps) => {
  const whatsappMsg = `Hi, I need a home tutor${area ? ` in ${area}` : ""}${classLevel ? ` for ${classLevel}` : ""}`;

  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border md:hidden"
      style={{ height: 64, paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex gap-2 max-w-lg mx-auto h-full items-center px-4">
        <Button
          onClick={() => {
            trackCTAClick("sticky_demo", window.location.pathname);
            onCtaClick();
          }}
          className="flex-1 h-12 text-sm font-bold active:scale-[0.96] transition-transform"
          style={{ background: "var(--cta-gradient)" }}
        >
          {ctaLabel} <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
        <Button
          variant="outline"
          className="h-12 text-sm font-semibold min-w-[120px] active:scale-[0.96] transition-transform"
          onClick={() => {
            trackCTAClick("sticky_whatsapp", window.location.pathname);
            openWhatsApp(whatsappMsg);
          }}
        >
          <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
        </Button>
      </div>
    </motion.div>
  );
};

export default StickyMobileCTA;
