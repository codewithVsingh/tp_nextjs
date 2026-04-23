import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, CheckCircle, Users, Clock } from "lucide-react";
import heroImage from "@/assets/hero-students.jpg";

const formatPhone = (raw: string) => {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)} ${d.slice(5)}`;
};

const HeroSection = () => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handlePhoneChange = (raw: string) => {
    setPhone(raw.replace(/\D/g, "").slice(0, 10));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    const params = new URLSearchParams();
    params.set("phone", phone);
    if (name.trim()) params.set("name", name.trim());
    router.push(`/demo-booking?${params.toString()}`);
  };

  const handleCTAClick = () => {
    router.push("/demo-booking");
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      style={{ background: "var(--hero-gradient)" }}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Happy students studying"
          fill
          priority
          className="object-cover opacity-15"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60 z-[1]" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Button variant="hero" size="lg" className="text-base px-8 py-6" onClick={handleCTAClick}>
                Start Free Demo
              </Button>
              <Button variant="ghost" size="lg" className="text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 text-base font-medium" asChild>
                <a href="/courses">Explore Courses →</a>
              </Button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-4 mt-6">
              <span className="flex items-center gap-1.5 text-primary-foreground/70 text-sm">
                <Users className="w-4 h-4" /> 10,000+ students
              </span>
              <span className="flex items-center gap-1.5 text-primary-foreground/70 text-sm">
                <Clock className="w-4 h-4" /> Free demo in 24 hrs
              </span>
              <span className="flex items-center gap-1.5 text-primary-foreground/70 text-sm">
                <CheckCircle className="w-4 h-4" /> Verified tutors
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="bg-background rounded-2xl p-8 card-shadow max-w-md ml-auto">
              <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                Find the Right Tutor
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Enter your number — we'll match you with the perfect tutor
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <Input
                    placeholder="Your Name (optional)"
                    className="h-12 rounded-lg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Phone Number *"
                    type="tel"
                    inputMode="numeric"
                    maxLength={11}
                    className={`h-12 rounded-lg ${error ? "border-destructive" : ""}`}
                    value={formatPhone(phone)}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                  />
                  {error && <p className="text-destructive text-xs mt-1">{error}</p>}
                </div>
                <Button variant="cta" className="w-full h-12 text-base">
                  Continue
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                ⚡ Takes less than 30 seconds
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
