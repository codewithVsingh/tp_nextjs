import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, Calendar } from "lucide-react";

const BlogCTA = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-12 rounded-2xl p-8 md:p-12 text-center"
      style={{ background: "var(--hero-gradient)" }}
    >
      <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary-foreground mb-3">
        Looking for the Best Tutor in Delhi?
      </h2>
      <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
        Join 5,000+ Delhi families who trust Tutors Parliament for personalized, result-oriented tutoring.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="hero" size="lg" className="gap-2">
          <Calendar className="w-5 h-5" /> Book Free Demo
        </Button>
        <Button variant="hero-outline" size="lg" className="gap-2">
          <Phone className="w-5 h-5" /> Talk to Expert
        </Button>
      </div>
    </motion.section>
  );
};

export default BlogCTA;
