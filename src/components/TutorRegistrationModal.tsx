import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import TutorRegistrationForm from "./TutorRegistrationForm";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TutorRegistrationModal = ({ open, onOpenChange }: Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[95vh] overflow-y-auto rounded-t-2xl p-6">
          <SheetTitle className="text-lg font-bold mb-4">Tutor Registration</SheetTitle>
          <TutorRegistrationForm isModal onClose={() => onOpenChange(false)} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-lg font-bold">Tutor Registration</DialogTitle>
        <TutorRegistrationForm isModal onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default TutorRegistrationModal;

