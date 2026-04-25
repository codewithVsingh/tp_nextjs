"use client";

import { usePathname } from "next/navigation";
import TopBanner from "@/components/TopBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Define routes where we DONT want the public Navbar and Footer (Dashboards)
  // We want to KEEP the layout on login pages (/institute-login, /tutor-login, /admin/login)
  const isDashboard = 
    pathname?.startsWith('/trust') || 
    (pathname?.startsWith('/admin') && pathname !== '/admin/login');

  const shouldShowLayout = !isDashboard;

  return (
    <>
      {shouldShowLayout && <TopBanner />}
      {shouldShowLayout && <Navbar />}
      <main>{children}</main>
      {shouldShowLayout && <Footer />}
      {shouldShowLayout && <WhatsAppButton />}
    </>
  );
}
