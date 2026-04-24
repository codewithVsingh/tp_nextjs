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
  openGraph: {
    title: "Tutors Parliament | India's Leading Home & Online Tuition Platform",
    description: "Verified home tutors for all subjects and boards. Personalized 1-on-1 learning to help your child excel.",
    url: "https://tutorsparliament.com",
    siteName: "Tutors Parliament",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

