import { Mail, Phone, MapPin, ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const seoSections = [
  {
    id: "locations",
    title: "Tutors by Location",
    items: [
      { label: "Home Tutor in South Delhi", slug: "south-delhi-delhi" },
      { label: "Home Tutor in North Delhi", slug: "north-delhi-delhi" },
      { label: "Home Tutor in West Delhi", slug: "west-delhi-delhi" },
      { label: "Home Tutor in Dwarka", slug: "dwarka-delhi" },
      { label: "Home Tutor in Rohini", slug: "rohini-delhi" },
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
    ],
    viewAllLabel: "View All Subjects",
    viewAllLink: "/courses",
  },
  {
    id: "languages",
    title: "Tutors by Language",
    items: [
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
    <footer id="contact" className="bg-foreground text-primary-foreground/70">
      {/* Top: Brand + Trust + CTA */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-12">
          {/* Left: Brand */}
          <div className="max-w-md">
            <Link to="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <span className="font-heading font-bold text-xl text-primary-foreground">
                Tutors Parliament
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Delhi's trusted platform for home &amp; online tutors, exam prep, and counselling.
            </p>
          </div>

          {/* Right: Trust + CTAs */}
          <div className="flex flex-col items-start lg:items-end gap-5">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-primary-foreground/60">
              <span>✔ 8500+ Students</span>
              <span>✔ Verified Tutors</span>
              <span>✔ 4.8 Rating</span>
              <span>✔ Serving Delhi NCR</span>
            </div>
            <div className="flex gap-3">
              <Button variant="cta" size="sm" asChild>
                <Link to="/demo">Find a Tutor</Link>
              </Button>
              <Button variant="hero-outline" size="sm" asChild>
                <Link to="/become-a-tutor">Become a Tutor</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/10 mb-10" />

        {/* Middle: 3 columns + Contact */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          <div>
            <h4 className="font-heading font-semibold text-primary-foreground text-sm mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary-foreground transition-colors">About Us</Link></li>
              <li><Link to="/courses" className="hover:text-primary-foreground transition-colors">Courses</Link></li>
              <li><Link to="/blog" className="hover:text-primary-foreground transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-primary-foreground text-sm mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/courses" className="hover:text-primary-foreground transition-colors">Home Tuition</Link></li>
              <li><Link to="/courses" className="hover:text-primary-foreground transition-colors">Online Tuition</Link></li>
              <li><Link to="/counselling/student" className="hover:text-primary-foreground transition-colors">Counselling</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-primary-foreground text-sm mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/faq" className="hover:text-primary-foreground transition-colors">FAQs</Link></li>
              <li><a href="mailto:info@tutorsparliament.com" className="hover:text-primary-foreground transition-colors">Contact Us</a></li>
              <li><span className="cursor-default">Privacy Policy</span></li>
              <li><span className="cursor-default">Terms &amp; Conditions</span></li>
            </ul>
          </div>

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
                <span>New Delhi, India</span>
              </li>
            </ul>
            <a
              href="https://wa.me/919873101564?text=Hi%2C%20I%27m%20interested%20in%20learning%20more%20about%20Tutors%20Parliament"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-xs font-medium text-primary-foreground bg-[#25D366]/20 hover:bg-[#25D366]/30 px-3 py-1.5 rounded-full transition-colors"
            >
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/10 mb-8" />

        {/* SEO Accordion */}
        <Accordion type="multiple" className="mb-8">
          {seoSections.map((section) => (
            <AccordionItem key={section.id} value={section.id} className="border-primary-foreground/10">
              <AccordionTrigger className="text-sm font-heading font-semibold text-primary-foreground/80 hover:text-primary-foreground hover:no-underline py-3">
                {section.title}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs mb-2">
                  {section.items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        to={`/tutors/${item.slug}`}
                        className="flex items-center gap-1 hover:text-primary-foreground transition-colors"
                      >
                        <ArrowRight className="w-3 h-3 text-secondary shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to={section.viewAllLink}
                  className="text-xs font-medium text-secondary hover:text-secondary/80 transition-colors"
                >
                  {section.viewAllLabel} →
                </Link>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Bottom strip */}
        <div className="border-t border-primary-foreground/10 pt-6 text-center">
          <p className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} Tutors Parliament · Serving Delhi NCR · All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
