"use client";

import { motion } from "framer-motion";
import Link from "next/link";;
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  AlertCircle,
  Eye,
  MessageCircle,
  ClipboardList,
  ShieldAlert,
  PhoneCall,
  Users,
  Calendar,
  Award,
  Target,
  Lock,
  TrendingUp,
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

const whatParentsMiss = [
  "Good marks don't always mean real understanding",
  "AI tools can hide deep learning gaps",
  "Pressure without direction reduces confidence",
];

const howWeHelp = [
  { icon: Eye, title: "Identify Real Learning Gaps", desc: "Move past surface-level grades and uncover what your child actually understands." },
  { icon: MessageCircle, title: "Improve Parent-Child Communication", desc: "Build trust and open conversations about studies, stress, and goals." },
  { icon: ClipboardList, title: "Create a Structured Academic Plan", desc: "A clear roadmap aligned to your child's strengths and target exams." },
  { icon: ShieldAlert, title: "Reduce Stress and Confusion", desc: "Replace anxiety with calm, informed parenting decisions." },
];

const whenToSeekHelp = [
  "Child is distracted or demotivated",
  "Marks are inconsistent",
  "Confusion about subjects or career",
  "Increased screen time / AI dependency",
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
  { question: "Why do parents need counselling for their child's education?", answer: "Parent counselling helps you understand your child's unique learning needs, manage academic expectations, and create a supportive home environment." },
  { question: "At what age should I seek parent counselling?", answer: "Parent counselling is beneficial at any stage — from early schooling to helping teenagers navigate board exams and career choices. Early intervention leads to better outcomes." },
  { question: "Can parent counselling improve my child's grades?", answer: "Yes. When parents learn effective support strategies, reduce academic pressure, and communicate better, children naturally perform better." },
  { question: "Is online parent counselling effective?", answer: "Absolutely. Sessions are available online across India and select in-person locations. Many parents prefer the convenience of virtual counselling." },
  { question: "How do I know if my child needs help?", answer: "If your child lacks focus, depends heavily on AI shortcuts, or seems confused about studies, it's worth speaking with a counsellor." },
];

const ParentCounselling = () => {
  const scrollToForm = () => document.getElementById("callback-form")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <SEOHead
        title="Parent Counselling India | Help Your Child Focus & Succeed"
        description="Expert parent counselling India. Child education guidance, academic stress help for students, and how to help your child focus on studies — online across India."
        keywords="parent counselling India, child education guidance India, academic stress help for students, how to help child focus on studies"
        canonical="https://tutorsparliament.com/counselling/parent"
        structuredData={[
          organizationSchema,
          buildFaqSchema(faqs),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Counselling", path: "/counselling" },
            { name: "Parent Counselling", path: "/counselling/parent" },
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
                { label: "Parent Counselling" },
              ]}
            />
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Parent Counselling</span>
              <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground mt-3 mb-6 leading-tight">
                Worried About Your Child's Future?
              </h1>
              <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
                If your child lacks focus, depends on shortcuts like AI, or feels confused — expert counselling can help you take the right steps early.
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

        {/* WHAT MOST PARENTS MISS */}
        <section className="section-padding">
          <div className="container mx-auto max-w-4xl">
            <motion.div {...fadeUp} className="text-center mb-10">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
                What Most Parents <span className="text-primary">Miss</span>
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-3 gap-4">
              {whatParentsMiss.map((s, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08 }}
                  className="rounded-xl border border-border bg-card p-5 text-center">
                  <AlertCircle className="w-6 h-6 text-primary mx-auto mb-3" />
                  <p className="text-foreground text-sm md:text-base">{s}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW WE HELP PARENTS */}
        <section className="section-padding section-alt">
          <div className="container mx-auto">
            <motion.div {...fadeUp} className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
                How We <span className="text-primary">Help Parents</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howWeHelp.map((b, i) => (
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

        {/* WHEN TO SEEK HELP */}
        <section className="section-padding">
          <div className="container mx-auto max-w-4xl">
            <motion.div {...fadeUp} className="text-center mb-10">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
                When Should You <span className="text-primary">Seek Help</span>
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 gap-4">
              {whenToSeekHelp.map((s, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
                  <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-foreground text-sm md:text-base">{s}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section-padding section-alt">
          <div className="container mx-auto max-w-5xl">
            <motion.div {...fadeUp} className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
                How It <span className="text-primary">Works</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {howItWorks.map((s, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                  className="relative rounded-xl border border-border bg-background p-6">
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
        <section id="callback-form" className="section-padding">
          <div className="container mx-auto max-w-2xl">
            <CounsellingCallbackForm
              defaultType="Parent Counselling"
              heading="Help Your Child Thrive"
              subheading="Share what you've noticed. Our parent counsellor will call you back."
            />
          </div>
        </section>

        {/* TRUST */}
        <section className="py-12 md:py-16 bg-muted/40">
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

        <FAQSection faqs={faqs} subtitle="Common Questions" />

        {/* INTERNAL LINKING */}
        <section className="py-12 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h3 className="font-heading font-semibold text-xl text-foreground mb-4">Explore More</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/counselling" className="px-5 py-2.5 rounded-full border border-border bg-card hover:border-primary text-sm font-medium transition-colors">All Counselling</Link>
              <Link href="/counselling/student" className="px-5 py-2.5 rounded-full border border-border bg-card hover:border-primary text-sm font-medium transition-colors">Student Counselling</Link>
              <Link href="/counselling/personal" className="px-5 py-2.5 rounded-full border border-border bg-card hover:border-primary text-sm font-medium transition-colors">Personal Counselling</Link>
              <Link href="/ai-in-education-for-kids-guide" className="px-5 py-2.5 rounded-full border border-border bg-card hover:border-primary text-sm font-medium transition-colors">AI in Education Guide</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default ParentCounselling;
