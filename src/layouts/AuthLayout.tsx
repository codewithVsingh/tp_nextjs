"use client";

import React, { useState, useEffect } from "react";
import IntelligenceLayout from "./IntelligenceLayout";
import { TPCard } from "@/design-system/components/TPCard";
import { cn } from "@/lib/utils";
import { ShieldCheck, Zap, Globe } from "lucide-react";
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
  subtitle,
  sidePanelContent 
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const roleColors = {
    admin: "from-tp-admin/20 to-tp-admin/5",
    institute: "from-tp-institute/20 to-tp-institute/5",
    tutor: "from-tp-tutor/20 to-tp-tutor/5",
  };

  const roleText = {
    admin: "text-tp-admin",
    institute: "text-tp-institute",
    tutor: "text-tp-tutor",
  };

  return (
    <div className="flex flex-col min-h-screen">
      <IntelligenceLayout role={role} hideHeader={false} hideActions={true}>
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-white">
        {/* Left Branding Panel */}
        <div className={cn(
          "hidden lg:flex lg:w-[45%] flex-col justify-center p-12 md:p-16 lg:p-24 relative overflow-hidden bg-gradient-to-br",
          roleColors[role]
        )}>
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#00000008_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
          
          <div className="relative z-10 max-w-md">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm border border-slate-100 mb-8")}>
                <div className={cn("w-2 h-2 rounded-full animate-pulse", 
                  role === "admin" ? "bg-tp-admin" : role === "institute" ? "bg-tp-institute" : "bg-tp-tutor"
                )} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Identity Layer • {role}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-slate-900 leading-[1.1] mb-6">
                Welcome to the <span className={roleText[role]}>Intelligence</span> Network.
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-12">
                Access India's most advanced tutor intelligence ecosystem. Control, automate, and scale with precision.
              </p>

              <div className="space-y-6">
                {[
                  { icon: ShieldCheck, text: "Enterprise-grade security & verified credentials" },
                  { icon: Zap, text: "Real-time performance analytics & fraud signals" },
                  { icon: Globe, text: "India's largest network of academic intelligence" }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center gap-4 group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={mounted ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                      <item.icon className={cn("w-5 h-5", roleText[role])} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              {sidePanelContent && (
                <div className="mt-12">
                  {sidePanelContent}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-24 bg-slate-50/30">
          <div className="w-full max-w-[420px]">
            <AnimatePresence mode="wait">
              {mounted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div className="mb-10 text-center lg:text-left">
                    <h2 className="text-3xl font-heading font-extrabold text-slate-900 mb-3">
                      {title}
                    </h2>
                    <p className="text-slate-500 font-medium">
                      {subtitle}
                    </p>
                  </div>

                  <TPCard className="border-none shadow-2xl shadow-slate-200/50 p-8 md:p-10 rounded-3xl bg-white overflow-hidden">
                    {children}
                  </TPCard>

                  <p className="mt-10 text-center text-sm text-slate-400 font-medium leading-relaxed">
                    By accessing the network, you agree to our <br className="hidden sm:block" />
                    <Link href="/terms" className="text-slate-600 hover:underline font-bold transition-all">Terms of Service</Link> and <Link href="/privacy" className="text-slate-600 hover:underline font-bold transition-all">Privacy Policy</Link>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      </IntelligenceLayout>
    </div>
  );
};

export default AuthLayout;

