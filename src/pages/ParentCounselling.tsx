import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, MessageCircle, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";
import CounsellorCard from "@/components/CounsellorCard";

const benefits = [
  { icon: Users, title: "Handle Child Stress", desc: "Learn to identify signs of academic stress in your child and respond with empathy, especially during Delhi's competitive exam seasons." },
  { icon: BookOpen, title: "Academic Planning", desc: "Work with experts to plan your child's academic journey — from choosing the right school board to preparing for entrance exams." },
  { icon: MessageCircle, title: "Better Communication", desc: "Build stronger parent-child relationships through guided communication strategies that foster trust and openness." },
];

const counsellors = [
  { name: "Dr. Meera Gupta", expertise: "Child Psychology", experience: "14+ Years", bio: "Specializes in helping parents understand child behaviour patterns and create supportive learning environments at home.", rating: 4.9, initials: "MG" },
  { name: "Ritu Sharma", expertise: "Academic Parenting", experience: "10+ Years", bio: "Former school principal in Delhi with deep expertise in guiding parents through board exam preparation and school transitions.", rating: 4.8, initials: "RS" },
  { name: "Dr. Vivek Tandon", expertise: "Family Counselling", experience: "16+ Years", bio: "Certified family therapist helping Delhi NCR families navigate academic pressure, screen time management, and career decisions.", rating: 4.9, initials: "VT" },
];

const faqs = [
  { question: "Why do parents need counselling for their child's education?", answer: "Parent counselling helps you understand your child's unique learning needs, manage academic expectations, and create a supportive home environment — crucial in Delhi's competitive education landscape." },
  { question: "At what age should I seek parent counselling?", answer: "Parent counselling is beneficial at any stage — from KG admission planning to helping teenagers navigate board exams and career choices. Early intervention leads to better outcomes." },
  { question: "Can parent counselling improve my child's grades?", answer: "Yes. When parents learn effective support strategies, reduce academic pressure, and communicate better, children naturally perform better academically." },
  { question: "Is online parent counselling effective?", answer: "Absolutely. Our online sessions are just as effective as in-person meetings. Many Delhi NCR parents prefer the convenience of virtual counselling from home." },
];

const ParentCounselling = () => (
  <>
    <SEOHead
      title="Parent Counselling in Delhi | Child Growth & Academic Support"
      description="Helping parents guide children better with expert counselling support in Delhi. Improve learning outcomes today."
      keywords="parent counselling Delhi, child academic support, parenting guidance, education counselling Delhi"
    />
    <Navbar />
    <main>
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Parent Counselling</span>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground mt-3 mb-6 leading-tight">
              Help Your Child Thrive Academically
            </h1>
            <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
              Expert guidance for parents in Delhi NCR — learn how to support your child's education, manage stress, and build stronger communication.
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
              Why Parents Choose <span className="text-primary">Our Counselling</span>
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

export default ParentCounselling;
