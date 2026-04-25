"use client";

import { motion } from "framer-motion";
import Link from "next/link";;
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  AlertCircle,
  Heart,
  Briefcase,
  HeartHandshake,
  Compass,
  Sparkles,
  Lock,
  PhoneCall,
  Users,
  Calendar,
  Award,
  Target,
  TrendingUp,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";
import CounsellingCallbackForm from "@/components/CounsellingCallbackForm";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { buildFaqSchema, buildBreadcrumbSchema, organizationSchema } from "@/modules/shared/logic/seoMetadataGenerator";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45 },
};

const helpAreas = [
  {
    icon: Heart,
    title: "Life & Emotional Challenges",
    points: ["Overthinking and anxiety", "Lack of direction", "Low confidence"],
  },
  {
    icon: Briefcase,
    title: "Career & Work Stress",
    points: ["Career confusion", "Burnout", "Job dissatisfaction"],
  },
  {
    icon: HeartHandshake,
    title: "Relationship & Family Issues",
    points: ["Relationship conflicts", "Communication problems", "Family pressure", "Work-life imbalance"],
  },
];

const signs = [
  "Feeling overwhelmed",
  "Unable to make decisions",
  "Stuck despite effort",
  "Relationship struggles",
];

const gains = [
  { icon: Compass, title: "Clarity in Decisions", desc: "Move forward with confidence and a clear sense of direction." },
  { icon: Heart, title: "Emotional Stability", desc: "Develop healthier ways to manage stress and emotions." },
  { icon: HeartHandshake, title: "Better Relationships", desc: "Improve how you communicate and connect with others." },
  { icon: Sparkles, title: "Confidence", desc: "Trust yourself and your choices in every area of life." },
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
  { question: "What is personal counselling?", answer: "Personal counselling is a confidential, one-on-one session with a trained professional who helps you navigate life challenges, career decisions, emotional wellbeing, and personal growth." },
  { question: "Who should consider personal counselling?", answer: "Anyone feeling stuck, overwhelmed, or uncertain about career, relationships, or life direction can benefit. It's especially helpful for working professionals managing high pressure." },
  { question: "How is personal counselling different from therapy?", answer: "While therapy addresses clinical mental health conditions, personal counselling focuses on life coaching, career guidance, and developing practical strategies for everyday challenges." },
  { question: "How many sessions will I need?", answer: "Most clients see significant clarity within 3–5 sessions. Some prefer ongoing support. Your counsellor will recommend a plan based on your specific needs." },
  { question: "Are sessions confidential?", answer: "Yes. Every session is private, secure, and judgment-free. You can openly discuss anything that matters to you." },
];

const PersonalCounselling = () => {
  const scrollToForm = () => document.getElementById("callback-form")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <SEOHead
        title="Personal Counselling India | Life, Career & Relationship Guidance"
        description="Personal counselling India for life clarity, relationship counselling, stress management, and online life coaching. Confidential sessions across India."
        keywords="personal counselling India, relationship counselling India, stress management counselling, life coaching India online"
        canonical="https://tutorsparliament.com/counselling/personal"
        structuredData={[
          organizationSchema,
          buildFaqSchema(faqs),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Counselling", path: "/counselling" },
            { name: "Personal Counselling", path: "/counselling/personal" },
          ]),
        ]}
      />
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
                { label: "Personal Counselling" },
              ]}
            />
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Personal Counselling</span>
              <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground mt-3 mb-6 leading-tight">
                Feeling Stuck in Life, Career, or Relationships?
              </h1>
              <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
                Get clarity, direction, and structured guidance to make better decisions and move forward with confidence.
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

        {/* WHAT CAN PERSONAL COUNSELLING HELP WITH */}
        <section className="section-padding">
          <div className="container mx-auto">
            <motion.div {...fadeUp} className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
                What Personal Counselling <span className="text-primary">Can Help With</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {helpAreas.map((area, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-6 card-shadow hover:card-shadow-hover transition-all">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                    <area.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-3">{area.title}</h3>
                  <ul className="space-y-2">
                    {area.points.map((p, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SIGNS YOU MAY NEED COUNSELLING */}
        <section className="section-padding section-alt">
          <div className="container mx-auto max-w-4xl">
            <motion.div {...fadeUp} className="text-center mb-10">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
                Signs You May Need <span className="text-primary">Counselling</span>
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 gap-4">
              {signs.map((s, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 rounded-xl border border-border bg-background p-5">
                  <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-foreground text-sm md:text-base">{s}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT YOU'LL GAIN */}
        <section className="section-padding">
          <div className="container mx-auto">
            <motion.div {...fadeUp} className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
                What You'll <span className="text-primary">Gain</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {gains.map((b, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08 }}
                  className="bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 text-center border border-border">
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

        {/* CONFIDENTIAL SUPPORT */}
        <section className="section-padding section-alt">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div {...fadeUp}>
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-5">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
                Confidential Support
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                All sessions are private and judgment-free. You can openly discuss personal, emotional, and relationship concerns with experienced counsellors who respect your privacy.
              </p>
            </motion.div>
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
              defaultType="Personal Counselling"
              heading="Find Your Clarity"
              subheading="Share what's on your mind. Our counsellor will call you back — confidentially."
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

        <FAQSection faqs={faqs} subtitle="Common Questions" className="bg-muted/50" />

        {/* INTERNAL LINKING */}
        <section className="py-12 bg-background">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h3 className="font-heading font-semibold text-xl text-foreground mb-4">Explore More</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/counselling" className="px-5 py-2.5 rounded-full border border-border bg-card hover:border-primary text-sm font-medium transition-colors">All Counselling</Link>
              <Link href="/counselling/student" className="px-5 py-2.5 rounded-full border border-border bg-card hover:border-primary text-sm font-medium transition-colors">Student Counselling</Link>
              <Link href="/counselling/parent" className="px-5 py-2.5 rounded-full border border-border bg-card hover:border-primary text-sm font-medium transition-colors">Parent Counselling</Link>
              <Link href="/ai-in-education-for-kids-guide" className="px-5 py-2.5 rounded-full border border-border bg-card hover:border-primary text-sm font-medium transition-colors">AI in Education Guide</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default PersonalCounselling;


