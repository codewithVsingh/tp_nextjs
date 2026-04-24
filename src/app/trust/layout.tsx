"use client";

import { ReactNode } from "react";
import { TrustAuthProvider } from "@/components/trust/TrustAuthContext";
import InstituteLayout from "@/modules/institute/InstituteLayout";

export default function TrustLayout({ children }: { children: ReactNode }) {
  return (
    <TrustAuthProvider>
      <InstituteLayout>
        {children}
      </InstituteLayout>
    </TrustAuthProvider>
  );
}

