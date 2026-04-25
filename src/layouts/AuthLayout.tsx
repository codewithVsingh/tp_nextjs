"use client";

import React, { useState, useEffect } from "react";
import { TPCard } from "@/design-system/components/TPCard";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export interface AuthLayoutProps {
  children: React.ReactNode;
  role: "admin" | "institute" | "tutor";
  title: string;
  subtitle: string;
  sidePanelContent?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  role, 
  title, 
  subtitle
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const roleLabels = {
    admin: "Control Tower",
    institute: "Operations",
    tutor: "Execution",
  };

  const roleColors = {
    admin: "text-tp-admin",
    institute: "text-tp-institute",
    tutor: "text-tp-tutor",
  };

  const roleContent = {
    institute: {
      badge: "Institute OS",
      title: "Agency Intelligence",
      description: "Access the Trust Intelligence Network. Report fraud, verify credibility, and secure your operations with data-driven oversight.",
      features: [
        "Real-time Fraud Detection",
        "Tutor Background Verification",
        "Lead Protection & Management",
        "Operations Command Dashboard"
      ],
      color: "text-tp-institute",
      bgColor: "bg-tp-institute",
      borderColor: "border-tp-institute",
      shadowColor: "shadow-tp-institute/20"
    },
    tutor: {
      badge: "Tutor Portal",
      title: "Tutor Ecosystem",
      description: "Join India's elite network of educators. Manage your profile, track leads, and build your professional reputation seamlessly.",
      features: [
        "Verified Student Leads",
        "Digital Profile & Portfolio",
        "Reputation Management",
        "Direct Parent Communication"
      ],
      color: "text-tp-tutor",
      bgColor: "bg-tp-tutor",
      borderColor: "border-tp-tutor",
      shadowColor: "shadow-tp-tutor/20"
    },
    admin: {
      badge: "Admin OS",
      title: "Command Center",
      description: "Internal operations for Tutor Parliament administrators. Full-stack oversight, control tower, and system health monitoring.",
      features: [
        "Global Network Surveillance",
        "User Access & Roles Management",
        "System-wide Analytics & KPIs",
        "Master Lead Routing"
      ],
      color: "text-tp-admin",
      bgColor: "bg-tp-admin",
      borderColor: "border-tp-admin",
      shadowColor: "shadow-tp-admin/20"
    }
  };

  const currentContent = roleContent[role];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Branding Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-1 bg-[#020617] text-white p-12 lg:p-20 flex-col relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[100px]" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold tracking-widest uppercase mb-8 w-fit text-primary-foreground/80 shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full ${currentContent.bgColor} animate-pulse`} />
            {currentContent.badge}
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-6">
            {currentContent.title}
          </h2>
          
          <p className="text-lg text-primary-foreground/70 mb-12">
            {currentContent.description}
          </p>

          <div className={`p-6 md:p-8 rounded-3xl border bg-white/5 backdrop-blur-sm ${currentContent.borderColor}/30 ${currentContent.shadowColor} shadow-2xl`}>
             <h3 className="text-sm font-bold uppercase tracking-widest text-primary-foreground/50 mb-6">Key Capabilities</h3>
             <ul className="space-y-4">
               {currentContent.features.map((feature, idx) => (
                 <li key={idx} className="flex items-center gap-3">
                   <div className={`w-6 h-6 rounded-full ${currentContent.bgColor}/20 flex items-center justify-center shrink-0`}>
                     <svg className={`w-3.5 h-3.5 ${currentContent.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                     </svg>
                   </div>
                   <span className="text-primary-foreground/90 font-medium">{feature}</span>
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative">
        <AnimatePresence>
          {mounted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-[440px] flex flex-col items-center"
            >
              {/* Minimal Branding */}
              <Link href="/" className="flex flex-col items-center gap-4 mb-10 group">
                <div className="h-[48px] transition-transform group-hover:scale-110">
                  <img 
                    src="/brand/logo/main-logo.svg" 
                    alt="Tutors Parliament" 
                    className="h-full w-auto object-contain"
                  />
                </div>
                <div className="text-center">
                  <h1 className="font-heading font-bold text-2xl text-slate-900 leading-none">
                    Tutors&nbsp;Parliament
                  </h1>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-[0.3em] block mt-2",
                    roleColors[role]
                  )}>
                    {roleLabels[role]}
                  </span>
                </div>
              </Link>

              <div className="w-full mb-8 text-center">
                <h2 className="text-2xl font-heading font-extrabold text-slate-900 mb-2">
                  {title}
                </h2>
                <p className="text-slate-500 font-medium text-sm">
                  {subtitle}
                </p>
              </div>

              <TPCard className="w-full border-none shadow-2xl shadow-slate-200/50 p-8 md:p-10 rounded-3xl bg-white">
                {children}
              </TPCard>

              <p className="mt-10 text-center text-xs text-slate-400 font-medium leading-relaxed">
                By accessing the network, you agree to our <br />
                <Link href="/terms" className="text-slate-600 hover:underline font-bold transition-all">Terms of Service</Link> and <Link href="/privacy" className="text-slate-600 hover:underline font-bold transition-all">Privacy Policy</Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthLayout;

