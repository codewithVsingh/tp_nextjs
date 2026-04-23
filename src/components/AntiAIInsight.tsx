import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const AntiAIInsight = () => (
  <section
    id="anti-ai-insight"
    className="py-12 md:py-20 bg-muted/50"
  >
    <div className="container max-w-4xl mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary bg-accent px-3 py-1.5 rounded-full">
          <BookOpen className="w-3.5 h-3.5" /> Parent Insight
        </span>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
          Is your child learning…
          <br className="hidden sm:block" />
          or just <span className="text-primary">copying answers from AI?</span>
        </h2>

        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          AI tools can give answers instantly — but real learning comes from guided thinking.
          Identify learning gaps early and help your child build real understanding.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button asChild size="lg" className="w-full sm:w-auto font-semibold text-base" style={{ background: "var(--cta-gradient)" }}>
            <Link href="/counselling">
              Get Expert Guidance
            </Link>
          </Button>
          <Link
            href="/ai-in-education-for-kids-guide"
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium underline underline-offset-4"
          >
            Learn more about AI risks
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default AntiAIInsight;
