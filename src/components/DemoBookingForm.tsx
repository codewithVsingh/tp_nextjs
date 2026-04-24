import LeadCaptureFlow from "@/components/lead-capture/LeadCaptureFlow";

interface DemoBookingFormProps {
  source?: string;
  ctaLabel?: string;
  onSubmitSuccess?: () => void;
}

const DemoBookingForm = ({
  source = "unknown",
  ctaLabel = "Default",
  onSubmitSuccess,
}: DemoBookingFormProps) => {
  return (
    <LeadCaptureFlow
      source={source}
      sourceCta={ctaLabel}
      onClose={onSubmitSuccess}
    />
  );
};

export default DemoBookingForm;

