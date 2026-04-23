"use client";

import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TutorRegistrationForm from "@/components/TutorRegistrationForm";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, ShieldCheck, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const trustPoints = [
  { icon: Users, text: "1,000+ tutors already joined" },
  { icon: Clock, text: "Get student leads in 24 hrs" },
  { icon: ShieldCheck, text: "Verified & safe platform" },
  { icon: Star, text: "Earn ₹20,000–₹50,000/month" },
];

const faqs = [
  { q: "How do I get students?", a: "Once your profile is verified, we match you with students in your area based on subject, class, and location. You'll receive leads directly via WhatsApp and our platform." },
  { q: "Is there any registration fee?", a: "No, registration is completely free. We only charge a small commission when you successfully start tutoring a student." },
  { q: "How soon will I get leads?", a: "Most tutors receive their first student lead within 24–48 hours of profile verification. Tutors with complete profiles and demo videos get leads faster." },
  { q: "Can I teach online?", a: "Yes! You can choose to teach online, at the student's home, or both. Our platform supports all teaching modes." },
  { q: "What qualifications do I need?", a: "We welcome tutors from all backgrounds — graduates, post-graduates, working professionals, and even senior students. Your teaching skill matters more than degrees." },
  { q: "How is my pay decided?", a: "You set your own hourly rate. Students can see your rate and choose accordingly. We recommend competitive pricing when starting out." },
];

const testimonials = [
  { name: "Priya S.", subject: "Maths Tutor", text: "I joined 3 months ago and already have 8 regular students. The platform is super easy!" },
  { name: "Rahul M.", subject: "Physics Tutor", text: "Best decision I made. I earn ₹35,000/month working just 4 hours a day." },
];

const BecomeATutor = () => {
  const searchParams = useSearchParams();
  const sourcePage = searchParams.get("from") || undefined;
  const sourceCta = searchParams.get("cta") || undefined;

  return (
    <>
      <SEOHead
        title="Become a Tutor | Teach & Earn with Tutors Parliament"
        description="Join as a tutor and connect with students near you. Flexible hours, high earnings. Register for free and start teaching today."
        canonical="https://tutorsparliament.com/become-a-tutor"
        keywords="become a tutor, tutor registration, teach and earn, home tutor Delhi, online tutor jobs"
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Become a Tutor",
        description: "Register as a tutor and start earning by teaching students near you.",
        provider: { "@type": "EducationalOrganization", name: "Tutors Parliament" },
      })}} />

      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/30 py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left - Info */}
              <div className="space-y-6">
                <Badge variant="secondary" className="text-sm px-3 py-1">Free Registration</Badge>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  Teach What You Love.<br />
                  <span className="text-primary">Earn What You Deserve.</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Join Delhi's fastest-growing tutoring platform. Set your own schedule, choose your students, and earn up to ₹50,000/month.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {trustPoints.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <t.icon className="w-4 h-4 text-primary flex-shrink-0" />
                      {t.text}
                    </div>
                  ))}
                </div>

                {/* Testimonials */}
                <div className="space-y-3 pt-4">
                  {testimonials.map((t, i) => (
                    <div key={i} className="bg-background border border-border rounded-xl p-4">
                      <p className="text-sm text-muted-foreground italic">"{t.text}"</p>
                      <p className="text-sm font-medium text-foreground mt-2">— {t.name}, {t.subject}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Form */}
              <div className="bg-background border border-border rounded-2xl p-6 lg:p-8 shadow-lg">
                <TutorRegistrationForm sourcePage={sourcePage} sourceCta={sourceCta} />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-background border border-border rounded-xl px-6">
                  <AccordionTrigger className="text-left font-medium">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default BecomeATutor;
