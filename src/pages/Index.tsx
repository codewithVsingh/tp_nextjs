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
import FAQSection from "@/components/FAQSection";

const homeFaqs = [
  { question: "What subjects and classes do you offer tuition for in Delhi?", answer: "We offer tuition for KG to Class 12 across all subjects including Mathematics, Science, English, Hindi, Social Studies, and more. We cover CBSE, ICSE, and State Board curricula with both online and offline classes across Delhi NCR." },
  { question: "How do I find the best home tutor in Delhi?", answer: "Simply book a free demo class on our platform. We'll match you with a verified, experienced tutor based on your child's class, board, subject needs, and location in Delhi NCR." },
  { question: "Do you offer online tuition classes?", answer: "Yes! We offer both online and offline tuition. Students across Delhi NCR and India can attend live interactive classes from home with the same quality of teaching." },
  { question: "What makes Tutors Parliament different from other coaching centres?", answer: "We provide personalized 1-on-1 tutoring with verified Delhi-based educators, regular progress tracking, parent updates, and flexible scheduling — unlike crowded coaching centres." },
  { question: "Do you offer counselling services for students and parents?", answer: "Yes, we offer professional counselling including Student Counselling for career guidance, Parent Counselling for academic support strategies, and Personal Counselling for life and career decisions." },
];

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
        <FAQSection faqs={homeFaqs} subtitle="Common Questions" />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Index;
