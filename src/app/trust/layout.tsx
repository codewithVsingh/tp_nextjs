"use client";

import { ReactNode } from "react";
import { TrustAuthProvider } from "@/components/trust/TrustAuthContext";
import { Toaster } from "sonner";

export default function TrustLayout({ children }: { children: ReactNode }) {
  return (
    <TrustAuthProvider>
      <div className="min-h-screen bg-slate-50">
        {children}
      </div>
    </TrustAuthProvider>
  );
}
