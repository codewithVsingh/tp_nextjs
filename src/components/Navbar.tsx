import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Courses", href: "/#courses" },
  { label: "Tutors", href: "/#tutors" },
  { label: "Results", href: "/#testimonials" },
  { label: "Contact", href: "/#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Handle hash scrolling when navigating from another page
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    // If we're on the same page and it's a hash link
    if (location.pathname === "/" && href.startsWith("/#")) {
      const el = document.querySelector(href.replace("/", ""));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderLink = (link: { label: string; href: string }, className: string) => {
    if (link.href.startsWith("/#")) {
      if (location.pathname === "/") {
        return (
          <a
            key={link.label}
            href={link.href.replace("/", "")}
            className={className}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(link.href);
            }}
          >
            {link.label}
          </a>
        );
      }
      return (
        <Link key={link.label} to={link.href} className={className} onClick={() => setIsOpen(false)}>
          {link.label}
        </Link>
      );
    }

    const isActive = location.pathname === link.href;
    return (
      <Link
        key={link.label}
        to={link.href}
        className={`${className} ${isActive ? "!text-primary" : ""}`}
        onClick={() => setIsOpen(false)}
      >
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

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            renderLink(link, "text-sm font-medium text-muted-foreground hover:text-primary transition-colors")
          )}
          <Button variant="cta" size="lg">
            Book Free Demo
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4">
          {navLinks.map((link) =>
            renderLink(link, "block py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors")
          )}
          <Button variant="cta" className="w-full mt-2">
            Book Free Demo
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
