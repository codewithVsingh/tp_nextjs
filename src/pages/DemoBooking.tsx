import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import LeadCaptureFlow from "@/components/lead-capture/LeadCaptureFlow";

const DemoBooking = () => {
  const [searchParams] = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const name = searchParams.get("name") || "";

  return (
    <>
      <SEOHead
        title="Book Free Demo | Tutors Parliament"
        description="Book your free demo class with Tutors Parliament. Get matched with expert tutors for personalized learning."
        keywords="book demo tutor, free tuition demo class, home tutor demo"
      />
      <Navbar />
      <main className="min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4">
          <LeadCaptureFlow
            source="demo_booking_page"
            prefill={{ phone, name }}
          />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default DemoBooking;
