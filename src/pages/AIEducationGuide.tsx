import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Phone, CheckCircle2, ShieldCheck, Users, BarChart3, Brain, AlertTriangle, Lightbulb } from "lucide-react";
import { useState } from "react";
import { openWhatsApp } from "@/lib/whatsapp";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  organizationSchema,
} from "@/lib/seoSchema";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45 },
};

const whatsappMsg = "Hi, I need a home tutor for my child. I'm concerned about AI dependency.";

const aiGuideFaqs = [
  {
    question: "Is AI like ChatGPT good or bad for my child's learning?",
    answer:
      "AI tools are useful when used as a supplement, but harmful when they replace genuine thinking. The risk is that students start copying answers without understanding concepts, leading to false confidence and poor exam performance.",
  },
  {
    question: "How do I know if my child is over-relying on AI?",
    answer:
      "Common signs include high homework grades but low test scores, inability to explain concepts verbally, reduced focus, and giving up quickly when answers aren't instant. Open conversations with your child about their study process help identify the issue early.",
  },
  {
    question: "Should I ban AI tools at home?",
    answer:
      "A complete ban often backfires. Instead, set clear boundaries — AI can be used to clarify a doubt or check work, but not to generate the entire answer. Pair it with a human tutor who teaches the thinking process.",
  },
  {
    question: "Can a home tutor help reverse AI dependency?",
    answer:
      "Yes. A good tutor identifies exactly where your child is stuck, teaches the underlying concept, and trains them to think independently. Most students show measurable improvement within 30 days.",
  },
];

const BulletList = ({ items, icon: Icon }: { items: string[]; icon: React.ElementType }) => (
  <ul className="space-y-3">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3 text-foreground">
        <Icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <span className="text-sm md:text-base leading-relaxed">{item}</span>
      </li>
    ))}
  </ul>
);

const AIEducationGuide = () => {
  const [showModal, setShowModal] = useState(false);
  const canonicalUrl = "https://tutorsparliament.com/ai-in-education-for-kids-guide";

  return (
    <>
      <SEOHead
        title="AI in Education for Kids: Benefits, Risks & What Parents Should Know"
        description="Learn how AI tools impact your child's learning, risks of overuse, and how guided tutoring helps build real understanding."
        keywords="AI in education, AI for kids, ChatGPT for students, AI risks children, home tutor vs AI, guided learning India"
        canonical={canonicalUrl}
        structuredData={[
          organizationSchema,
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "AI in Education Guide", path: "/ai-in-education-for-kids-guide" },
          ]),
          buildArticleSchema({
            headline: "AI in Education for Kids: Benefits, Risks & What Parents Should Know",
            description:
              "How AI tools impact your child's learning, the risks of overuse, and how guided tutoring helps build real understanding.",
            url: canonicalUrl,
            datePublished: "2025-01-15",
          }),
          buildFaqSchema(aiGuideFaqs),
        ]}
      />
      <Navbar />

      <main className="pb-16 md:pb-0">
        {/* Hero — single CTA only */}
        <section className="py-16 md:py-24" style={{ background: "var(--hero-gradient)" }}>
          <div className="container max-w-4xl mx-auto px-4 text-center text-primary-foreground">
            <motion.div {...fadeUp} className="space-y-5">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Is AI Helping or Hurting<br className="hidden sm:block" /> Your Child's Learning?
              </h1>
              <p className="text-base md:text-lg max-w-2xl mx-auto opacity-90 leading-relaxed">
                From ChatGPT to AI homework solvers — understand the real impact on your child's academic growth and what you can do about it.
              </p>
              <Button size="lg" variant="cta" className="font-bold" onClick={() => setShowModal(true)}>
                Book Free Demo <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Short-Term Effects — NO CTA */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container max-w-3xl mx-auto px-4">
            <motion.div {...fadeUp} className="space-y-6">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> Short-Term Effects
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">What Happens When Kids Rely on AI</h2>
              <BulletList
                icon={AlertTriangle}
                items={[
                  "Homework gets 'completed' without understanding core concepts",
                  "Students copy-paste AI answers, skipping the thinking process entirely",
                  "False confidence — high grades on AI-assisted work but low test scores",
                  "Reduced attention span and inability to focus on problem-solving",
                  "Teachers can't identify real learning gaps when AI masks them",
                ]}
              />
            </motion.div>
          </div>
        </section>

        {/* Long-Term Impact — NO CTA */}
        <section className="py-12 md:py-16 bg-muted/50">
          <div className="container max-w-3xl mx-auto px-4">
            <motion.div {...fadeUp} className="space-y-6">
              <div className="flex items-center gap-2 text-destructive font-semibold text-sm uppercase tracking-wider">
                <Brain className="w-4 h-4" /> Long-Term Impact
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">The Hidden Cost of AI Dependency</h2>
              <BulletList
                icon={Brain}
                items={[
                  "Critical thinking and analytical skills fail to develop properly",
                  "Students struggle in competitive exams (JEE, NEET) where AI isn't available",
                  "Poor communication and writing skills due to AI-generated content reliance",
                  "Lack of resilience — giving up quickly when answers aren't instant",
                  "Widening gap between AI-assisted performance and actual competence",
                ]}
              />
            </motion.div>
          </div>
        </section>

        {/* What Parents Should Do — NO CTA */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container max-w-3xl mx-auto px-4">
            <motion.div {...fadeUp} className="space-y-6">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" /> Parent Action Plan
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">What Parents Should Do Right Now</h2>
              <BulletList
                icon={CheckCircle2}
                items={[
                  "Set clear boundaries — AI can assist learning, not replace it",
                  "Monitor homework process, not just the final answers",
                  "Encourage your child to explain concepts verbally after studying",
                  "Invest in a tutor who teaches thinking, not just answers",
                  "Use AI as a supplementary tool, not the primary learning source",
                  "Have open conversations about academic honesty and real understanding",
                ]}
              />
            </motion.div>
          </div>
        </section>

        {/* Why Human Tutors Matter + single WhatsApp CTA after */}
        <section className="py-12 md:py-16 bg-muted/50">
          <div className="container max-w-3xl mx-auto px-4">
            <motion.div {...fadeUp} className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Why Human Tutors Still Matter More Than Ever</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Brain, title: "Concept Clarity", desc: "Tutors identify exactly where your child is stuck and explain in a way that clicks." },
                  { icon: BarChart3, title: "Progress Tracking", desc: "Weekly assessments and real feedback — no AI hallucinations or guesswork." },
                  { icon: Users, title: "Personalized Teaching", desc: "Adapts to your child's pace, learning style, and emotional state." },
                ].map((card, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
                    <card.icon className="w-8 h-8 text-primary" />
                    <h3 className="font-semibold text-foreground">{card.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>
              <div className="pt-4 flex justify-center">
                <Button variant="outline" size="lg" className="font-semibold border-primary text-primary hover:bg-primary/5" onClick={() => openWhatsApp(whatsappMsg)}>
                    <MessageCircle className="w-4 h-4 mr-1.5" /> Chat on WhatsApp
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <motion.div {...fadeUp} className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Trusted by 5,000+ Parents Across India</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: ShieldCheck, label: "Verified & Background-Checked Tutors" },
                  { icon: CheckCircle2, label: "Free Demo Class — No Commitment" },
                  { icon: Users, label: "Proven Improvement in 30 Days" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-4">
                    <item.icon className="w-8 h-8 text-primary" />
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bridge to Counselling */}
        <section className="py-12 md:py-16 bg-muted/50">
          <div className="container max-w-3xl mx-auto px-4">
            <motion.div {...fadeUp} className="rounded-2xl border border-border bg-card p-6 md:p-10 text-center space-y-5">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Not sure what your child actually needs?
              </h2>
              <ul className="grid gap-3 sm:grid-cols-3 text-left max-w-2xl mx-auto">
                {[
                  "Lack of focus",
                  "Confused learning approach",
                  "Overdependence on AI",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm md:text-base text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground text-base max-w-xl mx-auto">
                Talk to an expert counsellor to identify the real problem before it impacts performance.
              </p>
              <Button asChild size="lg" className="font-bold" style={{ background: "var(--cta-gradient)" }}>
                <Link to="/counselling">
                  Explore Counselling <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Final CTA — ALL THREE buttons */}
        <section className="py-16 md:py-20" style={{ background: "var(--hero-gradient)" }}>
          <div className="container max-w-3xl mx-auto px-4 text-center text-primary-foreground">
            <motion.div {...fadeUp} className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">Give Your Child the Gift of Real Learning</h2>
              <p className="opacity-90 max-w-xl mx-auto">
                Don't let AI replace genuine understanding. Connect with a verified home tutor today and see the difference guided learning makes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" variant="cta" className="w-full sm:w-auto font-bold" onClick={() => setShowModal(true)}>
                  Book Free Demo <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => openWhatsApp(whatsappMsg)}>
                    <MessageCircle className="w-4 h-4 mr-1" /> Chat on WhatsApp
                </Button>
                <Button size="lg" variant="ghost" className="w-full sm:w-auto font-semibold text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <a href="tel:+919873101564">
                    <Phone className="w-4 h-4 mr-1" /> Call Now
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyMobileCTA onCtaClick={() => setShowModal(true)} />
      <LeadCaptureModal open={showModal} onOpenChange={setShowModal} source="ai_guide_page" />
    </>
  );
};

export default AIEducationGuide;
