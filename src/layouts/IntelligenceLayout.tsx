import React from "react";
import TPHeader from "@/components/system/TPHeader";
import { cn } from "@/lib/utils";

export interface IntelligenceLayoutProps {
  children: React.ReactNode;
  role?: "admin" | "institute" | "tutor" | "global";
  userName?: string;
  hideHeader?: boolean;
  className?: string;
}

const IntelligenceLayout: React.FC<IntelligenceLayoutProps> = ({ 
  children, 
  role = "global", 
  userName,
  hideHeader = false,
  className
}) => {
  return (
    <div className={cn("min-h-screen bg-slate-50 flex flex-col font-body", className)}>
      {!hideHeader && (
        <TPHeader role={role} userName={userName} />
      )}
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Global Toast / Overlay Layer could go here */}
    </div>
  );
};

export default IntelligenceLayout;
