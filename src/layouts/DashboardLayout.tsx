"use client";

import React, { useState, useEffect } from "react";
import IntelligenceLayout from "./IntelligenceLayout";
import TPSidebar, { NavItem, NavSection } from "@/components/system/TPSidebar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "admin" | "institute" | "tutor";
  navItems?: NavItem[];
  navSections?: NavSection[];
  userName?: string;
  onLogout?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  role, 
  navItems,
  navSections,
  userName,
  onLogout
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <IntelligenceLayout role={role} userName={userName}>
      <div className="flex flex-1 overflow-hidden">
        <TPSidebar 
          role={role} 
          items={navItems} 
          sections={navSections}
          onLogout={onLogout}
        />
        
        <main className="flex-1 overflow-y-auto bg-slate-50/50 relative">
          {/* Subtle background pattern for premium feel */}
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {mounted && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto"
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </IntelligenceLayout>
  );
};

export default DashboardLayout;
