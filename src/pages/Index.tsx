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
import SEOHead from "@/components/SEOHead";

const Index = () => {
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
    </>
  );
};

export default Index;
