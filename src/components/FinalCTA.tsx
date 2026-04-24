"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { openWhatsApp } from "@/modules/shared/logic/whatsapp";
import { ArrowRight, ShieldCheck, Zap, Star, Users, GraduationCap } from "lucide-react";
import Link from "next/link";

const highlights = [
  {
    icon: ShieldCheck,
    title: "100% Verified Tutors",
    description: "Every educator on our platform undergoes a rigorous 3-step background and academic verification process."
  },
  {
    icon: Zap,
    title: "Instant Matching Engine",
    description: "Our AI-powered network finds the perfect tutor for your specific learning needs in less than 24 hours."
  },
  {
    icon: GraduationCap,
    title: "Proven Academic Results",
    description: "98% of our students report significant improvement in their grades within the first 3 months."
  },
  {
    icon: Users,
    title: "Pan-India Network",
    description: "Access the finest teaching talent from Delhi, Mumbai, Bangalore, and beyond — online or in-person."
  }
];

const FinalCTA = () => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % highlights.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const ActiveIcon = highlights[activeTab].icon;

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl">
          {/* Shifting Mesh Gradient Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-transparent to-tp-admin/20 animate-pulse" />
            <div className="absolute -top-[50%] -left-[20%] w-[100%] h-[100%] bg-indigo-500/20 rounded-full blur-[120px] animate-float" />
            <div className="absolute -bottom-[50%] -right-[20%] w-[100%] h-[100%] bg-tp-institute/20 rounded-full blur-[120px] animate-float-delayed" />
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 items-center">
            {/* Left: Dynamic Billboard Carousel */}
            <div className="p-8 md:p-16 lg:p-20 border-b lg:border-b-0 lg:border-r border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="min-h-[220px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8 border border-white/10 shadow-inner">
                      <ActiveIcon className="w-7 h-7 text-tp-admin" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-heading font-black text-white mb-4 leading-tight">
                      {highlights[activeTab].title}
                    </h2>
                    <p className="text-lg text-slate-300 leading-relaxed max-w-md">
                      {highlights[activeTab].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Carousel Indicators */}
              <div className="flex gap-2 mt-12">
                {highlights.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className={`h-1.5 transition-all duration-500 rounded-full ${
                      activeTab === i ? "w-10 bg-tp-admin" : "w-3 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Permanent High-Impact CTA */}
            <div className="p-8 md:p-16 lg:p-20 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tp-admin/10 border border-tp-admin/20 mb-6">
                <Star className="w-3.5 h-3.5 text-tp-admin fill-tp-admin" />
                <span className="text-[10px] font-black uppercase tracking-widest text-tp-admin">Start Your Journey Today</span>
              </div>
              
              <h3 className="text-4xl md:text-5xl font-heading font-black text-white mb-6">
                Ready to See the <br className="hidden md:block" />
                <span className="text-tp-admin">Difference?</span>
              </h3>
              
              <p className="text-slate-400 text-lg mb-10 max-w-sm mx-auto lg:mx-0">
                Join thousands of successful students. Book your free demo and find your perfect tutor today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button variant="cta" size="lg" className="h-14 px-8 text-lg group" asChild>
                  <Link href="/demo-booking">
                    Start Free Demo
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button 
                  variant="hero-outline" 
                  size="lg" 
                  className="h-14 px-8 text-white border-white/20 hover:bg-white/5"
                  onClick={() => openWhatsApp("Hi, I'm ready to start my learning journey!")}
                >
                  Chat with Expert
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


