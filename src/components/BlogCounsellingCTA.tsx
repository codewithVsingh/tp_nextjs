import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Headphones, MessageCircle } from "lucide-react";
import Link from "next/link";;

interface BlogCounsellingCTAProps {
  variant?: "inline" | "block";
  postSlug?: string;
}

const BlogCounsellingCTA = ({ variant = "block", postSlug }: BlogCounsellingCTAProps) => {
  const trackingParams = postSlug ? `?from=blog_${postSlug}&cta=blog_counselling_${variant}` : "";
  if (variant === "inline") {
    return (
      <motion.aside
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="my-8 rounded-xl border border-secondary/30 bg-accent/60 p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
      >
        <div className="w-11 h-11 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
          <Headphones className="w-5 h-5 text-secondary" />
        </div>
        <div className="flex-1">
          <p className="font-heading font-semibold text-foreground text-sm md:text-base">
            Stuck on what to do next?
          </p>
          <p className="text-muted-foreground text-xs md:text-sm">
            Talk to a Tutors Parliament expert counsellor — first call is free.
          </p>
        </div>
        <Button id={`cta-blog-counselling-${variant}`} variant="cta" size="sm" className="gap-2 w-full sm:w-auto" asChild>
          <Link href={`/counselling${trackingParams}`}>
            <MessageCircle className="w-4 h-4" /> Talk to Counsellor
          </Link>
        </Button>
      </motion.aside>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-12 rounded-2xl p-8 md:p-12 text-center bg-accent border border-border"
    >
      <div className="w-14 h-14 rounded-2xl bg-secondary/15 flex items-center justify-center mx-auto mb-4">
        <Headphones className="w-7 h-7 text-secondary" />
      </div>
      <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-3">
        Talk to an Expert Counsellor
      </h2>
      <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
        Career stream, exam pressure, parenting concerns — our counsellors guide families across
        India over a single 30-minute conversation. The first call is on us.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button id={`cta-blog-counselling-${variant}-main`} variant="cta" size="lg" className="gap-2" asChild>
          <Link href={`/counselling${trackingParams}`}>
            <MessageCircle className="w-5 h-5" /> Talk to Counsellor
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="gap-2" asChild>
          <Link href="/counselling/student">Explore Counselling Plans</Link>
        </Button>
      </div>
    </motion.section>
  );
};

export default BlogCounsellingCTA;
