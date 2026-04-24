"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { useState, Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";

import { useAuthStore } from "@/modules/shared/store/useAuthStore";
import { TrustAuthProvider } from "@/components/trust/TrustAuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const { initialize } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    initialize();
  }, [initialize]);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <TrustAuthProvider>
            <div className="min-h-screen">
              {children}
            </div>
            <Toaster />
            <Sonner />
          </TrustAuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

