import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface StickyMobileCTAProps {
  onCtaClick: () => void;
}

const StickyMobileCTA = ({ onCtaClick }: StickyMobileCTAProps) => (
  <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-t border-border p-3 flex gap-2">
    <Button onClick={onCtaClick} className="flex-1 py-5 text-sm font-semibold" style={{ background: "var(--cta-gradient)" }}>
      Get Free Demo <ArrowRight className="w-4 h-4 ml-1" />
    </Button>
    <Button variant="outline" className="py-5 text-sm font-semibold" asChild>
      <a href="https://wa.me/919873101564?text=Hi%2C%20I%20need%20a%20tutor" target="_blank" rel="noopener noreferrer">
        WhatsApp
      </a>
    </Button>
  </div>
);

export default StickyMobileCTA;
