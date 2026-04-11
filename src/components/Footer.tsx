import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const footerSeoSections = [
  {
    title: "Tutors By Language",
    items: [
      { label: "French Home Tutor in Delhi", slug: "french-delhi" },
      { label: "German Home Tutor in Delhi", slug: "german-delhi" },
      { label: "Spanish Home Tutor in Delhi", slug: "spanish-delhi" },
      { label: "Hindi Home Tutor in Delhi", slug: "hindi-delhi" },
      { label: "English Speaking Tutor in Delhi", slug: "english-delhi" },
    ],
  },
  {
    title: "Tutors By Location",
    items: [
      { label: "Home Tutor in South Delhi", slug: "south-delhi-delhi" },
      { label: "Home Tutor in North Delhi", slug: "north-delhi-delhi" },
      { label: "Home Tutor in East Delhi", slug: "east-delhi-delhi" },
      { label: "Home Tutor in West Delhi", slug: "west-delhi-delhi" },
      { label: "Home Tutor in Dwarka", slug: "dwarka-delhi" },
      { label: "Home Tutor in Rohini", slug: "rohini-delhi" },
    ],
  },
  {
    title: "Tutors By Subject",
    items: [
      { label: "Maths Home Tutor in Delhi", slug: "math-delhi" },
      { label: "Science Home Tutor in Delhi", slug: "science-delhi" },
      { label: "Physics Home Tutor in Delhi", slug: "physics-delhi" },
      { label: "Chemistry Home Tutor in Delhi", slug: "chemistry-delhi" },
      { label: "English Home Tutor in Delhi", slug: "english-delhi" },
      { label: "Accounts Home Tutor in Delhi", slug: "accounts-delhi" },
    ],
  },
];

const Footer = () => {
  return (
    <footer id="contact" className="bg-foreground text-primary-foreground/80 section-padding pb-8">
      <div className="container mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <span className="font-heading font-bold text-xl text-primary-foreground">
                Tutors Parliament
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Delhi's trusted tutoring platform connecting students with expert educators for personalized learning, board exam preparation, and career counselling.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-primary-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary-foreground transition-colors">About Us</Link></li>
              <li><Link to="/courses" className="hover:text-primary-foreground transition-colors">Courses</Link></li>
              <li><Link to="/counselling/student" className="hover:text-primary-foreground transition-colors">Student Counselling</Link></li>
              <li><Link to="/counselling/parent" className="hover:text-primary-foreground transition-colors">Parent Counselling</Link></li>
              <li><Link to="/counselling/personal" className="hover:text-primary-foreground transition-colors">Personal Counselling</Link></li>
              <li><a href="/faq" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Our Programs */}
          <div>
            <h4 className="font-heading font-semibold text-primary-foreground mb-4">Our Programs</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="hover:text-primary-foreground transition-colors">CBSE Tuition</Link></li>
              <li><Link to="/courses" className="hover:text-primary-foreground transition-colors">ICSE Coaching</Link></li>
              <li><Link to="/courses" className="hover:text-primary-foreground transition-colors">JEE / NEET Prep</Link></li>
              <li><Link to="/courses" className="hover:text-primary-foreground transition-colors">Spoken English</Link></li>
              <li><Link to="/blog" className="hover:text-primary-foreground transition-colors">📝 Blog & Articles</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-primary-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary" />
                <span>info@tutorsparliament.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-secondary mt-0.5" />
                <span>New Delhi, India</span>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="text-xs bg-primary-foreground/10 px-3 py-1.5 rounded-full">✅ Verified Tutors</span>
              <span className="text-xs bg-primary-foreground/10 px-3 py-1.5 rounded-full">👨‍🎓 8500+ Students</span>
              <span className="text-xs bg-primary-foreground/10 px-3 py-1.5 rounded-full">⭐ 4.8 Average Rating</span>
              <span className="text-xs bg-primary-foreground/10 px-3 py-1.5 rounded-full">📍 Serving Delhi NCR</span>
            </div>
          </div>
        </div>

        {/* SEO Link Sections */}
        <div className="border-t border-primary-foreground/10 pt-8 mb-8">
          <div className="grid sm:grid-cols-3 gap-8">
            {footerSeoSections.map((section) => (
              <div key={section.title}>
                <h4 className="font-heading font-semibold text-primary-foreground text-sm mb-3">
                  {section.title}
                </h4>
                <ul className="space-y-1.5 text-xs">
                  {section.items.map((item) => (
                    <li key={item}>
                      <span className="flex items-center gap-1.5 hover:text-primary-foreground transition-colors cursor-default">
                        <ArrowRight className="w-3 h-3 text-secondary shrink-0" />
                        {item}
                      </span>
                    </li>
                  ))}
                  <li>
                    <span className="inline-flex items-center gap-1 mt-1 text-secondary font-semibold cursor-default">
                      View All →
                    </span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <p className="text-xs text-primary-foreground/50 text-center max-w-3xl mx-auto mb-6">
            Tutors Parliament is Delhi's leading tutoring platform offering expert home tutors, online tuition classes for CBSE, ICSE, State Boards, JEE, NEET preparation, and professional counselling services. Find the best private tutors in Delhi NCR for personalized learning and academic excellence. We serve students from KG to Class 12 with online and offline coaching across all subjects.
          </p>
          <p className="text-sm text-primary-foreground/50 text-center">
            © {new Date().getFullYear()} Tutors Parliament. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
