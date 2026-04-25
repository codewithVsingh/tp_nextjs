"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Star, CheckCircle, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

const slides = [
  {
    icon: GraduationCap,
    text: "Verified Tutors for 2026 Board Exams (CBSE/ICSE/IB)",
    accent: "text-tp-admin"
  },
  {
    icon: Award,
    text: "95% Success Rate in ICSE/CBSE Board Exams",
    accent: "text-tp-institute"
  },
  {
    icon: Star,
    text: "Trusted by 10,000+ Parents Across India",
    accent: "text-secondary"
  },
  {
    icon: CheckCircle,
    text: "Free Demo Class Available for All Subjects Today",
    accent: "text-emerald-400"
  }
];

const TopBanner = () => {
  const pathname = usePathname();
  const [current, setCurrent] = useState(0);



  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="bg-[#020617] text-white overflow-hidden border-b border-white/5 relative z-[60]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-10 md:h-12 relative">
          
          {/* Navigation - Hidden on mobile, subtle on desktop */}
          <button 
            onClick={prev}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/5 transition-colors text-white/40 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 relative flex items-center justify-center overflow-hidden h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex items-center gap-3 px-4"
              >
                {/* Dynamic Icon */}
                <div className={`p-1.5 rounded-lg bg-white/5 border border-white/10 ${slides[current].accent}`}>
                  {(() => {
                    const Icon = slides[current].icon;
                    return <Icon className="w-3.5 h-3.5" />;
                  })()}
                </div>
                
                {/* Text Content */}
                <span className="text-[11px] md:text-sm font-medium tracking-tight text-white/90 whitespace-nowrap">
                  {slides[current].text}
                </span>

                {/* Status Dot */}
                <span className="hidden sm:inline-flex relative h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tp-admin opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-tp-admin"></span>
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <button 
            onClick={next}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/5 transition-colors text-white/40 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Quick Stats - Visible only on larger screens */}
          <div className="hidden lg:flex items-center gap-6 absolute right-12 text-[10px] font-black uppercase tracking-widest text-white/30">
            <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-tp-admin" /> Live Support</span>
            <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-500" /> Tutors Active</span>
          </div>
        </div>
      </div>

      {/* Subtle Progress Bar */}
      <div className="absolute bottom-0 left-0 h-[1px] bg-tp-admin/30 w-full overflow-hidden">
        <motion.div 
          key={current}
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="h-full bg-tp-admin w-full"
        />
      </div>
    </div>
  );
};

export default TopBanner;
