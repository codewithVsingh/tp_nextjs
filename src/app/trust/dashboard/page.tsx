"use client";

import { TrustAuthGuard } from "@/components/trust/TrustAuthGuard";
import TrustDashboard from "@/views/trust/TrustDashboard";

export default function TrustDashboardPage() {
  return (
    <TrustAuthGuard>
      <TrustDashboard />
    </TrustAuthGuard>
  );
}
