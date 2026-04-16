import LeadCaptureFlow from "@/components/lead-capture/LeadCaptureFlow";

interface DemoBookingFormProps {
  source?: string;
  ctaLabel?: string;
  onSubmitSuccess?: () => void;
}

const DemoBookingForm = ({
  source = "unknown",
  onSubmitSuccess,
}: DemoBookingFormProps) => {
  return (
    <LeadCaptureFlow
      source={source}
      onClose={onSubmitSuccess}
    />
  );
};

export default DemoBookingForm;
