import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import FeaturesSection from "@/components/FeaturesSection";
import CoursesSection from "@/components/CoursesSection";
import TutorsSection from "@/components/TutorsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import HowItWorks from "@/components/HowItWorks";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import BehaviorPopup from "@/components/BehaviorPopup";
import ScrollTracker from "@/components/ScrollTracker";
import SEOHead from "@/components/SEOHead";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { useState } from "react";

const Index = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <SEOHead
        title="Best Home Tutors in Delhi | Online & Offline Tuition"
        description="Find the best home tutors in Delhi for CBSE, ICSE & all subjects. Personalized online & offline tuition classes for Class KG-12. Book a free demo today!"
        keywords="best home tutors Delhi, private tutors near me, online tuition classes India, CBSE ICSE tuition Delhi, home tutor Delhi NCR"
      />
      <Navbar />
      <main>
        <HeroSection />
        <TrustBar />
        <FeaturesSection />
        <CoursesSection />
        <TutorsSection />
        <TestimonialsSection />
        <HowItWorks />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
      <StickyMobileCTA onCtaClick={() => setShowModal(true)} />
      <BehaviorPopup />
      <ScrollTracker />
      <LeadCaptureModal open={showModal} onOpenChange={setShowModal} source="homepage_sticky" />
    </>
  );
};

export default Index;
