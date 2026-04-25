"use client";

import { useSearchParams } from "next/navigation";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import LeadCaptureFlow from "@/components/lead-capture/LeadCaptureFlow";

const DemoBooking = () => {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const name = searchParams.get("name") || "";
  const sourceFromUrl = searchParams.get("from") || "";
  const ctaFromUrl = searchParams.get("cta") || "";

  return (
    <>
      <SEOHead
        title="Book Free Demo | Tutors Parliament"
        description="Book your free demo class with Tutors Parliament. Get matched with expert tutors for personalized learning."
        keywords="book demo tutor, free tuition demo class, home tutor demo"
      />
      
      <main className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-accent/30 to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="bg-background rounded-2xl card-shadow p-6 md:p-10 max-w-6xl mx-auto">
            <LeadCaptureFlow
              source={sourceFromUrl ? `demo_booking_${sourceFromUrl}` : "demo_booking_page"}
              prefill={{ 
                phone, 
                name,
                source_page: sourceFromUrl,
                source_cta: ctaFromUrl
              }}
              showDesktopPanel
            />
          </div>
        </div>
      </main>
      

    </>
  );
};

export default DemoBooking;

