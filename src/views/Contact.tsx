"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, MessageCircle, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ContactForm from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { openWhatsApp } from "@/lib/whatsapp";
import { useSearchParams } from "next/navigation";

const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const Contact = () => {
  const searchParams = useSearchParams();
  const sourcePage = searchParams.get("from") || undefined;
  const sourceCta = searchParams.get("cta") || undefined;

  return (
    <>
      <SEOHead
        title="Contact Us | Tutors Parliament"
        description="Get in touch with Tutors Parliament for general inquiries, partnerships, tutor onboarding, feedback or support. We respond within 24 hours."
        keywords="contact tutors parliament, support, partnership, become a tutor"
      />
      <Navbar />
      <main className="pb-16 md:pb-0">
        {/* HERO */}
        <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/70" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div {...fade} className="max-w-2xl mx-auto text-center">
              <h1 className="font-heading font-extrabold text-3xl md:text-5xl text-primary-foreground leading-tight mb-4">
                We'd love to hear from you
              </h1>
              <p className="text-primary-foreground/85 text-base md:text-lg">
                Have a question, feedback, or want to partner with us? Send us a message and we'll respond within 24 hours.
              </p>
            </motion.div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 max-w-6xl mx-auto">
              {/* LEFT: Contact info */}
              <motion.aside {...fade} className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="font-heading font-bold text-2xl text-foreground mb-2">Get in touch</h2>
                  <p className="text-muted-foreground text-sm">
                    Pick the channel that works best for you. For urgent demo bookings, WhatsApp gets the fastest response.
                  </p>
                </div>

                <div className="space-y-4">
                  <a href="tel:+919873101564" className="flex items-start gap-4 p-4 rounded-xl bg-accent/40 hover:bg-accent/60 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Call us</p>
                      <p className="font-semibold text-foreground">+91 98731 01564</p>
                    </div>
                  </a>

                  <a href="mailto:hello@tutorsparliament.com" className="flex items-start gap-4 p-4 rounded-xl bg-accent/40 hover:bg-accent/60 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email us</p>
                      <p className="font-semibold text-foreground">hello@tutorsparliament.com</p>
                    </div>
                  </a>

                  <button
                    type="button"
                    onClick={() => openWhatsApp("Hi, I have a question about Tutors Parliament.")}
                    className="w-full text-left flex items-start gap-4 p-4 rounded-xl bg-accent/40 hover:bg-accent/60 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">WhatsApp</p>
                      <p className="font-semibold text-foreground">Chat with us</p>
                    </div>
                  </button>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-accent/40">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Response time</p>
                      <p className="font-semibold text-foreground">Within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-accent/40">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Looking for a tutor?</p>
                      <Button variant="link" className="h-auto p-0 text-primary" asChild>
                        <a href="/demo-booking">Book a free demo →</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.aside>

              {/* RIGHT: Form */}
              <motion.div {...fade} className="lg:col-span-3">
                <div className="bg-background rounded-2xl card-shadow p-6 md:p-8 border border-border">
                  <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground mb-1">
                    Send us a message
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Fill out the form and we'll route your inquiry to the right team.
                  </p>
                  <ContactForm sourcePage={sourcePage} sourceCta={sourceCta} />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
