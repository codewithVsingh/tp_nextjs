import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  GraduationCap,
  Users,
  User,
  UserPlus,
  Brain,
  Target,
  Calendar,
  PhoneCall,
  ShieldCheck,
  Lock,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { buildFaqSchema, buildBreadcrumbSchema, organizationSchema } from "@/lib/seoSchema";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45 },
};

const counsellingTypes = [
  {
    icon: GraduationCap,
    title: "Student Counselling",
    desc: "Career clarity, study planning, and stress management for students of all ages.",
    href: "/counselling/student",
  },
  {
    icon: Users,
    title: "Parent Counselling",
    desc: "Understand your child's learning gaps and how to support their growth at home.",
    href: "/counselling/parent",
  },
  {
    icon: User,
    title: "Personal Counselling",
    desc: "One-on-one guidance for adults navigating learning, focus, or life transitions.",
    href: "/counselling/personal",
  },
  {
    icon: UserPlus,
    title: "Join as a Tutor or Counsellor",
    desc: "Are you a qualified tutor or counsellor? Join our growing network of experts.",
    href: "/become-a-tutor",
  },
];

const whyMatters = [
  {
    icon: Brain,
    text: "Students are increasingly dependent on AI tools without real understanding.",
  },
  {
    icon: AlertTriangle,
    text: "Lack of clarity leads to poor academic performance and low confidence.",
  },
  {
    icon: Target,
    text: "Parents struggle to identify the actual learning gaps their child faces.",
  },
  {
    icon: TrendingUp,
    text: "Early guidance can prevent long-term academic and emotional issues.",
  },
];

const howItWorks = [
  {
    step: "01",
    icon: PhoneCall,
    title: "Share Your Requirement",
    desc: "Tell us about your concerns through a simple form. Takes less than a minute.",
  },
  {
    step: "02",
    icon: Users,
    title: "Expert Connects With You",
    desc: "Our counsellor will call you to understand your situation in detail.",
  },
  {
    step: "03",
    icon: Calendar,
    title: "Session is Scheduled",
    desc: "We schedule your session at a convenient time — online across India or in-person in select cities.",
  },
];

const trustItems = [
  { icon: Award, label: "Certified counsellors" },
  { icon: Target, label: "Personalized guidance" },
  { icon: Lock, label: "Confidential sessions" },
  { icon: TrendingUp, label: "Proven student improvement" },
];

const faqs = [
  {
    question: "How do I know if my child needs counselling?",
    answer:
      "If your child lacks focus, depends heavily on AI tools, or seems confused about studies, counselling can help identify and fix the underlying issue.",
  },
  {
    question: "Is counselling available online?",
    answer:
      "Yes. We offer online sessions across India and limited in-person sessions in select cities.",
  },
  {
    question: "How is counselling different from tutoring?",
    answer:
      "Tutoring focuses on subjects and academic content. Counselling focuses on mindset, clarity, learning approach, and emotional wellbeing.",
  },
  {
    question: "Are sessions confidential?",
    answer: "Yes, all counselling sessions are completely private and secure.",
  },
  {
    question: "Who are the counsellors?",
    answer:
      "Experienced and certified professionals specializing in student guidance, parent counselling, and personal development.",
  },
];

const Counselling = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    concern: "",
    type: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const scrollToForm = () => {
    document.getElementById("counselling-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) newErrors.name = "Please enter your name";
    const cleanedPhone = form.phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) newErrors.phone = "Enter a valid 10-digit phone number";
    if (!form.type) newErrors.type = "Please select a counselling type";
    if (!form.concern.trim()) newErrors.concern = "Please share your concern";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name.trim(),
        email: null,
        phone: cleanedPhone,
        inquiry_type: `Counselling - ${form.type}`,
        subject: `Counselling Request: ${form.type}`,
        message: form.concern.trim(),
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Request received", description: "Our counsellor will call you shortly." });
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Student, Parent & Personal Counselling in India | Tutors Parliament"
        description="Get expert student, parent, and personal counselling across India. Identify learning gaps, improve focus, and build long-term academic success with guided support."
        keywords="student counselling India, parent counselling, academic guidance, career counselling students, learning gaps help, child focus issues, AI impact on education"
        canonical="https://tutorsparliament.com/counselling"
        structuredData={[
          organizationSchema,
          buildFaqSchema(faqs),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Counselling", path: "/counselling" },
          ]),
        ]}
      />
      <Navbar />

      <main className="pb-16 md:pb-0">
        {/* HERO */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-24" style={{ background: "var(--hero-gradient)" }}>
          <div className="container max-w-4xl mx-auto px-4 text-center text-primary-foreground">
            <motion.div {...fadeUp} className="space-y-5">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-primary-foreground/15 px-3 py-1.5 rounded-full">
                Expert Counselling
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Expert Counselling for Students,<br className="hidden sm:block" /> Parents & Individuals
              </h1>
              <p className="text-base md:text-lg max-w-2xl mx-auto opacity-90 leading-relaxed">
                Confused about studies, career direction, or learning challenges? Our expert counsellors help you identify the problem and guide you with the right approach.
              </p>
              <Button size="lg" variant="cta" className="font-bold" onClick={scrollToForm}>
                Get Started <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <p className="text-sm opacity-80 pt-2">
                Available online across India and select in-person locations
              </p>
            </motion.div>
          </div>
        </section>

        {/* WHY COUNSELLING MATTERS */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container max-w-4xl mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                Why Counselling is Important Today
              </h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                The way children learn has changed. Here's why the right guidance matters now more than ever.
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="grid gap-4 sm:grid-cols-2">
              {whyMatters.map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
                  <item.icon className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <p className="text-foreground text-sm md:text-base leading-relaxed">{item.text}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* COUNSELLING TYPES */}
        <section className="py-12 md:py-20 bg-muted/50">
          <div className="container max-w-5xl mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                Choose the Right Counselling for You
              </h2>
              <p className="text-muted-foreground mt-3">Pick what fits your situation best.</p>
            </motion.div>

            <motion.div {...fadeUp} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {counsellingTypes.map((card) => (
                <Link
                  key={card.title}
                  to={card.href}
                  className="group rounded-xl border border-border bg-card p-5 hover:border-primary hover:shadow-lg transition-all"
                >
                  <card.icon className="w-9 h-9 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{card.desc}</p>
                  <span className="text-sm font-medium text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container max-w-5xl mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">How It Works</h2>
              <p className="text-muted-foreground mt-3">Three simple steps to get the guidance you need.</p>
            </motion.div>

            <motion.div {...fadeUp} className="grid gap-6 md:grid-cols-3">
              {howItWorks.map((step) => (
                <div key={step.step} className="relative rounded-xl border border-border bg-card p-6">
                  <div className="absolute -top-3 left-6 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    Step {step.step}
                  </div>
                  <step.icon className="w-9 h-9 text-primary mb-3 mt-2" />
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </motion.div>
            <p className="text-center text-sm text-muted-foreground mt-8">
              Available online across India and select in-person locations.
            </p>
          </div>
        </section>

        {/* LEAD FORM */}
        <section id="counselling-form" className="py-12 md:py-20 bg-muted/50">
          <div className="container max-w-2xl mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                Request a Counselling Callback
              </h2>
              <p className="text-muted-foreground mt-3">
                Share your concern and our expert will call you back shortly.
              </p>
            </motion.div>

            {submitted ? (
              <motion.div {...fadeUp} className="rounded-xl border border-border bg-card p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
                <h3 className="font-bold text-xl text-foreground">Request Received</h3>
                <p className="text-muted-foreground">
                  Thank you. Our counsellor will reach out to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <motion.form
                {...fadeUp}
                onSubmit={handleSubmit}
                className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-4"
              >
                <div>
                  <Label htmlFor="c-name">Name *</Label>
                  <Input
                    id="c-name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      setErrors({ ...errors, name: "" });
                    }}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="c-phone">Phone Number *</Label>
                  <Input
                    id="c-phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => {
                      setForm({ ...form, phone: e.target.value.replace(/\D/g, "") });
                      setErrors({ ...errors, phone: "" });
                    }}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="c-type">Preferred Counselling Type *</Label>
                  <Select
                    value={form.type}
                    onValueChange={(v) => {
                      setForm({ ...form, type: v });
                      setErrors({ ...errors, type: "" });
                    }}
                  >
                    <SelectTrigger id="c-type" className={errors.type ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select counselling type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Student Counselling">Student Counselling</SelectItem>
                      <SelectItem value="Parent Counselling">Parent Counselling</SelectItem>
                      <SelectItem value="Personal Counselling">Personal Counselling</SelectItem>
                      <SelectItem value="Not Sure">Not sure — help me decide</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-destructive text-xs mt-1">{errors.type}</p>}
                </div>

                <div>
                  <Label htmlFor="c-concern">Class / Concern *</Label>
                  <Textarea
                    id="c-concern"
                    placeholder="e.g. Class 10 student, struggling with focus and AI dependency"
                    rows={4}
                    value={form.concern}
                    onChange={(e) => {
                      setForm({ ...form, concern: e.target.value });
                      setErrors({ ...errors, concern: "" });
                    }}
                    className={errors.concern ? "border-destructive" : ""}
                  />
                  {errors.concern && <p className="text-destructive text-xs mt-1">{errors.concern}</p>}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full font-bold"
                  style={{ background: "var(--cta-gradient)" }}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Request Callback"} <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Your information is private and confidential.
                </p>
              </motion.form>
            )}
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

        {/* FAQ */}
        <FAQSection
          subtitle="FAQs"
          title="Counselling — Common Questions"
          faqs={faqs}
        />
      </main>

      <Footer />
      <StickyMobileCTA onCtaClick={scrollToForm} ctaLabel="Request Callback" />
    </>
  );
};

export default Counselling;
