import { Dialog, DialogContent } from "@/components/ui/dialog";
import LeadCaptureFlow from "@/components/lead-capture/LeadCaptureFlow";
import type { LeadData } from "@/components/lead-capture/types";

interface LeadCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: string;
  prefill?: Partial<LeadData>;
}

const LeadCaptureModal = ({ open, onOpenChange, source = "unknown", prefill }: LeadCaptureModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <LeadCaptureFlow
          source={source}
          prefill={prefill}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default LeadCaptureModal;
