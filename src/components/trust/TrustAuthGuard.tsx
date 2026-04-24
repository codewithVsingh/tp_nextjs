"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useTrustAuth } from "./TrustAuthContext";

interface TrustAuthGuardProps {
  children: ReactNode;
}

export const TrustAuthGuard = ({ children }: TrustAuthGuardProps) => {
  const { user, loading } = useTrustAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/institute-login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

