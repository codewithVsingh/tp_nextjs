"use client";

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const AdminFunnel = dynamic(() => import("@/views/admin/AdminFunnel"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )
});

export default function Page() {
  return <AdminFunnel />;
}
