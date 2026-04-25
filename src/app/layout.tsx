import type { Metadata } from "next";
import "../index.css";
import { Providers } from "./Providers";

export const metadata: Metadata = {
  title: {
    default: "Tutors Parliament | India's Leading Home & Online Tuition Platform",
    template: "%s | Tutors Parliament"
  },
  description: "Connect with 2,500+ verified home tutors in Delhi, Noida, Gurgaon & beyond. Expert 1-on-1 coaching for CBSE, ICSE, IB & competitive exams. Book a free demo class today!",
  metadataBase: new URL("https://tutorsparliament.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/brand/favicon/favicon.ico" },
      { url: "/brand/favicon/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon/favicon-64.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [
      { url: "/brand/app/apple-touch-icon.png" },
    ],
    other: [
      { rel: "icon", url: "/brand/app/icon-192.png", sizes: "192x192" },
      { rel: "icon", url: "/brand/app/icon-512.png", sizes: "512x512" },
    ],
  },
  openGraph: {
    title: "Tutors Parliament | India's Leading Home & Online Tuition Platform",
    description: "Verified home tutors for all subjects and boards. Personalized 1-on-1 learning to help your child excel.",
    url: "https://tutorsparliament.com",
    siteName: "Tutors Parliament",
    images: [
      {
        url: "/brand/app/icon-512.png",
        width: 512,
        height: 512,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

import ConditionalLayout from "@/components/ConditionalLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}

