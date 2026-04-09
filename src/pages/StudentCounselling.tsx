import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Heart, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";
import CounsellorCard from "@/components/CounsellorCard";

const benefits = [
  { icon: Target, title: "Career Clarity", desc: "Get expert guidance on choosing the right career path after 10th, 12th, or graduation in Delhi's competitive landscape." },
  { icon: TrendingUp, title: "Academic Improvement", desc: "Identify weak areas and build a personalized study plan to boost your grades across CBSE, ICSE, and State Boards." },
  { icon: Heart, title: "Stress Management", desc: "Learn practical techniques to handle exam pressure and academic stress that Delhi students commonly face." },
];

const counsellors = [
  { name: "Dr. Neha Kapoor", expertise: "Career & Academic Guidance", experience: "12+ Years", bio: "Former Delhi University professor specializing in helping students choose the right career path after boards.", rating: 4.9, initials: "NK" },
  { name: "Arun Bhatia", expertise: "Mental Wellness", experience: "8+ Years", bio: "Certified counsellor focused on exam anxiety, peer pressure, and building student confidence in Delhi NCR schools.", rating: 4.8, initials: "AB" },
  { name: "Dr. Sunita Rao", expertise: "Academic Planning", experience: "15+ Years", bio: "Helps students design structured study routines and subject selection strategies for JEE, NEET, and board exams.", rating: 4.9, initials: "SR" },
];

const steps = [
  { step: "01", title: "Choose Counsellor", desc: "Browse profiles and select a counsellor based on your needs." },
  { step: "02", title: "Select Slot", desc: "Pick a convenient date and time for your session." },
  { step: "03", title: "Attend Session", desc: "Join your one-on-one counselling session online or in-person in Delhi." },
];

const faqs = [
  { question: "What is student counselling and who needs it?", answer: "Student counselling provides professional guidance for academic challenges, career decisions, and emotional wellbeing. Any student in Delhi NCR facing confusion about studies, career options, or exam stress can benefit from expert counselling." },
  { question: "How does student counselling help with board exam preparation?", answer: "Our counsellors help students create personalized study plans, manage exam anxiety, and develop effective revision strategies specifically for CBSE and ICSE board exams." },
  { question: "Is online student counselling available?", answer: "Yes, we offer both online and offline counselling sessions. Students across Delhi NCR and India can access our services from the comfort of their homes." },
  { question: "How much does student counselling cost in Delhi?", answer: "We offer affordable counselling packages starting with a free initial consultation. Contact us to learn about our pricing plans tailored for students." },
  { question: "Can counselling help my child choose between Science, Commerce, and Arts?", answer: "Absolutely. Our career counsellors use aptitude assessments and one-on-one discussions to help students make informed stream choices after Class 10." },
];

const StudentCounselling = () => (
  <>
    <SEOHead
      title="Student Counselling in Delhi | Academic & Career Guidance"
      description="Get expert student counselling in Delhi for academics, career planning & stress management. Book a session today."
      keywords="student counselling Delhi, career guidance Delhi, academic counselling, exam stress management"
    />
    <Navbar />
    <main>
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Student Counselling</span>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground mt-3 mb-6 leading-tight">
              Confused About Studies or Career?
            </h1>
            <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
              Talk to certified student counsellors in Delhi today. Get clarity on academics, career paths, and manage exam stress with expert support.
            </p>
            <Button variant="hero" size="lg" className="text-base px-8 py-6">
              Book a Slot <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
              How Counselling <span className="text-primary">Helps Students</span>
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

      {/* Counsellors */}
      <section className="section-padding section-alt">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
              Our <span className="text-primary">Expert Counsellors</span>
            </h2>
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

      {/* Process */}
      <section className="section-padding">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
              How It <span className="text-primary">Works</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="text-center">
                <div className="text-5xl font-heading font-extrabold text-primary/20 mb-2">{s.step}</div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} subtitle="Got Questions?" />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default StudentCounselling;
