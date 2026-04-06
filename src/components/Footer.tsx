import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-foreground text-primary-foreground/80 section-padding pb-8">
      <div className="container mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <span className="font-heading font-bold text-xl text-primary-foreground">
                Tutors Parliament
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              India's trusted online tutoring platform connecting students with expert educators for personalized learning and exam success.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-primary-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {["Home", "About Us", "Courses", "Tutors", "Results", "Contact"].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(" ", "")}`} className="hover:text-primary-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-heading font-semibold text-primary-foreground mb-4">Popular Courses</h4>
            <ul className="space-y-2 text-sm">
              {["UPSC Preparation", "SSC Coaching", "Banking Exams", "School Tuitions", "JEE/NEET Prep"].map((c) => (
                <li key={c}>
                  <a href="#courses" className="hover:text-primary-foreground transition-colors">{c}</a>
                </li>
              ))}
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
          </div>
        </div>

        {/* SEO block */}
        <div className="border-t border-primary-foreground/10 pt-8 mt-8">
          <p className="text-xs text-primary-foreground/50 text-center max-w-3xl mx-auto mb-6">
            Tutors Parliament is India's leading online tutoring platform offering expert coaching for UPSC, SSC, Banking exams, school tuitions (CBSE, ICSE), JEE, NEET, and more. Our personalized learning plans and 500+ experienced tutors help students achieve academic excellence. Find the best online tutors in India for competitive exam preparation and personalized learning.
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
