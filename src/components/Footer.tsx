import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { openWhatsApp } from "@/lib/whatsapp";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FooterCTAStrip from "@/components/FooterCTAStrip";

const footerSections = [
  {
    id: "explore",
    title: "Explore",
    items: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Courses", href: "/courses" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    id: "services",
    title: "Services",
    items: [
      { label: "Home Tuition", href: "/courses" },
      { label: "Online Tuition", href: "/courses" },
      { label: "Counselling", href: "/counselling/student" },
    ],
  },
  {
    id: "support",
    title: "Support",
    items: [
      { label: "FAQs", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
    ],
  },
];

// All slugs below resolve via existing TutorSeoPage routing (parseSlug → legacy
// area-delhi / subject-delhi patterns, ALIAS_MAP, and subject-tuition-in-area-class-N).
// DO NOT add slugs that are not covered by these resolvers — they will 404.
const seoSections = [
  {
    id: "locations",
    title: "Tutors by Location",
    items: [
      { label: "Home Tutor in South Delhi", slug: "south-delhi-delhi" },
      { label: "Home Tutor in North Delhi", slug: "north-delhi-delhi" },
      { label: "Home Tutor in West Delhi", slug: "west-delhi-delhi" },
      { label: "Home Tutor in East Delhi", slug: "east-delhi-delhi" },
      { label: "Home Tutor in Dwarka", slug: "dwarka-delhi" },
      { label: "Home Tutor in Rohini", slug: "rohini-delhi" },
      { label: "Home Tutor in Noida", slug: "noida-delhi" },
      { label: "Home Tutor in Gurgaon", slug: "gurgaon-delhi" },
    ],
    viewAllLabel: "View All Locations",
    viewAllLink: "/courses",
  },
  {
    id: "subjects",
    title: "Tutors by Subject",
    items: [
      { label: "Maths Home Tutor", slug: "math-delhi" },
      { label: "Science Home Tutor", slug: "science-delhi" },
      { label: "Physics Home Tutor", slug: "physics-delhi" },
      { label: "Chemistry Home Tutor", slug: "chemistry-delhi" },
      { label: "Biology Home Tutor", slug: "biology-delhi" },
      { label: "English Home Tutor", slug: "english-delhi" },
      { label: "Accounts Home Tutor", slug: "accounts-delhi" },
      { label: "Economics Home Tutor", slug: "economics-delhi" },
    ],
    viewAllLabel: "View All Subjects",
    viewAllLink: "/courses",
  },
  {
    id: "class-board",
    title: "Tutors by Class & Board",
    items: [
      { label: "Class 6–8 Home Tutors", slug: "math-tuition-in-south-delhi-class-8" },
      { label: "Class 9–10 Home Tutors", slug: "math-tuition-in-south-delhi-class-10" },
      { label: "Class 11–12 Home Tutors", slug: "math-tuition-in-south-delhi-class-12" },
      { label: "CBSE Home Tutors in Delhi", slug: "cbse-tuition-delhi" },
      { label: "ICSE Home Tutors in Delhi", slug: "math-home-tutor-south-delhi-class-10-icse" },
    ],
    viewAllLabel: "View All Boards",
    viewAllLink: "/courses",
  },
  {
    id: "languages",
    title: "Tutors by Language",
    items: [
      { label: "Hindi Home Tutor", slug: "hindi-delhi" },
      { label: "English Speaking Tutor", slug: "english-delhi" },
      { label: "French Tutor", slug: "french-delhi" },
      { label: "German Tutor", slug: "german-delhi" },
      { label: "Spanish Tutor", slug: "spanish-delhi" },
    ],
    viewAllLabel: "View All Languages",
    viewAllLink: "/courses",
  },
];

const Footer = () => {
  return (
    <>
      <FooterCTAStrip />
      <footer id="contact" className="bg-foreground text-primary-foreground/70">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Brand + Trust + CTA */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-10">
          <div className="max-w-md">
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <span className="font-heading font-bold text-xl text-primary-foreground">
                Tutors Parliament
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              India's trusted platform for home &amp; online tutors, exam prep, and counselling.
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-4">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-primary-foreground/60">
              <span>✔ 10,000+ Students</span>
              <span>✔ 2,500+ Verified Tutors</span>
              <span>✔ 4.8★ Rating</span>
              <span>✔ Pan-India Online · Select Cities In-Person</span>
            </div>
            <div className="flex gap-3">
              <Button variant="cta" size="sm" className="h-12 px-6 active:scale-[0.96] transition-transform" asChild>
                <Link href="/demo-booking">Start Free Demo</Link>
              </Button>
              <Button variant="hero-outline" size="sm" className="h-12 px-6 active:scale-[0.96] transition-transform" asChild>
                <Link href="/become-a-tutor">Become a Tutor</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mb-8" />

        {/* Desktop: Grid layout | Mobile: Accordion */}
        {/* Desktop columns */}
        <div className="hidden md:grid grid-cols-4 gap-8 mb-10">
          {footerSections.map((section) => (
            <div key={section.id}>
              <h4 className="font-heading font-semibold text-primary-foreground text-sm mb-4">{section.title}</h4>
              <ul className="space-y-2.5 text-sm">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="hover:text-primary-foreground transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="font-heading font-semibold text-primary-foreground text-sm mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <span>info@tutorsparliament.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <a href="tel:+919873101564" className="hover:text-primary-foreground transition-colors">+91-9873101564</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>India · Online Pan-India</span>
              </li>
            </ul>
            <button
              onClick={() => openWhatsApp("Hi, I'm interested in learning more about Tutors Parliament")}
              className="inline-flex items-center gap-2 mt-4 text-xs font-medium text-primary-foreground bg-[#25D366]/20 hover:bg-[#25D366]/30 px-3 py-1.5 rounded-full transition-colors"
            >
              💬 Chat on WhatsApp
            </button>
          </div>
        </div>

        {/* Mobile accordion */}
        <div className="md:hidden mb-8">
          <Accordion type="multiple">
            {footerSections.map((section) => (
              <AccordionItem key={section.id} value={section.id} className="border-primary-foreground/10">
                <AccordionTrigger className="text-sm font-heading font-semibold text-primary-foreground/80 hover:text-primary-foreground hover:no-underline py-3 min-h-[44px]">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1 text-sm">
                    {section.items.map((item) => (
                      <li key={item.label}>
                        <Link href={item.href} className="block py-2 min-h-[44px] flex items-center hover:text-primary-foreground transition-colors">{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
            <AccordionItem value="contact" className="border-primary-foreground/10">
              <AccordionTrigger className="text-sm font-heading font-semibold text-primary-foreground/80 hover:text-primary-foreground hover:no-underline py-3 min-h-[44px]">
                Contact
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2 min-h-[44px]">
                    <Mail className="w-4 h-4 text-secondary shrink-0" />
                    <span>info@tutorsparliament.com</span>
                  </li>
                  <li className="flex items-center gap-2 min-h-[44px]">
                    <Phone className="w-4 h-4 text-secondary shrink-0" />
                    <a href="tel:+919873101564" className="hover:text-primary-foreground transition-colors">+91-9873101564</a>
                  </li>
                  <li className="flex items-start gap-2 min-h-[44px]">
                    <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span>India · Online Pan-India</span>
                  </li>
                </ul>
                <button
                  onClick={() => openWhatsApp("Hi, I'm interested in learning more about Tutors Parliament")}
                  className="inline-flex items-center gap-2 mt-3 text-xs font-medium text-primary-foreground bg-[#25D366]/20 hover:bg-[#25D366]/30 px-3 py-2 rounded-full transition-colors min-h-[44px]"
                >
                  💬 Chat on WhatsApp
                </button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="border-t border-primary-foreground/10 mb-8" />

        {/* SEO Accordion — both desktop and mobile */}
        <Accordion type="multiple" className="mb-8">
          {seoSections.map((section) => (
            <AccordionItem key={section.id} value={section.id} className="border-primary-foreground/10">
              <AccordionTrigger className="text-sm font-heading font-semibold text-primary-foreground/80 hover:text-primary-foreground hover:no-underline py-3 min-h-[44px]">
                {section.title}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs mb-2">
                  {section.items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/tutors/${item.slug}`}
                        className="flex items-center gap-1 hover:text-primary-foreground transition-colors py-1 min-h-[44px]"
                      >
                        <ArrowRight className="w-3 h-3 text-secondary shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={section.viewAllLink}
                  className="text-xs font-medium text-secondary hover:text-secondary/80 transition-colors"
                >
                  {section.viewAllLabel} →
                </Link>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Trust signals (lightweight inline) */}
        <div className="border-t border-primary-foreground/10 pt-6 pb-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-primary-foreground/60">
          <span>⭐ 4.8+ Rating</span>
          <span>👨‍🎓 10,000+ Students</span>
          <span>✅ 2,500+ Verified Tutors</span>
        </div>

        {/* Bottom strip */}
        <div className="text-center">
          <p className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} Tutors Parliament · Online across India · All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;
