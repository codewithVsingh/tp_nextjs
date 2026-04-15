import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Users,
  Star,
  Shield,
  Phone,
  MessageCircle,
  ArrowRight,
  Clock,
  MapPin,
  Search,
  IndianRupee,
  CalendarCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import SEOHead from "@/components/SEOHead";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import DemoBookingForm from "@/components/DemoBookingForm";
import { trackCTAClick } from "@/lib/analytics";

const trustStats = [
  { icon: Users, value: "10,000+", label: "Students Trained" },
  { icon: Shield, value: "2,500+", label: "Verified Tutors" },
  { icon: Star, value: "4.8★", label: "Parent Rating" },
];

const popularSearches = [
  "Math tutor near me",
  "Home tutor for Class 8 CBSE",
  "Science tutor in Delhi",
  "English tutor for Class 5",
  "Physics tutor Class 11",
  "Chemistry home tutor",
];

const feeRanges = [
  { range: "Class 1–5", fee: "₹150–₹500/hr" },
  { range: "Class 6–10", fee: "₹300–₹800/hr" },
  { range: "Class 11–12", fee: "₹500–₹1,500/hr" },
];

const availability = [
  { label: "Morning Batch", time: "8 AM – 12 PM" },
  { label: "Evening Batch", time: "4 PM – 8 PM" },
  { label: "Home Visit", type: "In-Person" },
  { label: "Online Classes", type: "Virtual" },
];

const problems = [
  "No time after work to help with homework",
  "Not sure which tutor is right for your child",
  "Concerned about safety and trust",
  "Wasted money on ineffective coaching",
];

const solutions = [
  { text: "Verified & background-checked tutors", icon: Shield },
  { text: "Free demo before any commitment", icon: CalendarCheck },
  { text: "Location-based matching in 24 hours", icon: MapPin },
  { text: "Track progress with regular updates", icon: CheckCircle },
];

const Contact = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const whatsappMsg = encodeURIComponent(
    "Hi, I need a home tutor in Delhi NCR"
  );

  const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

  return (
    <>
      <SEOHead
        title="Find Home Tutors Near You in Delhi NCR | Contact Tutors Parliament"
        description="Find verified home tutors & online tutors in Delhi NCR. Free demo class, matched within 24 hours. 10,000+ students trained. Book now!"
        keywords="home tutors near me, private tutors Delhi NCR, find tutor near me, home tuition Delhi"
      />
      <Navbar />
      <main className="pb-16 md:pb-0">
        {/* HERO */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/70" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div {...fade} className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading font-extrabold text-3xl md:text-5xl lg:text-6xl text-primary-foreground leading-tight mb-6">
                Find the Right Tutor<br />
                <span className="text-secondary">in Your Area Today</span>
              </h1>
              <div className="flex flex-wrap justify-center gap-4 text-primary-foreground/80 text-sm mb-8">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Verified tutors</span>
                <span className="flex items-center gap-1.5"><CalendarCheck className="w-4 h-4" /> Free demo class</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Matched within 24 hrs</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="hero" size="lg" className="text-base px-8 py-6" onClick={() => navigate("/demo-booking")}>
                  Start Free Demo <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
                <div className="flex gap-3">
                  <Button variant="ghost" size="lg" className="text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10" asChild>
                    <a href="tel:+919873101564"><Phone className="w-4 h-4 mr-2" /> Call Now</a>
                  </Button>
                  <Button variant="ghost" size="lg" className="text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10" onClick={() => openWhatsApp(whatsappMsgRaw)}>
                      <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="relative z-10 -mt-8">
          <div className="container mx-auto px-4">
            <motion.div {...fade} className="bg-background rounded-2xl card-shadow p-6 md:p-8">
              <div className="grid grid-cols-3 gap-4 md:gap-8">
                {trustStats.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 justify-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                      <s.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-lg md:text-xl text-foreground">{s.value}</p>
                      <p className="text-muted-foreground text-xs md:text-sm">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* LOCAL DATA */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div {...fade}>
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground text-center mb-10">
                Tutor Information — <span className="text-primary">Delhi NCR</span>
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-muted/50 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Search className="w-5 h-5 text-primary" />
                    <h3 className="font-heading font-semibold text-foreground">Popular Searches</h3>
                  </div>
                  <ul className="space-y-2">
                    {popularSearches.map((s) => (
                      <li key={s} className="text-sm text-muted-foreground flex items-center gap-2">
                        <ArrowRight className="w-3 h-3 text-primary shrink-0" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-muted/50 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <IndianRupee className="w-5 h-5 text-primary" />
                    <h3 className="font-heading font-semibold text-foreground">Estimated Fees</h3>
                  </div>
                  <ul className="space-y-3">
                    {feeRanges.map((f) => (
                      <li key={f.range} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{f.range}</span>
                        <span className="font-semibold text-foreground">{f.fee}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-muted/50 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="font-heading font-semibold text-foreground">Tutor Availability</h3>
                  </div>
                  <ul className="space-y-3">
                    {availability.map((a) => (
                      <li key={a.label} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{a.label}</span>
                        <span className="font-semibold text-foreground">{a.time || a.type}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div {...fade} className="max-w-3xl mx-auto">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground text-center mb-8">
                Struggling to find a <span className="text-primary">reliable tutor?</span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {problems.map((p) => (
                  <div key={p} className="flex items-start gap-3 bg-background rounded-xl p-4 card-shadow">
                    <span className="text-destructive text-lg mt-0.5">✗</span>
                    <p className="text-sm text-muted-foreground">{p}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* SOLUTION */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div {...fade} className="max-w-3xl mx-auto">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground text-center mb-8">
                We match you with the <span className="text-primary">right tutor</span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {solutions.map((s) => (
                  <div key={s.text} className="flex items-start gap-3 bg-accent/40 rounded-xl p-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <s.icon className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm text-foreground font-medium">{s.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* LEAD FORM — uses unified DemoBookingForm */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div {...fade} className="max-w-lg mx-auto">
              <div className="bg-background rounded-2xl card-shadow p-6 md:p-8">
                <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground mb-2 text-center">
                  Get Your Free Demo
                </h3>
                <p className="text-muted-foreground text-sm text-center mb-6">
                  Fill in your details — we'll match a tutor in 24 hrs
                </p>
                <DemoBookingForm source="contact_page" ctaLabel="Get Free Demo Now" />
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyMobileCTA onCtaClick={() => setShowModal(true)} />
      <LeadCaptureModal open={showModal} onOpenChange={setShowModal} source="contact_sticky" />
    </>
  );
};

export default Contact;
