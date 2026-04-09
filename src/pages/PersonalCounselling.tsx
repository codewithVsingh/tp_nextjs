import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Compass, Lightbulb, HeartHandshake, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";
import CounsellorCard from "@/components/CounsellorCard";

const benefits = [
  { icon: Compass, title: "Career Transitions", desc: "Navigate career shifts with confidence — whether you're switching industries, upskilling, or exploring new opportunities in Delhi's job market." },
  { icon: Lightbulb, title: "Life Decisions", desc: "Get clarity on major life choices with structured thinking frameworks and expert guidance from experienced counsellors." },
  { icon: HeartHandshake, title: "Emotional Wellbeing", desc: "Build resilience, manage burnout, and develop healthy coping mechanisms for work-life balance." },
];

const counsellors = [
  { name: "Dr. Anand Mehta", expertise: "Career & Life Coaching", experience: "18+ Years", bio: "Executive coach with experience guiding professionals through career transitions, helping over 500+ clients in Delhi NCR.", rating: 4.9, initials: "AM" },
  { name: "Kavya Nair", expertise: "Emotional Wellness", experience: "10+ Years", bio: "Certified therapist specializing in stress management, work-life balance, and personal growth strategies.", rating: 4.8, initials: "KN" },
  { name: "Dr. Rohit Saxena", expertise: "Life & Wellness Coaching", experience: "14+ Years", bio: "Holistic counsellor combining cognitive techniques with mindfulness to help adults achieve clarity and purpose.", rating: 4.9, initials: "RX" },
];

const faqs = [
  { question: "What is personal counselling?", answer: "Personal counselling is a confidential, one-on-one session with a trained professional who helps you navigate life challenges, career decisions, emotional wellbeing, and personal growth." },
  { question: "Who should consider personal counselling?", answer: "Anyone feeling stuck, overwhelmed, or uncertain about career moves, relationships, or life direction can benefit. It's especially helpful for working professionals in high-pressure environments like Delhi." },
  { question: "How is personal counselling different from therapy?", answer: "While therapy addresses clinical mental health conditions, personal counselling focuses on life coaching, career guidance, and developing practical strategies for everyday challenges." },
  { question: "How many sessions will I need?", answer: "Most clients see significant clarity within 3–5 sessions. However, some prefer ongoing support. Your counsellor will recommend a plan based on your specific needs." },
];

const PersonalCounselling = () => (
  <>
    <SEOHead
      title="Personal Counselling Services | Life & Career Guidance India"
      description="Professional personal counselling for adults. Get clarity in career, life decisions & mental wellness."
      keywords="personal counselling, career guidance India, life coaching Delhi, wellness counselling"
    />
    <Navbar />
    <main>
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Personal Counselling</span>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground mt-3 mb-6 leading-tight">
              Find Clarity in Career & Life
            </h1>
            <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
              Professional counselling for adults seeking career direction, emotional balance, and personal growth. Available online and in-person across India.
            </p>
            <Button variant="hero" size="lg" className="text-base px-8 py-6">
              Book a Slot <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
              How We <span className="text-primary">Help You Grow</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-background rounded-2xl p-8 card-shadow hover:card-shadow-hover transition-all duration-300 text-center">
                <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
                  <b.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{b.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding section-alt">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">Our <span className="text-primary">Expert Counsellors</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {counsellors.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <CounsellorCard {...c} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} subtitle="Common Questions" />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default PersonalCounselling;
