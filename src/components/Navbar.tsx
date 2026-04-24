import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Lazy-load the tutor registration modal — it's only needed when the user clicks the CTA.
const TutorRegistrationModal = lazy(() => import("./TutorRegistrationModal"));

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  {
    label: "Counselling",
    href: "/counselling",
    children: [
      { label: "All Counselling", href: "/counselling" },
      { label: "Student Counselling", href: "/counselling/student" },
      { label: "Parent Counselling", href: "/counselling/parent" },
      { label: "Personal Counselling", href: "/counselling/personal" },
    ],
  },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLazyCta, setShowLazyCta] = useState(false);
  const [lazyCTADismissed, setLazyCTADismissed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [loginMobileDropdownOpen, setLoginMobileDropdownOpen] = useState(false);
  const [tutorModalOpen, setTutorModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const loginDropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loginCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      // Show lazy CTA after 40% scroll
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && window.scrollY / docHeight >= 0.4) {
        setShowLazyCta(true);
      } else {
        setShowLazyCta(false);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(e.target as Node)) {
        setLoginDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      if (loginCloseTimeoutRef.current) clearTimeout(loginCloseTimeoutRef.current);
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

  const handleLoginDropdownEnter = useCallback(() => {
    if (loginCloseTimeoutRef.current) {
      clearTimeout(loginCloseTimeoutRef.current);
      loginCloseTimeoutRef.current = null;
    }
    setLoginDropdownOpen(true);
  }, []);

  const handleLoginDropdownLeave = useCallback(() => {
    loginCloseTimeoutRef.current = setTimeout(() => {
      setLoginDropdownOpen(false);
    }, 400);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    setMobileDropdownOpen(false);
    if (pathname === "/" && href.startsWith("/#")) {
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
              className={`${mobileLinkClass} flex items-center gap-1 w-full min-h-[44px]`}
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
                    <Link key={child.label} href={child.href} className={`${mobileLinkClass} min-h-[44px] flex items-center`} onClick={() => handleNavClick(child.href)}>
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
                      href={child.href}
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
      if (pathname === "/") {
        return (
          <a key={link.label} href={link.href.replace("/", "")} className={cls}
            onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}>
            {link.label}
          </a>
        );
      }
      return <Link key={link.label} href={link.href} className={cls} onClick={() => setIsOpen(false)}>{link.label}</Link>;
    }

    const isActive = pathname === link.href;
    return (
      <Link key={link.label} href={link.href} className={`${cls} ${isActive ? "!text-primary" : ""}`} onClick={() => setIsOpen(false)}>
        {link.label}
      </Link>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" : "bg-background/95 backdrop-blur-md border-b border-border"}`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">T</span>
          </div>
          <span className="font-heading font-bold text-xl text-foreground">
            Tutors <span className="text-primary">Parliament</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => renderLink(link))}
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={() => router.push("/become-a-tutor")}>Become a Tutor</Button>
          
          {/* Login Dropdown */}
          <div
            className="relative"
            ref={loginDropdownRef}
            onMouseEnter={handleLoginDropdownEnter}
            onMouseLeave={handleLoginDropdownLeave}
          >
            <button
              className={`${linkClass} flex items-center gap-1 min-h-[44px]`}
              onClick={() => setLoginDropdownOpen((prev) => !prev)}
            >
              Login <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${loginDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {loginDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full right-0 mt-1 pt-2"
                >
                  <div className="w-56 bg-background rounded-xl border border-border card-shadow py-2 z-50">
                    <Link
                      href="/institute-login"
                      className="block px-5 py-3 text-sm text-muted-foreground hover:text-primary hover:bg-accent/60 transition-colors"
                      onClick={() => setLoginDropdownOpen(false)}
                    >
                      Institute / Bureau
                    </Link>
                    <Link
                      href="/tutor-login"
                      className="block px-5 py-3 text-sm text-muted-foreground hover:text-primary hover:bg-accent/60 transition-colors"
                      onClick={() => setLoginDropdownOpen(false)}
                    >
                      Tutor
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {pathname.startsWith("/counselling") ? (
            <Button variant="cta" size="lg" onClick={() => router.push("/counselling#counselling-form")}>Request Callback</Button>
          ) : (
            <Button variant="cta" size="lg" onClick={() => router.push("/demo-booking")}>Start Free Demo</Button>
          )}
        </div>

        <button className="md:hidden text-foreground p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
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
            
            {/* Mobile Login Dropdown */}
            <div key="mobile-login">
              <button
                className={`${mobileLinkClass} flex items-center gap-1 w-full min-h-[44px]`}
                onClick={() => setLoginMobileDropdownOpen(!loginMobileDropdownOpen)}
              >
                Login <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${loginMobileDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {loginMobileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-4 space-y-1 overflow-hidden"
                  >
                    <Link href="/institute-login" className={`${mobileLinkClass} min-h-[44px] flex items-center`} onClick={() => { setIsOpen(false); setLoginMobileDropdownOpen(false); }}>
                      Institute / Bureau
                    </Link>
                    <Link href="/tutor-login" className={`${mobileLinkClass} min-h-[44px] flex items-center`} onClick={() => { setIsOpen(false); setLoginMobileDropdownOpen(false); }}>
                      Tutor
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button variant="outline" className="w-full mt-2 h-12" onClick={() => { setIsOpen(false); router.push("/become-a-tutor"); }}>Become a Tutor</Button>
            {pathname.startsWith("/counselling") ? (
              <Button variant="cta" className="w-full mt-2 h-12" onClick={() => { setIsOpen(false); router.push("/counselling#counselling-form"); }}>Request Callback</Button>
            ) : (
              <Button variant="cta" className="w-full mt-2 h-12" onClick={() => { setIsOpen(false); router.push("/demo-booking"); }}>Start Free Demo</Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lazy sticky "Become a Tutor" — appears after 40% scroll, dismissible */}
      <AnimatePresence>
        {showLazyCta && !lazyCTADismissed && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden md:flex fixed top-16 left-0 right-0 z-40 bg-primary/95 backdrop-blur-sm items-center justify-center gap-3 py-2 text-primary-foreground text-sm"
          >
            <span>Want to teach? Join 1000+ tutors earning with Tutors Parliament.</span>
            <Button variant="hero" size="sm" className="h-8 text-xs" onClick={() => setTutorModalOpen(true)}>
              Become a Tutor
            </Button>
            <button
              onClick={() => setLazyCTADismissed(true)}
              className="absolute right-4 p-1 hover:bg-primary-foreground/10 rounded"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {tutorModalOpen && (
        <Suspense fallback={null}>
          <TutorRegistrationModal open={tutorModalOpen} onOpenChange={setTutorModalOpen} />
        </Suspense>
      )}
    </nav>
  );
};

export default Navbar;

