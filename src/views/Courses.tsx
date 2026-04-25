"use client";

import { useState, useMemo, useCallback } from "react";
import { openWhatsApp } from "@/modules/shared/logic/whatsapp";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Monitor, MapPin, Search, ChevronRight, Sparkles, BookOpen, GraduationCap, Trophy, FlaskConical, Brain, Code, MessageCircle, Mic, Lightbulb, PenTool, Calculator, Bot } from "lucide-react";
import Link from "next/link";;
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";

/* ─── DATA ─── */

const classCategories = [
  { label: "KG – Class 5", desc: "Build strong foundations with interactive learning and fun activities.", icon: Sparkles, tag: "Foundation" },
  { label: "Class 6 – 8", desc: "Strengthen concepts across all subjects with structured coaching.", icon: BookOpen, tag: "Middle School" },
  { label: "Class 9 – 10", desc: "Board exam preparation with focused study plans and mock tests.", icon: GraduationCap, tag: "Board Prep" },
  { label: "Class 11 – 12", desc: "Advanced subject coaching for Science, Commerce, and Arts streams.", icon: Trophy, tag: "Senior Secondary" },
];

const exams = [
  { name: "JEE Main + Advanced", desc: "Complete Physics, Chemistry & Maths coaching with IIT-level strategies.", target: "Class 11–12", cta: "Start JEE Prep Plan", slug: "jee" },
  { name: "NEET", desc: "Biology-focused preparation with comprehensive PCB coverage.", target: "Class 11–12", cta: "Start NEET Prep", slug: "neet" },
  { name: "CUET", desc: "Domain-specific prep for central university admissions.", target: "Class 12", cta: "Prepare for CUET", slug: "cuet" },
  { name: "NTSE", desc: "National Talent Search Exam preparation with SAT & MAT focus.", target: "Class 10", cta: "Start NTSE Prep", slug: "ntse" },
  { name: "Olympiads (IMO/NSO/IEO)", desc: "Specialized training for Science, Maths & English Olympiads.", target: "Class 1–12", cta: "Join Olympiad Coaching", slug: "olympiads" },
  { name: "Navodaya (JNVST)", desc: "Entrance preparation for Jawahar Navodaya Vidyalaya.", target: "Class 5–6", cta: "Start JNVST Prep", slug: "navodaya" },
  { name: "Sainik School", desc: "All India Sainik School entrance exam coaching.", target: "Class 6 & 9", cta: "Prepare Now", slug: "sainik-school" },
  { name: "KVPY / NMMS", desc: "Scholarship exam preparation with advanced problem solving.", target: "Class 8–12", cta: "Start Scholarship Prep", slug: "kvpy" },
];

const specialClasses = [
  { name: "Vedic Maths", desc: "Speed calculation techniques for faster problem solving.", icon: Calculator, tags: ["Trending"] },
  { name: "Abacus Training", desc: "Mental arithmetic mastery for young learners.", icon: Brain, tags: ["High Demand"] },
  { name: "Handwriting Improvement", desc: "Structured practice for neat, legible handwriting.", icon: PenTool, tags: ["Skill-Based"] },
  { name: "Coding (Scratch, Python)", desc: "Fun, project-based programming for kids and teens.", icon: Code, tags: ["Trending", "High Demand"] },
  { name: "AI for Students", desc: "Intro to artificial intelligence and machine learning concepts.", icon: Bot, tags: ["Trending"] },
  { name: "Robotics for Kids", desc: "Build and program robots with hands-on STEM kits.", icon: Lightbulb, tags: ["High Demand"] },
  { name: "Spoken English", desc: "Fluency and confidence through conversational practice.", icon: MessageCircle, tags: ["High Demand"] },
  { name: "Public Speaking & Debate", desc: "Presentation skills, MUN prep, and debate training.", icon: Mic, tags: ["Skill-Based"] },
  { name: "Personality Development", desc: "Confidence, leadership, and critical thinking workshops.", icon: Sparkles, tags: ["Skill-Based"] },
];

const boards = [
  { id: "cbse", name: "CBSE", benefits: ["NCERT-aligned curriculum", "Pan-India recognition", "Structured exam pattern"], subjects: ["Maths", "Science", "English", "Social Science", "Hindi", "Computer Science"] },
  { id: "icse", name: "ICSE", benefits: ["In-depth subject coverage", "Application-based learning", "Strong English focus"], subjects: ["Maths", "Physics", "Chemistry", "Biology", "English", "History & Civics"] },
  { id: "state", name: "State Boards", benefits: ["Region-specific syllabus", "Local language support", "Board-pattern focus"], subjects: ["Maths", "Science", "Social Studies", "Hindi", "English"] },
];

const faqs = [
  { question: "Which tuition is best for Class 10 CBSE?", answer: "For Class 10 CBSE, look for tutors who follow NCERT strictly and provide chapter-wise mock tests. Our verified tutors in Delhi specialize in board exam patterns and offer both online and home tuition options." },
  { question: "What is the fees for home tuition in Delhi?", answer: "Home tuition fees in Delhi range from ₹3,000–₹15,000/month depending on class, subject, and tutor experience. We help match you with affordable, verified tutors — book a free demo to get exact pricing." },
  { question: "How to prepare for JEE from Class 9?", answer: "Start with strong fundamentals in PCM, focus on NCERT, and gradually move to competitive-level problems. Our JEE Foundation program for Class 9–10 builds exactly this progression with expert mentors." },
  { question: "Are online classes effective for school students?", answer: "Yes — with the right tutor, interactive tools, and regular assessments, online classes can be as effective as in-person tuition. Over 60% of our students prefer online mode for flexibility." },
  { question: "Which subjects need tuition the most?", answer: "Maths and Science are the most-tutored subjects across all boards. English and Accounts follow closely. The need depends on the student's strengths — a free assessment can help identify gaps." },
  { question: "Do you provide tuition for IB and international boards?", answer: "Yes, we have experienced tutors for IB, IGCSE, and Cambridge curricula covering Maths, Sciences, English, and more." },
  { question: "Can I get a female tutor for my daughter?", answer: "Absolutely. We have a large pool of verified female tutors across Delhi NCR for all subjects and classes. Just mention your preference when booking." },
  { question: "How soon can I start after booking?", answer: "Most students are matched with a tutor within 24–48 hours. Your first free demo class can be scheduled as early as the same day." },
  { question: "Is there any registration fee?", answer: "No, there is zero registration fee for students. You only pay the tutor's monthly tuition fee after you're satisfied with the demo class." },
  { question: "What if I'm not happy with my tutor?", answer: "We offer a free tutor replacement guarantee. If you're not satisfied, we'll match you with another tutor at no extra cost." },
];

const searchableItems = [
  { label: "Class 10 Maths", link: "/math-home-tutor-delhi-class-10" },
  { label: "JEE Coaching", link: "/jee-coaching-delhi" },
  { label: "NEET Preparation", link: "/neet-coaching-delhi" },
  { label: "English Speaking", link: "/english-home-tutor-delhi" },
  { label: "CBSE Class 12 Physics", link: "/physics-home-tutor-delhi-class-12-cbse" },
  { label: "ICSE Science Class 9", link: "/science-home-tutor-delhi-class-9" },
  { label: "Coding for Kids", link: "/courses" },
  { label: "Vedic Maths", link: "/courses" },
  { label: "Spoken English Classes", link: "/english-home-tutor-delhi" },
  { label: "Home Tutor Rohini", link: "/home-tutor-rohini" },
  { label: "Online Tuition Delhi", link: "/courses" },
  { label: "CUET Coaching", link: "/courses" },
];

/* ─── COMPONENT ─── */

const Courses = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [prefill, setPrefill] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const openLead = useCallback((data: Record<string, string> = {}) => {
    setPrefill(data);
    setModalOpen(true);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return searchableItems.filter(i => i.label.toLowerCase().includes(q));
  }, [searchQuery]);

  const cardClass = "bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1";

  return (
    <>
      <SEOHead
        title="Tuition Classes in India | CBSE, ICSE, JEE, NEET & More"
        description="Find expert home tutors and online tuition for CBSE, ICSE, JEE, NEET, and 50+ subjects across India. Book a free demo class today."
        keywords="tuition classes India, home tutor, CBSE tuition, ICSE tuition, JEE coaching, NEET coaching, online tuition"
        canonical="https://tutorsparliament.com/courses"
      />
      
      <main className="pb-16 md:pb-0">

        {/* ━━━ HERO ━━━ */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
          <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-6 leading-tight">
                Find the Right Course for <span className="text-secondary">Your Goals</span>
              </h1>
              <p className="text-primary-foreground/80 text-lg mb-6 max-w-2xl mx-auto">
                Expert home & online tuition for every class, board, and competitive exam across Delhi NCR.
              </p>
              <div className="flex items-center justify-center gap-6 mb-8 text-sm">
                <span className="flex items-center gap-2 text-primary-foreground/90 font-medium"><Monitor className="w-4 h-4" /> Online Classes</span>
                <span className="flex items-center gap-2 text-primary-foreground/90 font-medium"><MapPin className="w-4 h-4" /> Home Tuition</span>
              </div>

              {/* Search */}
              <div className="relative max-w-xl mx-auto mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search courses, exams, subjects..."
                  className="pl-12 pr-4 py-6 text-base rounded-2xl bg-background/95 backdrop-blur border-0 shadow-lg"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background rounded-xl shadow-xl border border-border z-20 overflow-hidden">
                    {searchResults.map((r, i) => (
                      <Link key={i} href={r.link} className="flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors">
                        <span className="text-sm text-foreground">{r.label}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="text-base px-8 py-6 shadow-lg hover:scale-105 transition-transform" style={{ background: "var(--cta-gradient)" }} onClick={() => openLead({})}>
                  Get Free Demo <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
                <Button size="lg" variant="outline" className="text-base px-8 py-6 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20" asChild>
                  <Link href="/become-a-tutor">Become a Tutor</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ━━━ CLASSES BY GRADE ━━━ */}
        <section className="section-padding">
          <div className="container mx-auto max-w-6xl">
            <SectionHeader tag="By Class" title="Classes for" highlight="Every Grade" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {classCategories.map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={cardClass + " p-6 group cursor-pointer"} onClick={() => openLead({ classLevel: c.label })}>
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <c.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-medium bg-accent text-accent-foreground px-2 py-0.5 rounded-full">{c.tag}</span>
                  <h3 className="font-heading font-semibold text-lg text-foreground mt-2 mb-1">{c.label}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">{c.desc}</p>
                  <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Get Free Demo <ArrowRight className="w-3.5 h-3.5" /></span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ BOARDS (TABS) ━━━ */}
        <section className="section-padding section-alt">
          <div className="container mx-auto max-w-6xl">
            <SectionHeader tag="By Board" title="All Major" highlight="School Boards" />
            <Tabs defaultValue="cbse" className="w-full">
              <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
                {boards.map(b => <TabsTrigger key={b.id} value={b.id} className="font-heading font-semibold">{b.name}</TabsTrigger>)}
              </TabsList>
              {boards.map(b => (
                <TabsContent key={b.id} value={b.id}>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cardClass + " p-8 md:p-10"}>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-heading font-bold text-2xl text-foreground mb-4">Why {b.name}?</h3>
                        <ul className="space-y-2">
                          {b.benefits.map((ben, i) => (
                            <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm">
                              <span className="text-primary mt-0.5">✓</span> {ben}
                            </li>
                          ))}
                        </ul>
                        <Button className="mt-6" style={{ background: "var(--cta-gradient)" }} onClick={() => openLead({ board: b.name })}>
                          Find {b.name} Tutor <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-foreground mb-3">Subjects Covered</h4>
                        <div className="flex flex-wrap gap-2">
                          {b.subjects.map(s => (
                            <span key={s} className="text-xs font-medium bg-accent text-accent-foreground px-3 py-1.5 rounded-full">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* ━━━ EXAM PREPARATION (CAROUSEL-STYLE GRID) ━━━ */}
        <section className="section-padding">
          <div className="container mx-auto max-w-6xl">
            <SectionHeader tag="Competitive Exams" title="Exam" highlight="Preparation" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {exams.map((e, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className={cardClass + " p-5 flex flex-col group"}>
                  <span className="text-xs font-medium text-muted-foreground mb-1">{e.target}</span>
                  <h3 className="font-heading font-semibold text-base text-foreground mb-2">{e.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{e.desc}</p>
                  <Button size="sm" variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" onClick={() => openLead({ exam: e.name })}>
                    {e.cta} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ SPECIAL CLASSES ━━━ */}
        <section className="section-padding section-alt">
          <div className="container mx-auto max-w-6xl">
            <SectionHeader tag="Beyond Academics" title="Trending" highlight="Special Classes" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {specialClasses.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className={cardClass + " p-5 group cursor-pointer"} onClick={() => openLead({ subject: s.name })}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                      <s.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex gap-1">
                      {s.tags.map(t => (
                        <span key={t} className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${t === "Trending" ? "bg-secondary/15 text-secondary" : t === "High Demand" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-heading font-semibold text-base text-foreground mb-1">{s.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">{s.desc}</p>
                  <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Join Free Trial <ArrowRight className="w-3.5 h-3.5" /></span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ SEO CONTENT (ACCORDIONS) ━━━ */}
        <section className="section-padding">
          <div className="container mx-auto max-w-4xl">
            <SectionHeader tag="Helpful Guides" title="Make the Right" highlight="Choice" />
            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="choose" className="bg-background rounded-xl px-6 border border-border card-shadow">
                <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:no-underline">How to Choose the Right Tuition?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed space-y-2">
                  <p>Choosing the right tuition depends on your child's learning style, board, and goals. Consider these factors:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li><strong>Board alignment</strong> — Ensure the tutor is experienced with your specific board (CBSE, ICSE, or State).</li>
                    <li><strong>Teaching mode</strong> — Online works for self-motivated students; home tuition suits younger learners.</li>
                    <li><strong>Track record</strong> — Ask for student results, demo classes, and parent reviews.</li>
                    <li><strong>Flexibility</strong> — Good tuition adapts to the student's pace, not the other way around.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="compare" className="bg-background rounded-xl px-6 border border-border card-shadow">
                <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:no-underline">Online vs Home Tuition — Which is Better?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse mt-2">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 pr-4 font-semibold text-foreground">Factor</th>
                          <th className="text-left py-2 pr-4 font-semibold text-foreground">Online</th>
                          <th className="text-left py-2 font-semibold text-foreground">Home Tuition</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr className="border-b border-border/50"><td className="py-2 pr-4">Convenience</td><td className="py-2 pr-4">High — learn from anywhere</td><td className="py-2">Moderate — fixed schedule</td></tr>
                        <tr className="border-b border-border/50"><td className="py-2 pr-4">Personal Attention</td><td className="py-2 pr-4">Good (1-on-1)</td><td className="py-2">Excellent (in-person)</td></tr>
                        <tr className="border-b border-border/50"><td className="py-2 pr-4">Cost</td><td className="py-2 pr-4">Lower</td><td className="py-2">Higher</td></tr>
                        <tr><td className="py-2 pr-4">Best For</td><td className="py-2 pr-4">Class 6+ & exam prep</td><td className="py-2">KG–Class 5 & weak students</td></tr>
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="class-suggestions" className="bg-background rounded-xl px-6 border border-border card-shadow">
                <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:no-underline">Best Courses Based on Your Class</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed space-y-2 text-sm">
                  <p><strong>KG–Class 5:</strong> Foundation Maths, English reading & writing, EVS, Handwriting, Abacus.</p>
                  <p><strong>Class 6–8:</strong> All subjects + Olympiad prep, Vedic Maths, Coding introduction.</p>
                  <p><strong>Class 9–10:</strong> Board exam prep (Maths, Science, SST), NTSE, Navodaya entrance.</p>
                  <p><strong>Class 11–12:</strong> Stream-specific coaching, JEE/NEET/CUET, Spoken English, AI & Coding.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* ━━━ MID-PAGE CTA ━━━ */}
        <section className="py-16 px-4" style={{ background: "var(--hero-gradient)" }}>
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary-foreground mb-4">Not Sure Which Course to Pick?</h2>
            <p className="text-primary-foreground/80 mb-6">Talk to our academic counsellor — get a personalized study plan in 5 minutes.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="text-base px-8 py-6 shadow-lg hover:scale-105 transition-transform" style={{ background: "var(--cta-gradient)" }} onClick={() => openLead({})}>
                Get Free Demo <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 py-6 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20" onClick={() => openWhatsApp("Hi, I need help choosing a course")}>
                  <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp Us
              </Button>
            </div>
          </div>
        </section>

        {/* ━━━ FAQs ━━━ */}
        <FAQSection faqs={faqs} subtitle="Common Questions" title="Everything You Need to Know" />

      </main>
      

      <StickyMobileCTA onCtaClick={() => openLead({})} />
      <LeadCaptureModal open={modalOpen} onOpenChange={setModalOpen} prefill={prefill} />
    </>
  );
};

/* ─── SHARED SECTION HEADER ─── */

const SectionHeader = ({ tag, title, highlight }: { tag: string; title: string; highlight: string }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
    <span className="text-secondary font-semibold text-sm uppercase tracking-wider">{tag}</span>
    <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mt-2">{title} <span className="text-primary">{highlight}</span></h2>
  </motion.div>
);

export default Courses;

