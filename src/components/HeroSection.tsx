import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, CheckCircle, AlertCircle } from "lucide-react";
import heroImage from "@/assets/hero-students.jpg";

interface FormData {
  name: string;
  email: string;
  phone: string;
}

const HeroSection = () => {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email is required";
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, "").length < 10) newErrors.phone = "Valid phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      // Ready for Formspree or API integration
      // const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });
      // if (!res.ok) throw new Error("Failed");
      await new Promise((r) => setTimeout(r, 1000)); // Simulated
      setStatus("success");
      setFormData({ name: "", email: "", phone: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      style={{ background: "var(--hero-gradient)" }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />

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

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-base px-8 py-6">
                Book Free Demo
              </Button>
              <Button variant="hero-outline" size="lg" className="text-base px-8 py-6">
                Explore Courses
              </Button>
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
                Get Started for Free
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Book your free demo class today
              </p>

              {status === "success" ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                  <p className="font-heading font-semibold text-foreground">Thank you!</p>
                  <p className="text-muted-foreground text-sm text-center">We'll contact you shortly to schedule your free demo.</p>
                  <Button variant="ghost" className="mt-2 text-primary" onClick={() => setStatus("idle")}>
                    Submit Another
                  </Button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <Input
                      placeholder="Your Name"
                      className={`h-12 rounded-lg ${errors.name ? "border-destructive" : ""}`}
                      value={formData.name}
                      onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: undefined }); }}
                    />
                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Input
                      placeholder="Email Address"
                      type="email"
                      className={`h-12 rounded-lg ${errors.email ? "border-destructive" : ""}`}
                      value={formData.email}
                      onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: undefined }); }}
                    />
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Input
                      placeholder="Phone Number"
                      type="tel"
                      className={`h-12 rounded-lg ${errors.phone ? "border-destructive" : ""}`}
                      value={formData.phone}
                      onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setErrors({ ...errors, phone: undefined }); }}
                    />
                    {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                  </div>
                  {status === "error" && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Something went wrong. Please try again.</span>
                    </div>
                  )}
                  <Button variant="cta" className="w-full h-12 text-base" disabled={status === "loading"}>
                    {status === "loading" ? "Submitting..." : "Book Free Demo"}
                  </Button>
                </form>
              )}
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
