import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  AlertCircle,
  Compass,
  TrendingUp,
  Heart,
  Brain,
  PhoneCall,
  Users,
  Calendar,
  Award,
  Target,
  Lock,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";
import CounsellingCallbackForm from "@/components/CounsellingCallbackForm";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { buildFaqSchema, buildBreadcrumbSchema, organizationSchema } from "@/lib/seoSchema";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45 },
};

const signs = [
  "Confused after 10th or 12th",
  "Not sure between Science, Commerce, or Arts",
  "Studying hard but not scoring well",
  "Exam stress or burnout",
  "Overdependence on AI tools without real understanding",
];

const benefits = [
  { icon: Compass, title: "Clear Career Direction", desc: "Discover the right academic and career path based on your strengths and interests." },
  { icon: TrendingUp, title: "Personalized Study Strategy", desc: "Get a study plan tailored to your goals, learning style, and target exams." },
  { icon: Brain, title: "Better Academic Performance", desc: "Identify weak areas and learn techniques to improve scores meaningfully." },
  { icon: Heart, title: "Confidence in Decisions", desc: "Move forward with clarity instead of second-guessing every choice." },
];

const howItWorks = [
  { step: "01", icon: PhoneCall, title: "Share Your Concern", desc: "Fill a simple form about your situation." },
  { step: "02", icon: Users, title: "Expert Connects With You", desc: "Our counsellor will call you to understand your needs." },
  { step: "03", icon: Calendar, title: "Get a Clear Plan", desc: "We guide you with actionable next steps and schedule your session." },
];

const trustItems = [
  { icon: Award, label: "Verified & experienced counsellors" },
  { icon: Target, label: "Personalized guidance" },
  { icon: Lock, label: "Confidential sessions" },
  { icon: TrendingUp, label: "Proven improvement" },
];

const faqs = [
  { question: "What is student counselling and who needs it?", answer: "Student counselling provides professional guidance for academic challenges, career decisions, and emotional wellbeing. Any student in India facing confusion about studies, stream selection, or exam stress can benefit." },
  { question: "How does student counselling help with board exams?", answer: "Counsellors help students create personalized study plans, manage exam anxiety, and develop revision strategies for CBSE, ICSE, and State Board exams." },
  { question: "Is online student counselling available?", answer: "Yes. Sessions are available online across India and in-person at select locations." },
  { question: "Can counselling help my child choose between Science, Commerce, and Arts?", answer: "Absolutely. Our career counsellors use aptitude assessments and one-on-one discussions to help students make informed stream choices after Class 10." },
  { question: "How is counselling different from tutoring?", answer: "Tutoring focuses on subject content. Counselling focuses on mindset, clarity, study strategy, and decision-making." },
];

const StudentCounselling = () => {
  const scrollToForm = () => document.getElementById("callback-form")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <SEOHead
        title="Student Counselling India | Career Guidance After 10th & 12th"
        description="Expert student counselling in India. Get career guidance after 10th & 12th, academic counselling online, and the right strategy to choose your career after school."
        keywords="student counselling India, career guidance after 10th and 12th, academic counselling online India, how to choose career after school"
        canonical="https://tutorsparliament.com/counselling/student"
        structuredData={[
          organizationSchema,
          buildFaqSchema(faqs),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Counselling", path: "/counselling" },
            { name: "Student Counselling", path: "/counselling/student" },
          ]),
        ]}
      />
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <PageBreadcrumbs
              variant="onDark"
              className="mb-6"
              items={[
                { label: "Home", href: "/" },
                { label: "Counselling", href: "/counselling" },
                { label: "Student Counselling" },
              ]}
            />
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Student Counselling</span>
              <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground mt-3 mb-6 leading-tight">
                Not Sure What to Study Next?
              </h1>
              <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
                Avoid wrong career decisions. Get expert guidance on subjects, career paths, and study strategy based on your strengths.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="hero" size="lg" className="text-base px-8 py-6" onClick={scrollToForm}>
                  Request a Callback <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8 py-6 bg-transparent text-primary-foreground border-primary-foreground/40 hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={scrollToForm}>
                  Talk to an Expert
                </Button>
              </div>
              <p className="text-primary-foreground/70 text-sm mt-4">
                Available online across India and select in-person locations
              </p>
            </motion.div>
          </div>
        </section>

        {/* SIGNS */}
        <section className="section-padding">
          <div className="container mx-auto max-w-4xl">
            <motion.div {...fadeUp} className="text-center mb-10">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
                Signs You Need <span className="text-primary">Student Counselling</span>
              </h2>
              <p className="text-muted-foreground mt-3">If any of these sound familiar, it's time to talk to an expert.</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 gap-4">
              {signs.map((s, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
                  <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-foreground text-sm md:text-base">{s}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT YOU'LL GET */}
        <section className="section-padding section-alt">
          <div className="container mx-auto">
            <motion.div {...fadeUp} className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
                What You'll <span className="text-primary">Get</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((b, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08 }}
                  className="bg-background rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 text-center">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
                    <b.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-base text-foreground mb-2">{b.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section-padding">
          <div className="container mx-auto max-w-5xl">
            <motion.div {...fadeUp} className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
                How It <span className="text-primary">Works</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {howItWorks.map((s, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                  className="relative rounded-xl border border-border bg-card p-6">
                  <div className="absolute -top-3 left-6 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    Step {s.step}
                  </div>
                  <s.icon className="w-9 h-9 text-primary mb-3 mt-2" />
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-8">
              Available online across India and select in-person locations.
            </p>
          </div>
        </section>

        {/* LEAD FORM */}
        <section id="callback-form" className="section-padding section-alt">
          <div className="container mx-auto max-w-2xl">
            <CounsellingCallbackForm
              defaultType="Student Counselling"
              heading="Get Student Counselling Guidance"
              subheading="Tell us about your academic concerns. Our counsellor will call you back."
            />
          </div>
        </section>

        {/* TRUST */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container max-w-4xl mx-auto px-4">
            <motion.div {...fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trustItems.map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2 p-4">
                  <item.icon className="w-8 h-8 text-primary" />
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <FAQSection faqs={faqs} subtitle="Got Questions?" />

        {/* INTERNAL LINKING */}
        <section className="py-12 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h3 className="font-heading font-semibold text-xl text-foreground mb-4">Explore More</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/counselling" className="px-5 py-2.5 rounded-full border border-border bg-card hover:border-primary text-sm font-medium transition-colors">All Counselling</Link>
              <Link to="/counselling/parent" className="px-5 py-2.5 rounded-full border border-border bg-card hover:border-primary text-sm font-medium transition-colors">Parent Counselling</Link>
              <Link to="/counselling/personal" className="px-5 py-2.5 rounded-full border border-border bg-card hover:border-primary text-sm font-medium transition-colors">Personal Counselling</Link>
              <Link to="/ai-in-education-for-kids-guide" className="px-5 py-2.5 rounded-full border border-border bg-card hover:border-primary text-sm font-medium transition-colors">AI in Education Guide</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default StudentCounselling;
