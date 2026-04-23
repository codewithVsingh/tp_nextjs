import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import LeadCaptureFlow from "@/components/lead-capture/LeadCaptureFlow";
import type { LeadData } from "@/components/lead-capture/types";

interface LeadCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: string;
  sourcePage?: string;
  sourceCta?: string;
  prefill?: Partial<LeadData>;
}

const LeadCaptureModal = ({ 
  open, 
  onOpenChange, 
  source = "unknown", 
  sourcePage,
  sourceCta,
  prefill 
}: LeadCaptureModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Capture Lead</DialogTitle>
        <LeadCaptureFlow
          source={source}
          sourcePage={sourcePage}
          sourceCta={sourceCta}
          prefill={prefill}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default LeadCaptureModal;
