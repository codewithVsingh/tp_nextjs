import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TutorRegistrationModal from "./TutorRegistrationModal";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Courses", href: "/courses" },
  {
    label: "Counselling",
    href: "#",
    children: [
      { label: "Student Counselling", href: "/counselling/student" },
      { label: "Parent Counselling", href: "/counselling/parent" },
      { label: "Personal Counselling", href: "/counselling/personal" },
    ],
  },
  { label: "Tutors", href: "/#tutors" },
  { label: "Results", href: "/#testimonials" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [tutorModalOpen, setTutorModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleDropdownEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setDropdownOpen(true);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 400);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    setMobileDropdownOpen(false);
    if (location.pathname === "/" && href.startsWith("/#")) {
      const el = document.querySelector(href.replace("/", ""));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const linkClass = "text-sm font-medium text-muted-foreground hover:text-primary transition-colors";
  const mobileLinkClass = "block py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors";

  const renderLink = (link: typeof navLinks[0], mobile = false) => {
    const cls = mobile ? mobileLinkClass : linkClass;

    if (link.children) {
      if (mobile) {
        return (
          <div key={link.label}>
            <button
              className={`${mobileLinkClass} flex items-center gap-1 w-full`}
              onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
            >
              {link.label} <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {mobileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-4 space-y-1 overflow-hidden"
                >
                  {link.children.map((child) => (
                    <Link key={child.label} to={child.href} className={mobileLinkClass} onClick={() => handleNavClick(child.href)}>
                      {child.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      }
      return (
        <div
          key={link.label}
          className="relative"
          ref={dropdownRef}
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleDropdownLeave}
        >
          <button
            className={`${cls} flex items-center gap-1`}
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            {link.label} <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full left-0 mt-1 pt-2"
              >
                <div className="w-60 bg-background rounded-xl border border-border card-shadow py-2 z-50">
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.href}
                      className="block px-5 py-3 text-sm text-muted-foreground hover:text-primary hover:bg-accent/60 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (link.href.startsWith("/#")) {
      if (location.pathname === "/") {
        return (
          <a key={link.label} href={link.href.replace("/", "")} className={cls}
            onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}>
            {link.label}
          </a>
        );
      }
      return <Link key={link.label} to={link.href} className={cls} onClick={() => setIsOpen(false)}>{link.label}</Link>;
    }

    const isActive = location.pathname === link.href;
    return (
      <Link key={link.label} to={link.href} className={`${cls} ${isActive ? "!text-primary" : ""}`} onClick={() => setIsOpen(false)}>
        {link.label}
      </Link>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" : "bg-background/95 backdrop-blur-md border-b border-border"}`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">T</span>
          </div>
          <span className="font-heading font-bold text-xl text-foreground">
            Tutors <span className="text-primary">Parliament</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => renderLink(link))}
          <Button variant="outline" size="sm" onClick={() => setTutorModalOpen(true)}>Become a Tutor</Button>
          <Button variant="cta" size="lg" onClick={() => navigate("/demo-booking")}>Start Free Demo</Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border px-4 pb-4 overflow-hidden"
          >
            {navLinks.map((link) => renderLink(link, true))}
            <Button variant="outline" className="w-full mt-2" onClick={() => { setIsOpen(false); setTutorModalOpen(true); }}>Become a Tutor</Button>
            <Button variant="cta" className="w-full mt-2" onClick={() => { setIsOpen(false); navigate("/demo-booking"); }}>Start Free Demo</Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
        <Button variant="cta" className="w-full shadow-xl" onClick={() => setTutorModalOpen(true)}>
          Teach & Earn 💰
        </Button>
      </div>

      <TutorRegistrationModal open={tutorModalOpen} onOpenChange={setTutorModalOpen} />
    </nav>
  );
};

export default Navbar;
