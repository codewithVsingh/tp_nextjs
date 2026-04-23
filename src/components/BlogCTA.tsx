import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, Calendar } from "lucide-react";
import Link from "next/link";;

const BlogCTA = ({ postSlug }: { postSlug?: string }) => {
  const trackingParams = postSlug ? `?from=blog_${postSlug}&cta=blog_bottom_cta` : "";
  
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
        <Button id="cta-blog-bottom-demo" variant="hero" size="lg" className="gap-2" asChild>
          <Link href={`/demo-booking${trackingParams}`}><Calendar className="w-5 h-5" /> Start Free Demo</Link>
        </Button>
        <Button id="cta-blog-bottom-call" variant="hero-outline" size="lg" className="gap-2" asChild>
          <a href="tel:+919873101564"><Phone className="w-5 h-5" /> Call: +91-9873101564</a>
        </Button>
      </div>
    </motion.section>
  );
};

export default BlogCTA;
