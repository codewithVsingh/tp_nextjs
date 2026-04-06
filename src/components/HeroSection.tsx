import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import heroImage from "@/assets/hero-students.jpg";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      style={{ background: "var(--hero-gradient)" }}
    >
      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              <span className="text-primary-foreground/80 text-sm font-medium">
                Trusted by 10,000+ Students
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-primary-foreground leading-tight mb-6">
              Unlock Your Academic Potential.{" "}
              <span className="text-secondary">All in One Place.</span>
            </h1>

            <p className="text-primary-foreground/80 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
              Join India's fastest-growing tutoring platform — where expert guidance
              meets personalized learning to help you succeed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-base px-8 py-6">
                Book Free Demo
              </Button>
              <Button variant="hero-outline" size="lg" className="text-base px-8 py-6">
                Explore Courses
              </Button>
            </div>
          </motion.div>

          {/* Right: Lead form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="bg-background rounded-2xl p-8 card-shadow max-w-md ml-auto">
              <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                Get Started for Free
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Book your free demo class today
              </p>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <Input placeholder="Your Name" className="h-12 rounded-lg" />
                <Input placeholder="Email Address" type="email" className="h-12 rounded-lg" />
                <Input placeholder="Phone Number" type="tel" className="h-12 rounded-lg" />
                <Button variant="cta" className="w-full h-12 text-base">
                  Book Free Demo
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                No credit card required • Free consultation
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
