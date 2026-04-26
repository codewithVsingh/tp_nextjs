"use client";

import React from "react";
import IntelligenceLayout from "./IntelligenceLayout";
import TPSidebar, { NavSection } from "@/design-system/components/TPSidebar";
import { TPErrorBoundary } from "@/modules/shared/components/TPErrorBoundary";

export interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "admin" | "institute" | "tutor";
  navSections?: NavSection[];
  userName?: string;
  onLogout?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  role, 
  navSections,
  userName,
  onLogout
}) => {
  return (
    <IntelligenceLayout 
      role={role} 
      userName={userName} 
      navSections={navSections}
      onLogout={onLogout}
    >
      <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
        <TPSidebar 
          role={role} 
          sections={navSections}
          onLogout={onLogout}
          className="hidden md:flex"
        />
        
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 overflow-hidden">
          <div className="flex-1 overflow-y-auto relative p-3 md:p-5">
            <div className="max-w-[1600px] mx-auto min-h-full">
              <TPErrorBoundary>
                {children}
              </TPErrorBoundary>
            </div>
          </div>
        </main>
      </div>
    </IntelligenceLayout>
  );
};

export default DashboardLayout;
